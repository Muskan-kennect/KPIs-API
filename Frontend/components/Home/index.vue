<template>
  <div class="container">
    <!-- First Row -->
    <div class="row">
      <!-- Container 1 - Search Bar with Filter Button -->
      <div class="container-1">
        <div class="input-button-div">
          <i class="fas fa-search"></i>
          <input
            class="search-placeholder"
            type="text"
            @change="debouncedSearch($event.target.value)"
            placeholder="placeholder"
          />
        </div>
        <button class="filter-button" @click="openFilterModal">Group-By</button>
        <button class="filter-button" @click="openFilterModal">Filter</button>
      </div>

      <!-- Container 2 - Create KPI Button -->
      <div class="container-2">
        <button class="create-button" @click="openCreateModal">
          + Create KPI
        </button>
      </div>
    </div>

    <div class="row">
      <div class="container-table">
        <v-data-table :headers="headers" :items="allDrafts">
          <thead>
            <tr>
              <th v-for="item in tableHeaders">
                {{ item }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in allDrafts" :key="item.name">
              <td>{{ item?.name }}</td>
              <td>{{ item?.displayName }}</td>
              <td>{{ item?.setup?.source?.displayName }}</td>
              <td>{{ arrayToCsv(item?.labels) }}</td>
              <td>
                <v-btn :class="getStatusClass(item?.isPublished)">
                  {{ item.isPublished ? "Published" : "Draft" }}
                </v-btn>
              </td>
              <td class="action-items">
                <i
                  class="fas fa-eye"
                  @click="viewItem(item)"
                  title="View KPI"
                ></i>
                <i
                  class="fas fa-pencil-alt"
                  @click="editItem(item)"
                  title="Compose KPI"
                ></i>
                <VLabel class="more-icon-button" activator="parent">
                  <i class="fas fa-ellipsis-v" @click="moreActions(item)"></i>

                  <v-menu activator="parent">
                    <v-list>
                      <v-list-item>
                        <v-list-item-title
                          class="menu-icon-list-item"
                          @click="openCloneModal(item._id)"
                        >
                          <i class="fas fa-copy" title="Copy"></i>
                          <VLabel>Clone</VLabel>
                        </v-list-item-title>
                        <v-divider />
                        <v-list-item-title class="menu-icon-list-item">
                          <i
                            class="fas fa-pencil-alt"
                            title="Compose KPI"
                            @click="openEditModal(item._id)"
                          ></i>
                          <VLabel>Edit</VLabel>
                        </v-list-item-title>
                        <v-divider />
                        <v-list-item-title
                          class="menu-icon-list-item"
                          @click="openDeleteModal(item._id)"
                        >
                          <i class="fas fa-trash-alt" title="Delete"></i>
                          <VLabel>Delete</VLabel>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </VLabel>
                <v-btn
                  v-if="!item.isPublished"
                  class="publish-button"
                  @click="openPublishSaveModal(item)"
                  >Publish</v-btn
                >
              </td>
            </tr>
          </tbody>
        </v-data-table>
      </div>
    </div>

    <div class="row">
      <v-btn @click="MoveToSelectedPage(currentPage - 1)">
        <i class="fas fa-chevron-left"></i>
      </v-btn>
      <v-btn @click="MoveToSelectedPage(currentPage + 1)">
        <i class="fas fa-chevron-right"></i>
      </v-btn>
    </div>
    <!--FILTER -->
    <v-dialog v-model="filterModal" max-width="500">
      <v-card class="card-css">
        <v-card-title class="modal-heading">
          Filter Modal
          <VLabel class="heading-button" @click="closeFilterModal">X</VLabel>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="content-card-css">
          <v-container fluid>
            <v-row cols="12" sm="4" md="4">
              <v-checkbox
                @change="handleFilterChange($event.target.value, 'ex1')"
                label="Foo"
                value="Foo"
                v-model="ex1"
                hide-details
              ></v-checkbox>
            </v-row>
            <v-row cols="12" sm="4" md="4">
              <v-checkbox
                @change="handleFilterChange($event.target.value, 'ex2')"
                label="Buzz"
                value="Buzz"
                hide-details
                v-model="ex2"
              ></v-checkbox>
            </v-row>
            <v-row cols="12" sm="4" md="4">
              <v-checkbox
                @change="handleFilterChange($event.target.value, 'ex3')"
                label="Bizz"
                value="Bizz"
                v-model="ex3"
                hide-details
              ></v-checkbox>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="function-buttons">
          <v-btn class="cancel-button" @click="resetFilterModal" outlined>
            Reset</v-btn
          >
          <v-btn class="save-button" @click="saveFilter" outlined>Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Publish Start Modal-->
    <v-dialog v-model="publishModal" max-width="500">
      <v-card>
        <v-card-title class="modal-heading">
          Publish KPI's
          <VLabel class="heading-button" @click="closePublishModal">X</VLabel>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="content-card-css">
          <p>Are you sure you want to publish this KPI?</p>
        </v-card-text>
        <v-card-actions class="other-modal">
          <v-btn class="cancel-button-2" @click="closePublishModal" outlined>
            Cancel</v-btn
          >
          <v-btn class="save-button" outlined>Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Publish Draft Save Modal-->
    <v-dialog v-model="publishSaveModal" max-width="700">
      <v-card>
        <v-card-title class="modal-heading">
          Publish KPI's
          <VLabel class="heading-button" @click="closePublishSaveModal"
            >X</VLabel
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="content-card-css">
          <v-label class="publish-safe-kpi-warning">
            <i class="fas fa-info-circle"></i>
            Publishing these chnages might affect the schemas in which this KPI
            is used</v-label
          >
          <v-container class="publish-save-text-container">
            <v-label>KPI Name</v-label>
            <v-label>Linked Schemas:</v-label>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions class="other-modal">
          <v-btn
            class="cancel-button-2"
            @click="closePublishSaveModal"
            outlined
          >
            Cancel</v-btn
          >
          <v-btn class="save-button" @click="finalPublishHandler" outlined
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Clone KPI-->
    <v-dialog v-model="cloneModal" max-width="500">
      <v-card>
        <v-card-title class="modal-heading">
          Clone KPI's
          <VLabel class="heading-button" @click="closeCloneModal">X</VLabel>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="content-card-css">
          <p>Are you sure you want to clone this KPI?</p>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="other-modal">
          <v-btn class="cancel-button-2" @click="closeCloneModal" outlined>
            Cancel</v-btn
          >
          <v-btn class="clone-save-button" @click="finalCloneHandler" outlined
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--FILTER -->
    <v-dialog v-model="deleteModal" max-width="500">
      <v-card>
        <v-card-title class="modal-heading">
          Delete KPI's
          <VLabel class="heading-button" @click="closeDeleteModal">X</VLabel>
        </v-card-title>

        <v-card-text class="content-card-css">
          <p>Are you sure you want to delete this KPI ?</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="other-modal">
          <v-btn class="cancel-button-2" @click="closeDeleteModal" outlined>
            Cancel</v-btn
          >
          <v-btn class="delete-save-button" @click="finalDeleteHandler" outlined
            >DELETE</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create KPI Modal -->
    <v-dialog v-model="createModal" max-width="500">
      <v-card class="card-css">
        <v-card-title class="modal-heading">
          Create KPI
          <VLabel class="heading-button" @click="closeCreateModal">X</VLabel>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="content-card-css">
          <!-- Row 1 -->
          <div class="row">
            <div class="input-label">
              <label for="input1">Display Name</label>
              <input
                @change="handleOnChangeHandler($event.target.value, 'name')"
                class="input-field-style"
                id="input1"
                type="text"
              />
            </div>
            <div class="input-label" style="margin-left: 20px">
              <label for="input2">Unique Ref Name</label>
              <input
                :value="uniqueName"
                readOnly
                class="input-field-style"
                id="input2"
                type="text"
              />
            </div>
          </div>
          <!-- Row 2 -->
          <div class="input-label">
            <label for="select2">Tag BUs</label>
            <v-select
              v-model="tagBU"
              :items="items"
              item-value="value"
              item-text="text"
              multiple
              dense
              chips
              outlined
              label="Tag BUs"
              hide-details
            ></v-select>
          </div>
          <!-- Row 3 -->
          <div class="input-label">
            <label for="select2">CICQ</label>
            <select
              class="CICQ-Class"
              @change="handleOnChangeHandler($event.target.value, 'CICQ')"
            >
              <option v-for="item in CICQ_Items" :key="item.id">
                {{ item.name }}
              </option>
            </select>
          </div>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="function-buttons">
          <v-btn
            class="cancel-button"
            @click="resetHandlerOfKPICreation"
            outlined
          >
            Reset</v-btn
          >
          <v-btn class="save-button" @click="createKPIHnadler" outlined
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script scoped>
import axios from "axios";
import { useRouter } from "vue-router";
export default {
  data() {
    return {
      items: [], // Data for Vuetify Table
      headers: [], // Headers for Vuetify Table
      filterModal: false,
      createModal: false,
      checkbox1: false,
      checkbox2: false,
      checkbox3: false,
      checkbox4: false,
      selectedItem: null,
      cloneModal: false,
      deleteModal: false,
      publishModal: false,
      publishSaveModal: false,
      currentPage: 1,
      currentOffset: 0,
      ex1: null,
      ex2: null,
      ex3: null,
      currentCount: 1,
      displayName: "",
      uniqueName: "",
      tagBU: "",
      publishKPI: {},
      CICQ: {},
      editKPIId: {},
      deleteKPIId: {},
      cloneKPIId: {},
      menuItems: [
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me 2" },
      ],
      ex4: [
        "red",
        "indigo",
        "orange",
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "error",
        "red darken-3",
        "indigo darken-3",
        "orange darken-3",
      ],
      pagination: {
        descending: false,
        sortBy: null,
        page: 1,
        rowsPerPage: 6, // Set to your desired default rows per page
      },
      items: ["Foo", "Bar", "Fizz", "Buzz"],
      CICQ_Items: [
        { id: 1, name: "CICQ1" },
        { id: 2, name: "CICQ2" },
        { id: 3, name: "CICQ3" },
        { id: 4, name: "CICQ4" },
        { id: 5, name: "CICQ5" },
      ],
      tableHeaders: [
        "Display Name",
        "Unique Ref name",
        "CIQC Dataset",
        "Toggle BU",
        "Status",
        " ",
      ],
      allDrafts: [],
    };
  },
  components: [
    "VCheckbox",
    // Add other Vuetify components here if needed
  ],

  mounted() {
    this.getAllDrafts();
  },
  methods: {
    openFilterModal() {
      this.filterModal = true;
    },
    editItem(item) {
      const id = item._id;
      this.$router.push(`/Draft/${item._id}`);
    },

    //move to the selected page either previous or  next
    MoveToSelectedPage(page) {
      const offset =  Number(page - 1) * Number(8);
      const limit = 8;
      this.currentPage = page;
      this.getAllDrafts(limit, offset);
    },

    handleFilterChange(value, field) {
      console.log(value, field);
      if (String(field) === "ex1") {
        this.ex1 = value;
      }
      if (String(field) === "ex2") {
        this.ex2 = value;
      }
      if (String(field) === "ex3") {
        this.ex3 = value;
      }
    },

    viewItem(item) {
      // Logic to handle viewing the item
      console.log("Viewing item:", item);
    },
    moreActions(item) {
      // Logic to handle more actions for the item
      console.log("More actions for item:", item);
    },
    getStatusClass(status) {
      // Define your logic to return the class based on the status value
      // For example:
      if (status) {
        return "table-status--success-button";
      } else {
        return "table-status--failure-button";
      }
    },

    //handle the search filter handler
    debouncedSearch(value) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.handleSearchFilter(value);
      }, 300); // Debounce delay in milliseconds (adjust as needed)
    },
    handleSearchFilter(value) {
      const filteringString = value;
      const url = "http://localhost:8009/draft/searchDraft";
      axios
        .get(url, {
          params: {
            query: filteringString,
          },
        })
        .then((res) => {
          this.allDrafts = res.data;
        })
        .catch((err) => {
          alert(err);
        });
    },

    closeFilterModal() {
      this.ex1 = null;
      this.ex2 = null;
      this.ex3 = null;
      this.filterModal = false;
    },

    resetFilterModal(){
      this.ex1 = null;
      this.ex2 = null;
      this.ex3 = null;
    },

    openCreateModal() {
      this.createModal = true;
    },
    closeCreateModal() {
      this.createModal = false;
    },
    openCloneModal(kpiId) {
      let getSelectedDraft = {};

      this.allDrafts.map((draft, index) => {
        if (String(draft._id) === String(kpiId)) {
          getSelectedDraft = draft;
        }
      });
      const modifiedUniqueName = this.generateUniqueName(
        getSelectedDraft.displayName
      );
      getSelectedDraft.displayName = modifiedUniqueName;

      this.cloneKPI = getSelectedDraft;
      this.cloneModal = true;
    },

    convertValuesToCSV() {
      let returnedString = "";
      if (this.ex1 !== undefined && this.ex1 !== null) {
        returnedString += this.ex1 + ",";
      }
      if (this.ex2 !== undefined && this.ex2 !== null) {
        returnedString += this.ex2 + ",";
      }
      if (this.ex3 !== undefined && this.ex3 !== null) {
        returnedString += this.ex3 + ",";
      }
      return returnedString;
    },

    arrayToCsv(data) {
      if (!Array.isArray(data) || data.length === 0) {
        return "";
      }

      const csvRows = [];
      // Process header row if the array contains objects
      if (typeof data[0] === "object") {
        const headerRow = Object.keys(data[0]).join(",");
        csvRows.push(headerRow);
      }

      // Process data rows
      data.forEach((row) => {
        if (typeof row === "object") {
          const values = Object.values(row).map((value) => `"${value}"`);
          csvRows.push(values.join(","));
        } else {
          csvRows.push(row);
        }
      });

      return csvRows.join("\n");
    },
    // filter the rows
    saveFilter() {
      const filteringLabels = this.convertValuesToCSV();
      const offset =  Number(this.currentPage -1) * Number(8);
      const limit = 8;
      this.getAllDrafts(limit, offset,filteringLabels);
      this.filterModal = false;
    },

    //final publish modal submission
    finalPublishHandler() {
      const oldKPI = this.publishKPI;
      const newKPI = {
        isPublished: true,
      };
      const KPIUpdateId = oldKPI._id;

      const url = `http://localhost:8009/draft/updateDraft/${KPIUpdateId}`;
      const method = "put";

      axios
        .put(url, newKPI)
        .then((res) => {
          this.publishModal = false;
          alert("Successfully published the selected KPI");
        })
        .catch((err) => {
          alert(err);
        });
    },

    //final clone handler which will add the replica of the selected KPI
    finalCloneHandler() {
      this.createKPIHnadler(this.cloneKPI);
    },

    //final delete handler  for deleting the selected KPI
    finalDeleteHandler() {
      this.deleteKPIHandler(this.deleteKPI);
    },

    closeCloneModal() {
      this.cloneKPI = {};
      this.cloneModal = false;
    },
    openDeleteModal(kpiId) {
      let getSelectedDraft = {};

      this.allDrafts.map((draft, index) => {
        if (String(draft._id) === String(kpiId)) {
          getSelectedDraft = draft;
        }
      });
      this.deleteKPI = getSelectedDraft;
      this.deleteModal = true;
    },
    closeDeleteModal() {
      this.deleteKPI = {};
      this.deleteModal = false;
    },
    openEditModal(kpiId) {
      console.log("kpiId", kpiId);
    },
    openPublishModal() {
      this.publishModal = true;
    },
    closePublishModal() {
      this.publishSaveModal = false;
    },
    openPublishSaveModal(KPI) {
      this.publishKPI = KPI;
      this.publishSaveModal = true;
    },
    closePublishSaveModal() {
      this.publishSaveModal = false;
    },

    //calculate the uniquename
    generateUniqueName(providedName2) {
      const providedName = providedName2 ? providedName2 : this.displayName;

      if (providedName === "") {
        this.uniqueName = "";
        return "";
      }
      const counter = this.currentCount + 1;
      const newName = `${providedName || "name"}_unique${counter}`;
      this.currentCount = counter;
      this.uniqueName = newName;

      return newName;
    },

    //add the KPI
    handleOnChangeHandler(value, field) {
      if (String(field) === "name") {
        this.displayName = value;
        const counter = this.currentCount + 1;
        const newName = `${value || "name"}_unique${counter}`;
        if (value) {
          this.currentCount = counter;
        }
        this.uniqueName = newName;
      } else if (String(field) === "CICQ") {
        let addedItemId = {};
        this.CICQ_Items.map((item, index) => {
          if (String(value) === String(item.name)) {
            addedItemId = item;
          }
        });
        this.CICQ = addedItemId;
      }
    },

    //get the labels separated
    getBULabelsAsArray() {
      let requiredArray = [];
      this.tagBU.map((bu, index) => {
        if (bu !== "") requiredArray.push(bu);
      });

      return requiredArray;
    },

    //reset handler for clearing the data
    resetHandlerOfKPICreation() {
      this.displayName = "";
      this.uniqueName = "";
      (this.CICQ = {}), (this.tagBU = "");
      this.createModal = false;
    },

    //create the new KPI when save button is being triggered
    createKPIHnadler(clonePayload) {
      let payload = {};
      if (!clonePayload.name) {
        payload = {
          name: this.displayName,
          displayName: this.uniqueName,
          type: "kpi",
          resType: "kpi",
          labels: this.getBULabelsAsArray(),
          mode: "draft",
          isPublished: false,
          isRevised: false,
          setup: {
            source: {
              id: this.CICQ.id,
              displayName: this.CICQ.name,
            },
            configurations: {},
            mainFlow: {},
            customParams: {},
          },
          record: {
            createdBy: "",
            updatedBy: "",
            publishedOn: "",
            createdOn: "",
            updatedOn: "",
            active: true,
          },
        };
      }

      const finalPayload = clonePayload?.name ? clonePayload : payload;

      const url = "http://localhost:8009/draft/addDraft";
      const method = "post";

      axios
        .post(url, finalPayload)
        .then((res) => {
          if (clonePayload?.name) {
            alert("Added the cloned KPI !!");
            this.cloneKPI = {};
            this.cloneModal = false;
          } else {
            alert("Successfully added the KPI!!");
            this.createModal = false;
          }
        })
        .catch((err) => {
          alert(err);
        });
    },

    deleteKPIHandler(clonePayload) {
      const url = `http://localhost:8009/draft/updateDraft/${this.deleteKPI._id}`;
      const method = "delete";

      axios
        .delete(url)
        .then((res) => {
          alert("Successfully deleted the selected KPI");
        })
        .catch((err) => {
          alert(err);
        });
    },

    getAllDrafts(limit, offset, filteringLabels) {
      const url = "http://localhost:8009/draft/getAllDrafts";
      const method = "get";

      axios
        .get(url, {
          params: {
            limit: 8,
            offset: offset ? offset : 0,
            filterLabels: filteringLabels,
          },
        })
        .then((res) => {
          const drafts = res.data;
          console.log("drafts", drafts);
          this.allDrafts = drafts;
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: white !important;
  align-items: stretch;
}

.action-items i {
  padding: 4%;
}

.search-placeholder {
  height: 4%;
  padding: 3%;
}

.search-filter-main-div {
  border: 2px solid darkgray;
}

.publish-safe-kpi-warning {
  background-color: rgba(203, 161, 82, 0.811);
  padding: 1%;
  border-radius: 8px;
  color: rgb(110, 38, 7);
  font-size: small;
  width: 96%;
}

.publish-save-text-container {
  display: flex;
  flex-direction: column;
  color: rgb(81, 76, 76);
}

.CICQ-Class {
  width: 96%;
  border: 2px solid rgba(113, 110, 110, 0.534);
  border-radius: 8px;
  padding: 2%;
}

.publish-save-text-container v-label {
  font-size: small;
  font-weight: 100;
}

.publish-safe-kpi-warning i {
  margin: 1%;
}

.publish-button {
  background-color: rgba(161, 161, 226, 0.513);
}
.table-status--success-button {
  border: 2px solid green;
  border-radius: 12px;
  font-size: 14px;
  color: green;
}

.table-status--failure-button {
  border: 2px solid rgb(96, 23, 23);
  border-radius: 12px;
  font-size: 14px;
  color: rgb(96, 23, 23);
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.other-modal {
  display: flex;
  border: 3px solid #1c915b;
  border-top: 0px;
  justify-content: space-between;
}

.container-table tr {
  width: 100%;
  font-weight: 300;
  color: black;
  background-color: white;
}

.container-table th {
  background-color: rgba(202, 198, 198, 0.54);
  color: rgba(0, 0, 0, 0.74);
  font-size: 14px;
}

.clone-delete-funtions {
  justify-content: space-between;
}

.input-label input {
  border-radius: 8px !important;
  font-weight: 100;
  font-size: small;
  color: rgb(53, 52, 52);
  width: 100%;
}

.input-label label {
  font-size: small;
  color: gray;
  font-weight: 100;
}

.input-field-style {
  border: 2px solid rgba(146, 137, 137, 0.701);
}

.input-label {
  font-size: 16px !important;
}

.function-buttons {
  border: 3px solid #1c915b;
  border-top: 0px;
  justify-content: end;
}

.heading-button {
  flex: auto;
  margin-left: 70%;
  border-radius: 50%;
  color: #000;
  font-weight: 800;
  border-color: white;
}

.input-button-div {
  background-color: white;
  padding: 6px;
  border-radius: 8px;
  font-size: 14px;
  border: 2px solid rgba(169, 169, 169, 0.593);
  color: gray;
}

.content-card-css {
  border: 3px solid #1c915b;
  border-top: 0px;
  border-bottom: 0px;
}

.actions-card-css {
  border: 3px solid #1c915b;
  border-top: 0px;
}

.modal-heading {
  font-size: 16px;
  border: 3px solid #1c915b;
  border-bottom: 2px solid gray;
  color: rgba(54, 52, 52, 0.749);
}

.container-1,
.container-2 {
  flex: 1;
  margin-right: 10px;
  display: flex;
  border-radius: 8px;
  flex-direction: row;
}

.container-table {
  flex: 1;
  margin-right: 10px;
  display: flex;
  min-height: 460px;
  border-radius: 8px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  flex-direction: row;
}

.row {
  margin-bottom: 20px;
}

.input-label {
  margin-bottom: 10px;
}

label {
  display: block;
  font-weight: bold;
}

/* Adjust the width and appearance of the select element */
.v-select {
  width: 100%;

  border-radius: 4px;
  padding: 8px;
  font-size: 14px;
  line-height: 1.5;
}

/* Style for the selected option in the dropdown */
.v-list-item__title {
  font-size: 14px;
}

/* Style for the dropdown menu */
.v-menu__content {
  max-height: 200px; /* Adjust the max height of the dropdown menu */
  overflow-y: auto;
}

/* Style for the dropdown menu items */
.v-list-item {
  min-height: auto;
  padding-top: 8px;
  padding-bottom: 8px;
}

input {
  padding: 8px;
  border: 1px solid white;
  border-radius: 4px;
  width: 90%;
  border-radius: 12px;
}

input:focus {
  outline: none;
}

.filter-button {
  padding: 4px 8px;
  border: 1px solid #76cda6d1;
  background-color: #7ccea9d6;
  color: black;
  font-size: 14px;
  border-radius: 4px;
  margin-left: 4%;
  cursor: pointer;
}

.create-button {
  padding: 8px 16px;
  border: 1px solid #5b957b;
  background-color: #5b957b;
  color: #fff;
  font-size: medium;
  border-radius: 4px;
  margin-left: 4%;
  margin-left: 70%;
  cursor: pointer;
}

.card-css {
  border: 2px solid #5b957b;
}

.create-button-clone-delete {
  border: 1px solid #24bb74;
  background-color: #24bb74;
  margin-left: 10%;
  color: #fff;
}

.cancel-button {
  background-color: rgba(88, 81, 81, 0.614);
  color: black;
  border: 2px solid black;
  border-radius: 8px;
}

.cancel-button:hover {
  background-color: rgba(255, 255, 255, 0.614) !important;
  color: #1c915b !important;
  border: 1px solid #1c915b !important;
  /* border-radius: 8px; */
}

.cancel-button-2 {
  background-color: white;
  color: black;
  border: 2px solid black;
  border-radius: 8px;
  justify-content: space-between !important;
}

.clone-save-button {
  background-color: #6bd1a172;
  color: white;
}

.delete-save-button {
  background-color: rgba(216, 130, 130, 0.605);
  color: white;
}

.cancel-button-clone-delete {
  border: 1px solid #24bb74;
  background-color: #24bb74;
  color: #fff;
  margin-left: 80%;
}

.save-button {
  background-color: #426b59 !important;
  color: white !important;
}

.save-button:hover {
  background-color: white !important;
  color: #426b59 !important;
  border: 1px solid #1c915b !important;
}

.save-button-2 {
  background-color: #426b59;
  color: white;
  margin-left: 60%;
}

.more-icon-button {
  border: 0px;
  margin: 4%;
}

.container-table {
  width: 100%;
}

.menu-icon-list-item {
  width: 500%;
  padding: 2%;
  margin: 2%;
}

/* Style for pagination */
.v-pagination {
  justify-content: center;
}

/* Style for menu */
.menu-container {
  position: relative;
  display: inline-block;
}

.menu-icon {
  cursor: pointer;
}

.menu-dropdown {
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  top: 30px;
  right: 0;
  z-index: 1;
}

.menu-item {
  cursor: pointer;
  padding: 4px 0;
}

.menu-item:hover {
  background-color: #f0f0f0;
}
</style>
