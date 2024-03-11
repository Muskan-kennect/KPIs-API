<template>
  <div class="main-div-section">
    <div class="app-bar-icons21">
      <div>
        <v-label class="app-bar-title-label">Democmfl2</v-label>
        <button
          class="app-bar-draft-button"
          v-if="!specificKPIInfo?.isPublished"
        >
          Draft Mode
        </button>
        <button
          class="app-bar-published-button"
          v-if="specificKPIInfo?.isPublished"
        >
          Published Mode
        </button>
      </div>
      <div>
        <button class="app-bar-button-icons" @click="openLinkedSchemaModal">
          Linked Schemes
        </button>
        <button class="app-bar-button-icons" @click="openCustomModal">
          Params
        </button>
        <button class="app-bar-button-icons" @click="openConfiguartionModal">
          Configuration
        </button>
        <button class="app-bar-button-save-icon" @click="saveChangesHandler">
          Save Changes
        </button>
      </div>
    </div>
    <v-row class="main-content-row">
      <v-column class="main-container-row-column">
        <v-container class="add-functionality-button">
          <v-row class="add-div-section">
            <button class="add-filter-button" @click="handleAddDiv(1)">
              <div>
                <i class="fas fa-sliders"></i>
              </div>
              <div>
                <v-label class="label-add-button">Filter</v-label>
              </div>
            </button>
            <button class="add-field-button" @click="handleAddDiv(1)">
              <div>
                <i class="fas fa-copy"></i>
              </div>
              <div>
                <v-label class="label-add-button">Fields</v-label>
              </div>
            </button>

            <button class="add-group-button" @click="handleAddDiv(1)">
              <div>
                <i class="fas fa-users"></i>
              </div>
              <div>
                <v-label class="label-add-button">Group</v-label>
              </div>
            </button>
          </v-row>
        </v-container>
      </v-column>
      <v-column class="second-column">
        <v-column v-for="item in content" :key="item.id">
          <v-row class="added-items" @click="setSelectedItem(item)">
            <v-row
              class="added-items-label-filter"
              v-if="item.type === 'filter'"
            >
              <i class="fas fa-sliders"></i
            ></v-row>
            <v-row class="added-items-label-add" v-if="item.type === 'add'">
              <i class="fas fa-copy"></i>
            </v-row>
            <v-row class="added-items-label-group" v-if="item.type === 'group'">
              <i class="fas fa-users"></i>
            </v-row>
            <p>{{ item?.name }}</p>
            <i @click="removeDiv(item.id)" class="fas fa-times"></i>
          </v-row>
        </v-column>
      </v-column>

      <v-dialog v-model="linkedSchema" max-width="800">
        <v-card>
          <v-card-title class="modal-heading">
            Linked Schemas
            <VLabel class="heading-button" @click="closeLinkedSchemaModal"
              >X</VLabel
            >
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="content-card-css-linked-schemas">
            <v-container class="linked-schema-container">
              <button class="linked-schema-modal-button">Schema 1</button>
              <button class="linked-schema-modal-button">
                Percentage Incentive Schema 1
              </button>
              <button class="linked-schema-modal-button">Schema_test</button>
            </v-container>
            <v-container class="linked-schema-container">
              <button class="linked-schema-modal-button">Schema 1</button>
              <button class="linked-schema-modal-button">
                Percentage Incentive Schema 1
              </button>
              <button class="linked-schema-modal-button">Schema_test</button>
            </v-container>
            <v-container class="linked-schema-container">
              <button class="linked-schema-modal-button">Schema 1</button>
              <button class="linked-schema-modal-button">
                Percentage Incentive Schema 1
              </button>
              <button class="linked-schema-modal-button">Schema_test</button>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="ConfiguartionModal" max-width="800">
        <v-card>
          <v-card-title class="modal-heading">
            <VLabel class="configuration-heading-first1">
              Configuration
              <button class="app-bar-draft-button" outlined>Draft Mode</button>
              <p>Editing is enabled in this mode</p>
              <VLabel
                class="heading-button-configuration"
                @click="closeLinkedSchemaModal"
                >X</VLabel
              >
            </VLabel>

            <v-container> </v-container>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="content-card-css-configuration">
            <v-divider></v-divider>
            <v-row>
              <v-column class="column-width">
                <button
                  class="column-button"
                  @click="toggleConfigurationType('CICQ')"
                >
                  CIQC
                </button>
                <button
                  class="column-button"
                  @click="toggleConfigurationType('MainCycleType')"
                >
                  Main Cycle type
                </button>
              </v-column>
              <v-column
                v-if="configurationType === 'CICQ'"
                class="column-width1"
              >
                <VLabel class="column-button"
                  >Recognise fields in CICQ dataset</VLabel
                >
                <v-select
                  class="select-class"
                  v-model="empId"
                  :items="EmployeeInfoCICQ"
                  placeholder="Emp/Pos ID"
                >
                </v-select>
                <input
                  @change="
                    handleConfigurationChange($event.target.value, 'Period')
                  "
                  type="date"
                  class="select-class"
                  placeholder="Period"
                />
              </v-column>
              <v-column
                v-if="configurationType === 'MainCycleType'"
                class="column-width1"
              >
                <v-select
                  v-model="mainCycle"
                  :items="options"
                  label="Main Cycle Type"
                >
                </v-select>
              </v-column>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions class="content-card-css-configuration-buttons">
            <button
              class="cancel-button"
              @click="closeConfiguartionModal"
              outlined
            >
              Reset
            </button>
            <button
              class="save-button"
              @click="saveConfigurationModel"
              outlined
            >
              Save
            </button>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-column
        v-model="sideModal"
        v-if="sideModal"
        class="side-modal-class"
        right
        align-end
        transition="slide-y-reverse-transition"
      >
        <v-card class="content-card-css-assign-param">
          <v-card-title class="modal-heading">
            View/Edit Selected Feature
            <VLabel class="heading-button2" @click="closeSideModal">X</VLabel>
          </v-card-title>
          <v-divider color="black"></v-divider>
          <v-card-text class="content-card-css-assign-param">
            <!-- Row 1 -->
            <v-column class="input-label1">
              <v-row
                ><label for="name" class="input-main-label">Name*</label></v-row
              >
              <v-row
                ><input
                  readOnly
                  :value="selectedItem.name"
                  class="custom-param-inputs"
              /></v-row>
            </v-column>
            <v-column class="input-label1">
              <v-row
                ><label for="type" class="input-main-label">Type*</label></v-row
              >
              <v-row v-if="String(selectedItem.type) === 'filter'">
                <VLabel
                  readOnly
                  :value="selectedItem.type"
                  class="custom-param-inputs"
                >
                  Filter
                  <i class="fas fa-sliders"></i>
                </VLabel>
              </v-row>
              <v-row v-if="String(selectedItem.type) === 'add'">
                <VLabel
                  readOnly
                  :value="selectedItem.type"
                  class="custom-param-inputs"
                >
                  Add
                  <i class="fas fa-copy"></i>
                </VLabel>
              </v-row>
              <v-row v-if="String(selectedItem.type) === 'group'">
                <VLabel
                  readOnly
                  :value="selectedItem.type"
                  class="custom-param-inputs"
                >
                  Group
                  <i class="fas fa-users"></i>
                </VLabel>
              </v-row>
            </v-column>
            <v-column class="input-label1">
              <v-row
                ><label for="params" class="input-main-label"
                  >Assigned Params*</label
                ></v-row
              >
              <v-row
                ><select
                  @change="handleAssigningParams($event.target.value)"
                  class="custom-param-inputs"
                >
                  <option key="12" class="param-dailog-section"></option>
                  <option
                    v-for="param in allParams"
                    :value="param.id"
                    :key="param.id"
                    class="param-dailog-section"
                  >
                    {{ param.name }}
                  </option>
                </select></v-row
              >

              <v-row>
                <VLabel
                  v-for="param in selectedItem?.params"
                  :value="param.id"
                  :key="param.id"
                  class="param-dailog-section"
                >
                  {{ param.name }}
                </VLabel>
              </v-row>
            </v-column>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="content-card-css-assign-param-buttons">
            <button class="cancel-button" @click="closeSideModal" outlined>
              Cancel
            </button>
            <button class="save-button" @click="saveSideModalHandler" outlined>
              Submit
            </button>
          </v-card-actions>
        </v-card>
      </v-column>
    </v-row>
    <v-dialog v-model="linkedSchema" max-width="800">
      <v-card>
        <v-card-title class="modal-heading">
          Linked Schemas
          <VLabel class="function-buttons2" @click="closeLinkedSchemaModal"
            >X</VLabel
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="content-card-css-linked-schemas">
          <v-container class="linked-schema-container">
            <button class="linked-schema-modal-button">Schema 1</button>
            <button class="linked-schema-modal-button">
              Percentage Incentive Schema 1
            </button>
            <button class="linked-schema-modal-button">Schema_test</button>
          </v-container>
          <v-container class="linked-schema-container">
            <button class="linked-schema-modal-button">Schema 1</button>
            <button class="linked-schema-modal-button">
              Percentage Incentive Schema 1
            </button>
            <button class="linked-schema-modal-button">Schema_test</button>
          </v-container>
          <v-container class="linked-schema-container">
            <button class="linked-schema-modal-button">Schema 1</button>
            <button class="linked-schema-modal-button">
              Percentage Incentive Schema 1
            </button>
            <button class="linked-schema-modal-button">Schema_test</button>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!--Custom param modal view-->

    <v-dialog v-model="CustomModal" max-width="800">
      <v-card class="dialog-modal">
        <v-card-title class="modal-heading">
          <label class="configuration-heading-first1">
            Create Custom Params
            <VLabel class="close-button" @click="closeCustomModal">X</VLabel>
          </label>

          <!-- <v-container> </v-container> -->
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="content-card-css-custom-param">
          <v-row class="second-heading-row">
            <VLabel>Custom Params</VLabel>
            <button class="create-param-button" @click="openFinalParamModal">
              Add new
            </button>
          </v-row>

          <v-row>
            <v-container class="custom-param-view-modal">
              <v-column
                v-for="param in allParams"
                :key="param.id"
                class="param-dailog-section"
              >
                <v-row>
                  <v-row class="custom-param-div-class">
                    <VLabel class="custom-param-label">{{
                      param?.name
                    }}</VLabel>

                    <Vlabel class="custom-param-icon-edit"
                      ><i
                        class="fas fa-pencil-alt"
                        title="Compose KPI"
                        @click="openEditParamModal(param.id)"
                      ></i
                    ></Vlabel>
                    <Vlabel class="custom-param-icon-delete"
                      ><i
                        class="fas fa-trash-alt"
                        title="Delete"
                        @click="removeCurrentAddedParam(param.id)"
                      ></i
                    ></Vlabel>
                  </v-row>
                  <v-row>
                    <VLabel class="custom-param-sublabel"
                      >Content Type : {{ param?.type }}</VLabel
                    >
                  </v-row>
                  <v-row>
                    <button
                      class="toggle-param-details-info"
                      @click="setSelectedParam(param?.id)"
                    >
                      <V-label>
                        <span class="view-button">View Details</span>
                        <i
                          v-if="
                            (param?.id === selectedParam?.id && !viewDetails) ||
                            !viewDetails
                          "
                          class="fas fa-chevron-down open-close-icon"
                        ></i>
                        <i
                          v-if="
                            String(param?.id) === String(selectedParam?.id) &&
                            viewDetails
                          "
                          class="fas fa-chevron-up open-close-icon"
                        ></i>
                      </V-label>
                    </button>
                  </v-row>
                  <v-row
                    class="content"
                    v-if="
                      String(param?.id) === String(selectedParam?.id) &&
                      viewDetails
                    "
                  >
                    <v-row>
                      <VLabel style="margin-top: px">Description : </VLabel>
                      <span
                        ><VLabel>{{ param?.description }}</VLabel></span
                      >
                    </v-row>
                    <v-row style="">
                      <VLabel style="margin-top: 10px">Values :</VLabel>
                      <VLabel style="margin-top: 10px; white-space: wrap">{{
                        param?.value
                      }}</VLabel>
                    </v-row>
                  </v-row>
                  <!-- <v-column> </v-column> -->
                </v-row>
              </v-column>
            </v-container>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Custom params modal when selected the create option-->

    <v-dialog v-model="createParamModal" max-width="500" persistent>
      <v-card>
        <v-card-title class="modal-heading">
          {{ paramModalInEditMode ? "Update Params" : "Create Parms" }}
          <VLabel class="heading-button2" @click="closeFinalParamModal"
            >X</VLabel
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-icon>mdi-close</v-icon>
        </v-card-actions>
        <v-card-text class="content-card-css-param-modal">
          <v-column class="input-label1">
            <v-row
              ><label for="name" class="input-main-label"
                >Name <v-label class="important-field-class">*</v-label></label
              ></v-row
            >
            <v-row
              ><input
                :value="newCreatedParam?.name"
                @change="handleParamaInputChange($event.target.value, 'name')"
                class="custom-param-inputs"
            /></v-row>
          </v-column>
          <v-column class="input-label1">
            <v-row
              ><label for="name" class="input-main-label"
                >Type <v-label class="important-field-class">*</v-label></label
              ></v-row
            >
            <v-row
              ><select
                :value="newCreatedParam?.type"
                @change="handleParamaInputChange($event.target.value, 'type')"
                class="custom-param-inputs"
              >
                <option v-for="paramType in allParamsType" :key="paramType.id">
                  {{ paramType.typeName }}
                </option>
              </select></v-row
            >
          </v-column>
          <v-column
            v-if="String(newCreatedParam?.type) === 'String'"
            class="input-label1"
          >
            <v-row
              ><label for="name" class="input-main-label"
                >Value <v-label class="important-field-class">*</v-label></label
              ></v-row
            >
            <v-row
              ><input
                type="text"
                @change="handleParamaInputChange($event.target.value, 'value')"
                :value="newCreatedParam.value"
                class="custom-param-inputs"
            /></v-row>
            <v-row><Vlabel>Or :</Vlabel></v-row>
            <v-row
              ><input
                type="file"
                @change="handleFileUpload($event)"
                class="custom-param-inputs"
            /></v-row>
          </v-column>
          <v-column
            v-if="String(newCreatedParam?.type) === 'Boolean'"
            class="input-label1"
          >
            <v-row
              ><label for="name" class="input-main-label"
                >Value <v-label class="important-field-class">*</v-label></label
              ></v-row
            >
            <v-row
              ><input
                :value="newCreatedParam.value"
                readOnly
                class="custom-param-inputs"
            /></v-row>
          </v-column>
          <v-column
            v-if="String(newCreatedParam?.type) === 'Number'"
            class="input-label1"
          >
            <v-row
              ><label for="name" class="input-main-label"
                >Upper Bound
                <v-label class="important-field-class">*</v-label></label
              ></v-row
            >
            <v-row
              ><input
                type="number"
                :value="getBoundValues(newCreatedParam.value, 'upperBound')"
                @change="
                  handleParamaInputChange($event.target.value, 'upperBound')
                "
                class="custom-param-inputs"
            /></v-row>
          </v-column>
          <v-column
            v-if="String(newCreatedParam?.type) === 'Number'"
            class="input-label1"
          >
            <v-row
              ><label for="name" class="input-main-label"
                >Lower Bound
                <v-label class="important-field-class">*</v-label></label
              ></v-row
            >
            <v-row
              ><input
                type="number"
                :value="getBoundValues(newCreatedParam.value, 'lowerBound')"
                @change="
                  handleParamaInputChange($event.target.value, 'lowerBound')
                "
                class="custom-param-inputs"
            /></v-row>
          </v-column>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="function-buttons">
          <button
            class="cancel-button"
            outlined
            @click="resetCurrentAddedParam(newCreatedParam.id)"
          >
            {{ paramModalInEditMode ? "Reset" : "Cancel" }}
          </button>
          <button class="save-button" @click="saveParamHandler" outlined>
            Save
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script scoped>
import { useMyStore } from "../../store/store";
import axios from "axios";
export default {
  data() {
    return {
      counterStore: useMyStore(),
      content: [],
      selectedItem: {},
      sideModal: false,
      selectedOption: null,
      selectedFilters: null,
      options: ["Monthly", "Quaterly", "Half Yearly", "Yearly"],
      configurationType: "CICQ",
      EmployeeInfoCICQ: ["EMpID12", "EMPID23"],
      count: 10,
      dialogVisible: false,
      ConfiguartionModal: false,
      linkedSchema: false,
      CustomModal: false,
      createParamModal: false,
      viewDetails: false,
      empId: "",
      period: "",
      mainCycle: "",
      specificKPIInfo: {},
      configurationInfo: {
        overrideCicqFieldRecognition: {
          emp: {
            type: "",
            fieldKey: "",
          },
          period: {
            isDate: true,
            format: "isDate",
            fieldKey: "",
          },
          buField: "",
        },
        mainCycleType: "",
      },
      name: "",
      type: "",
      value: "",
      selectedParam: null,
      allParamsType: [
        { id: 1, typeName: "Number" },
        { id: 1, typeName: "String" },
        { id: 1, typeName: "Boolean" },
      ],
      selectedParamType: "",
      newParamName: "",
      allParams: [],
      newCreatedParam: {},
      paramModalInEditMode: false,
    };
  },
  mounted() {
    const route = window.location.pathname;
    const dynamicKPIId = route.split("/Draft/")[1];
    console.log("KPIId", dynamicKPIId);
    this.getSpcificDraft(dynamicKPIId);
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
    },

    toggleConfigurationType(value) {
      this.configurationType = value;
    },
    generateUniqueName(id) {
      return `Item_${id}`;
    },

    setSelectedItem(item) {
      console.log(item);
      this.selectedItem = item;
      this.sideModal = true;
    },

    saveConfigurationModel() {
      this.ConfiguartionModal = false;
    },
    openFinalParamModal() {
      let allParamLength = this.allParams.length;

      let newCreatedParam = {
        id: allParamLength + 1,
        name: "",
        type: "",
        description: "",
        value: "",
      };

      this.newCreatedParam = newCreatedParam;
      this.CustomModal = false;
      this.createParamModal = true;
    },
    closeFinalParamModal() {
      this.createParamModal = false;
    },
    openSideModal() {
      this.sideModal = true;
    },
    closeSideModal() {
      this.sideModal = false;
    },
    openCustomModal() {
      this.CustomModal = true;
    },

    //handle the filter functionality
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

    //program to calculate the boxes  in format to send andupdate the kpi
    calculateBoxesToUpdate() {
      const result = this.content.reduce((acc, val, index) => {
        acc[`box${index + 1}`] = val;
        return acc;
      }, {});
      return result;
    },

    //program to calculate the boxes  in format to send andupdate the kpi
    calculateParamsToUpdate() {
      const result = this.allParams.reduce((acc, val, index) => {
        acc[`${val.name}`] = val;
        return acc;
      }, {});
      return result;
    },

    //save handler for udpating the information
    saveChangesHandler() {
      const boxes = this.calculateBoxesToUpdate();
      const customParams = this.calculateParamsToUpdate();
      const configurations = {
        overrideCicqFieldRecognition: {
          emp: {
            type: "emp",
            fieldKey: this.empId,
          },
          period: {
            fieldKey: this.period,
            isDate: true,
            format: "",
          },
          buField:
            this.specificKPIInfo?.configurations?.overrideCicqFieldRecognition
              ?.buField,
        },
        mainCycleType: this.mainCycle,
      };

      const newUpdatedKPI = {
        name: this.specificKPIInfo.name,
        displayName: this.specificKPIInfo?.displayName,
        type: this.specificKPIInfo?.type,
        resType: this.specificKPIInfo?.resType,
        labels: this.specificKPIInfo?.labels,
        mode: this.specificKPIInfo?.mode,
        isPublished: this.specificKPIInfo?.isPublished,
        isRevised: true,
        setup: {
          source: this.specificKPIInfo?.source,
          configurations: configurations,
          customParams: customParams,
          mainFlow: {
            boxes: boxes,
          },
        },
        record: this.specificKPIInfo?.record,
      };

      const url = `http://localhost:8009/draft/saveDraftUpdate/${this.specificKPIInfo?._id}`;
      const method = "put";

      axios
        .put(url, newUpdatedKPI.setup)
        .then((res) => {
          alert("Successfully updated !!");
          $this.router.push("/Home");
        })
        .catch((err) => {
          alert(err);
        });
    },

    //handle update fields of configuration modal
    handleConfigurationChange(value, field) {
      console.log(value, field);
      let oldConfig = this.configurationInfo;
      if (String(field) === "EmpId") {
        let newEmp = {
          overrideCicqFieldRecognition: {
            emp: {
              type: oldConfig?.overrideCicqFieldRecognition?.emp.type,
              fieldKey: value,
            },
            period: oldConfig?.overrideCicqFieldRecognition?.period,
            buField: oldConfig?.overrideCicqFieldRecognition?.buField,
            mainCycleType:
              oldConfig?.overrideCicqFieldRecognition?.mainCycleType,
          },
        };
        console.log("newemp", newEmp);
        oldConfig = newEmp;
      } else if (String(field) === "Period") {
        let newEmp = {
          overrideCicqFieldRecognition: {
            emp: oldConfig?.overrideCicqFieldRecognition?.emp,
            period: {
              isDate: true,
              format: "isDate",
              fieldKey: value,
            },
            buField: oldConfig?.overrideCicqFieldRecognition?.buField,
            mainCycleType:
              oldConfig?.overrideCicqFieldRecognition?.mainCycleType,
          },
        };
        this.period = value;
        oldConfig = newEmp;
      } else if (String(field) === "MainCycle") {
        let newEmp = {
          overrideCicqFieldRecognition: {
            emp: oldConfig?.overrideCicqFieldRecognition?.emp,
            period: oldConfig?.overrideCicqFieldRecognition?.period,
            buField: oldConfig?.overrideCicqFieldRecognition?.buField,
            mainCycleType: value,
          },
        };
        oldConfig = newEmp;
      }

      this.configurationInfo = oldConfig;
    },

    //reset button functionlity for the configuration modal
    onResetHandlerConfigurationModal() {
      this.configurationInfo = {
        overrideCicqFieldRecognition: {
          emp: {
            type: "",
            fieldKey: "",
          },
          period: {
            isDate: true,
            format: "isDate",
            fieldKey: "",
          },
          buField: "",
        },
        mainCycleType: "",
      };
    },

    //save handler for Configuration Modal
    saveConfigurationModal() {
      this.ConfiguartionModal = false;
    },

    //save handler for the side modal for assigning the params
    saveSideModalHandler() {
      let oldContent = [];
      console.log("side,pda;", this.selectedItem);
      this.content.map((item, index) => {
        if (String(item.id) === String(this.selectedItem.id)) {
          oldContent.push(this.selectedItem);
        } else {
          oldContent.push(item);
        }
      });

      this.content = oldContent;
      this.sideModal = false;
    },

    //get All Proper other than assigned one
    getAllParmasWithoutAssignedOne(id) {
      let selectedParam = {};
      this.allParams.map((param, index) => {
        if (String(param.id) === String(id)) {
          selectedParam = param;
        }
      });
      return selectedParam.id ? true : false;
    },

    //handle the assigning of params to the selecteddiv
    handleAssigningParams(assignedParamId) {
      let getCurrentSelectedParam = {};
      this.allParams.map((param, index) => {
        if (String(param?.id) === String(assignedParamId)) {
          getCurrentSelectedParam = param;
        }
      });

      let oldSelectedItem = this.selectedItem;
      let oldParamsOfSelectedItem = oldSelectedItem?.params;
      oldParamsOfSelectedItem.push(getCurrentSelectedParam);
      oldSelectedItem.params = oldParamsOfSelectedItem;

      this.selectedItem = oldSelectedItem;
    },

    //setting the current selected param to show the info in the view details dialog
    setSelectedParam(id) {
      let selectedParam = {};
      this.allParams.map((param, index) => {
        if (String(param?.id) === String(id)) {
          selectedParam = param;
        }
      });
      this.viewDetails = !this.viewDetails;
      this.selectedParam = selectedParam;
    },

    //open the view details dialog
    openViewDetails() {
      this.openViewDetails = true;
    },
    //close the view details dialog
    closeViewDetails() {
      this.openViewDetails = false;
    },

    //set the current adding new param type
    setNewParamType(paramTypeId) {
      let selectedParamType = {};
      allParamsType.map((type, index) => {
        if (String(type.id) === String(paramTypeId)) {
          selectedParamType = type;
        }
      });

      this.newParamType = selectedParamType?.typeName;
    },

    //update the values of the newCreatedParams
    handleParamaInputChange(value, field) {
      let currentAddedParam = this.newCreatedParam;
      if (String(field) === "name") {
        currentAddedParam.name = value;
      } else if (String(field) === "type") {
        currentAddedParam.type = value;
        if (String(value) === "Boolean") currentAddedParam.value = "True/False";
      } else if (String(field) === "value") {
        currentAddedParam.value = value;
      } else if (String(field) === "upperBound") {
        let currentValue = currentAddedParam.value;
        let upperValue = currentValue?.split(",")[1];
        let lowerValue = currentValue?.split(",")[0];

        upperValue = value;
        currentAddedParam.value = lowerValue + "," + upperValue;
      } else if (String(field) === "lowerBound") {
        let currentValue = currentAddedParam.value;
        let upperValue = currentValue?.split(",")[1];
        let lowerValue = currentValue?.split(",")[0];

        lowerValue = value;
        currentAddedParam.value = lowerValue + "," + upperValue;
      }
      this.newCreatedParam = currentAddedParam;
    },

    //function to get the LowerBound/UpperBound
    getBoundValues(wholeValue, boundType) {
      let currentValue = wholeValue;
      if (!wholeValue) return;
      let upperValue = currentValue?.split(",")[1];
      let lowerValue = currentValue?.split(",")[0];

      if (String(boundType) === "upperBound") {
        return upperValue;
      } else {
        return lowerValue;
      }
    },

    //reset the current added Param
    resetCurrentAddedParam(addedParamId) {
      this.createParamModal = false;
      this.paramModalInEditMode = false;
    },

    //remove the current added Param
    removeCurrentAddedParam(addedParamId) {
      let updatedParams = [];
      this.allParams.map((param, index) => {
        if (String(param.id) !== String(addedParamId)) {
          updatedParams.push(param);
        }
      });

      this.allParams = updatedParams;
      const store = useMyStore();
      store.setParams(updatedParams);
      console.log(store.getParams());
      this.newCreatedParam = {};
      this.createParamModal = false;
      this.paramModalInEditMode = false;
      this.CustomModal = false;
    },

    //open the param editing modal
    openEditParamModal(currentParamId) {
      let selectedParam = {};
      this.allParams.map((param, index) => {
        if (String(param.id) === String(currentParamId)) {
          selectedParam = param;
        }
      });
      this.newCreatedParam = selectedParam;
      this.createParamModal = true;
      this.CustomModal = false;
      this.paramModalInEditMode = true;
    },

    //save handler for the edit/created params
    saveParamHandler() {
      let oldParams = this.allParams;

      if (this.paramModalInEditMode) {
        let updatedParams = [];
        this.allParams.map((param, index) => {
          if (String(param.id) === String(this.newCreatedParam.id)) {
            updatedParams.push(this.newCreatedParam);
          } else {
            updatedParams.push(param);
          }
        });
        oldParams = updatedParams;
      } else {
        oldParams.push(this.newCreatedParam);
      }

      this.allParams = oldParams;
      const store = useMyStore();
      store.setParams(oldParams);
      console.log(store.getParams());
      this.paramModalInEditMode = false;
      this.createParamModal = false;
    },

    //function to read the csv file uploaded for the values
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const csvString = reader.result;
        const parsedData = this.parseCSV(csvString);
        const csvData = this.convertToCSVString(parsedData);
        const newParamWithCSVData = {
          name: this.newCreatedParam.name,
          type: this.newCreatedParam.type,
          value: csvData,
          description: this.newCreatedParam.description,
        };

        this.newCreatedParam = newParamWithCSVData;
      };
      reader.readAsText(file);
    },

    // Function to parse CSV data
    parseCSV(csvString) {
      const rows = csvString.split("\n");
      rows.shift();
      const parsedData = rows.map((row) => row.split(","));
      return parsedData;
    },

    // Function to convert parsed data to comma-separated string
    convertToCSVString(parsedData) {
      return parsedData
        .map((row) => row.join(",").replace(/^,/, ""))
        .join("\n");
    },

    //getting whole boxes from the information we got
    getBoxesFromKPIResponse(info) {
      const requiredBoxesDict = info?.boxes;
      if (!requiredBoxesDict) return [];
      const formedBoxesArray = Object.values(requiredBoxesDict);
      return formedBoxesArray;
    },

    //get all the listed params for this draft
    getAllParams(info) {
      const requiredParamsDict = info;
      if (!requiredParamsDict) return [];
      const formedParamsArray = Object.values(requiredParamsDict);
      return formedParamsArray;
    },
    //get the whole information of the draft
    getSpcificDraft(id) {
      const url = `http://localhost:8009/draft/getSpecificDraft/${id}`;
      const method = "get";

      axios
        .get(url)
        .then((res) => {
          const wholeKPIInfo = res.data;

          console.log(wholeKPIInfo);
          const allBoxes = this.getBoxesFromKPIResponse(
            wholeKPIInfo?.setup?.mainFlow
          );
          const allRequiredParams = this.getAllParams(
            wholeKPIInfo?.setup?.customParams
          );

          this.specificKPIInfo = wholeKPIInfo;
          this.content = allBoxes;
          this.mainCycle = wholeKPIInfo?.setup?.configurations?.mainCycleType;
          this.period =
            wholeKPIInfo?.setup?.configurations?.overrideCicqFieldRecognition?.period?.fieldKey;
          this.empId =
            wholeKPIInfo?.setup?.configurations?.overrideCicqFieldRecognition?.emp?.fieldKey;
          this.allParams = allRequiredParams;
          this.configurationInfo = wholeKPIInfo?.setup?.configurations;
        })
        .catch((err) => {
          alert(err);
        });
    },

    closeCustomModal() {
      this.CustomModal = false;
    },
    handleAddDiv(type) {
      const len = this.content.length;
      const currentDiv = {
        id: this.count,
        type: type === 1 ? "filter" : type === 2 ? "add" : "group",
        name: this.generateUniqueName(this.count),
        params: [],
      };
      const oldContent = this.content;
      this.count = this.count + 1;
      oldContent.push(currentDiv);

      console.log(oldContent);
      this.content = oldContent;
    },
    openLinkedSchemaModal() {
      this.linkedSchema = true;
    },
    closeLinkedSchemaModal() {
      this.linkedSchema = false;
    },
    openConfiguartionModal() {
      this.ConfiguartionModal = true;
    },
    closeConfiguartionModal() {
      this.ConfiguartionModal = false;
    },
    removeDiv(id) {
      const oldContent = this.content;
      let updatedContent = [];
      oldContent.map((row, index) => {
        if (row.id !== id) {
          updatedContent.push(row);
        }
      });
      this.content = updatedContent;
    },
  },
};
</script>

<style>
V-Label {
  text-transform: none;
}

.main-div2 {
  background-color: white;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: -2%;
}

.custom-param-label {
  margin: 2%;
  margin-left: 10%;
}

.custom-param-sublabel {
  margin: 2%;
  margin-left: 10%;

  font-size: 12px;
}

.heading-button-configuration {
  margin-left: 26%;
}

.custom-modal-button {
  border-radius: 20px;
  margin: 2%;
  width: 40px;
  font-size: 12px;
  border: 2px solid white;
  background-color: rgba(67, 92, 67, 0.748);
  color: black;
}
.custom-param-edit-delete-row {
  justify-content: space-between;
}

.side-modal-cancel-button {
  justify-content: flex-end;
}

.dialog-modal {
  border-radius: 8px;
  border: 3px solid #5b957b;
}

.add-div-section {
  display: flex;
  flex-direction: column;
}

.toggle-param-details-info {
  color: black !important;
  border: 1px solid #5b957b;
  background-color: #5b957b;
  border-radius: 8px;
  width: 96%;
  justify-content: center;
  font-size: smaller !important;
  padding: 4%;
  margin: 1%;
}

.content-card-css-linked-schemas {
  border: 3px solid #1c915b;
  border-top: 0px;
}

.content-card-css-assign-param {
  border: 3px solid #1c915b;
  border-top: 0px;
  border-bottom: 0px;
}

.content-card-css-assign-param-buttons {
  border: 3px solid #1c915b;
  border-top: 0px;
  justify-content: flex-end;
}

.content-card-css-configuration {
  border: 3px solid #1c915b;
  border-top: 0px;
  border-bottom: 0px;
}

.content-card-css-configuration-buttons {
  border: 3px solid #1c915b;
  border-top: 0px;
  justify-content: flex-end;
}

.content-card-css-custom-param {
  border: 3px solid #1c915b;
  border-top: 0px;
}

.configuration-heading-first1 {
}

.second-heading-row {
  justify-content: space-between;
}

.custom-param-icon-edit {
  padding: 2%;
  margin-top: 4%;
  margin-right: 1%;
  color: rgba(40, 87, 40, 0.747);
}

.custom-param-div-class {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.custom-param-icon-delete {
  padding: 2%;
  margin-top: 4%;
  margin-right: 1%;
  color: rgba(140, 35, 12, 0.585);
}

.custom-param-inputs {
  border-radius: 8px;
  width: 80%;
  padding: 1%;
  margin: 2%;
  margin-left: 4% !important;
  margin-bottom: 4%;
  border: 2px solid rgba(128, 124, 124, 0.564);
}

.custom-param-input-select {
  width: 80%;
  margin-left: 2%;
  margin: 2%;
  border-radius: 8px;
  padding: 1%;
  border: 2px solid rgba(128, 128, 128, 0.509);
}

.custom-param-inputs :active {
  border: 2px solid rgba(100, 98, 98, 0.443);
}
.modal-heading {
  color: black !important;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  font-size: 30px;
}
.column-button {
  margin: 2%;
}

.important-field-class {
  color: red;
}

.input-label1 {
  display: flex;
  flex-direction: column;
  margin: 2%;
  padding: 1%;
}

.select-class {
  border-radius: 20px;
  margin: 2%;
  width: 96%;
}

.custom-param-view-modal {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.cancel-modal-button {
  border: 2px solid rgba(88, 84, 84, 0.605);
  background-color: rgba(161, 154, 154, 0.79);
  color: white;
}

.side-modal-class {
  width: 30%;
  margin-left: 16%;
  margin-top: 4%;
}

.input-main-label {
  font-size: 16px;
  margin-left: 6%;
  color: rgba(12, 10, 10, 0.663);
}

.column-width {
  font-size: 18px;
  flex-direction: columns;
  margin: 2%;
  border-right: 2px solid rgba(190, 184, 184, 0.655);
}

.column-width1 {
  font-size: 18px;
  width: 70%;
  border-left: 2px solid rgba(190, 184, 184, 0.655);
}

.configuration-column-1 {
  width: 30%;
}

.configuration-heading-first1 {
  font-size: 18px;
  width: 80%;
  margin-top: 2%;
  color: rgb(29, 27, 27) k;
}

.close-button {
  margin-left: 80%;
  color: black;
}

.configuration-column-2 {
  width: 70%;
}

.function-button2 {
  justify-content: flex-end;
}

.param-dailog-section {
  border: 2px solid rgba(161, 155, 155, 0.534);
  width: 35%;
  height: fit-content;
  border-radius: 5px;
  padding: 6%;
  /* display: flex;
  flex-wrap: wrap;
  font-weight: 600;
  flex-direction: row; */
  color: black;
  margin: 2%;
}

.content {
  margin-top: 25px !important;
}

.column {
  border: 2px solid black;
  width: 45%;
}

.added-items i {
  margin: 4%;
  margin-left: 40px;
}

.divider-class {
  color: black;
  background-color: black;
}

.linked-schema-container {
  justify-content: center;
}

.configuration-heading-first {
  width: 80%;
}

.function-buttons2 {
  justify-content: flex-end;
}

.appbar-column-2 {
  width: 60%;
}

.linked-schema-modal-button {
  width: max-content;
  border-radius: 20px;
  font-weight: 500;
  background-color: rgba(234, 226, 226, 0.404);
  margin: 2%;
}

.last-column {
  width: calc(33.33% - 4%);
  margin: 2%;
  margin-left: 16%;
}

.app-bar-icons2 {
  margin: 0;
  background-color: white;

  width: 100%;
  height: max-content;
  color: black;
  display: flex;
  font-size: 18px;
  flex-direction: column;
  position: relative;
  border: 2px solid white;
  justify-content: space-between;
}

.main-dialog {
  border: 2px solid black;
  left: 80%;
  background-color: white;

  top: 20%;
}

.second-column {
  width: calc(
    20.33% - 4%
  ); /* Set the width to one-third of the container minus margin */
  margin-top: 4%;
  margin-left: 2%; /* Adjust margin as needed */
  margin-right: 2%;
  margin-bottom: 3%;
}

.cancel-button {
  border: 2px solid rgb(42, 3, 3);
  border-radius: 20px;
  margin: 2%;
  padding: 1%;
  background-color: lightgray;
  font-size: 18px;
  color: rgb(42, 3, 3);
}

.save-button {
  background-color: 2px solid #5b957b;
  border-radius: 20px;
  margin: 2%;
  margin-left: -1% !important;
  padding: 1.25%;
  font-stretch: expanded;
  font-size: 18px;
  color: white;
}

.create-param-button {
  border-radius: 5px;
  color: white;
  font-size: 16px;
  padding: 1%;
  margin: 1%;
  border: 1px solid #5b957b;
  background-color: #5b957b;
}

.app-bar-button-icons {
  font-size: 14px;
  width: auto;
  border-radius: 20px;
  margin: 4px;
  margin-right: 10px;
  padding: 7px;
  background-color: rgba(161, 161, 226, 0.513);
}

.app-bar-title-label {
  font-size: 16px;
  color: black;
  font-weight: 200;
  padding-left: -2%;
  margin-right: 6px;
}

.added-items {
  border: 2px solid rgba(101, 95, 95, 0.595);
  background-color: white;
  margin: 2% !important;
  margin-bottom: 10% !important;
  border-radius: 8px;
  font-size: small;
  color: rgba(0, 0, 0, 0.617);
}

.added-items-label {
  margin: 10%;
}

.added-items-label-filter {
  padding: 8%;
  color: rgb(209, 85, 105);
  font-size: 22px;
}

.added-items-label-add {
  padding: 8%;
  color: rgb(68, 75, 167);
  font-size: 22px;
}

.modal-heading {
  font-size: 16px;
  color: rgba(130, 119, 119, 0.814);
}

.added-items-label-group {
  padding: 8%;
  color: rgb(234, 230, 25);
  font-size: 22px;
}

.added-items p {
  font-size: 16px;
  padding: 2%;
  color: rgba(52, 47, 47, 0.915);
}

.app-bar-draft-button {
  background-color: rgba(207, 77, 146, 0.912);
  border-radius: 20px;
  color: white !important;
  font-size: 14px;
  margin: 4px;
  padding: 4px;
  font-weight: 400;
}

.app-bar-published-button {
  background-color: rgba(62, 175, 113, 0.772);
  border-radius: 20px;
  color: white;
  font-size: 14px;
  margin: 4px;
  padding: 4px;
  font-weight: 100;
}

.app-bar-button-save-icon {
  font-size: 14px;
  width: auto;
  border-radius: 20px;
  margin: 4px;
  margin-left: 10px;
  padding: 6px;
  background-color: rgba(28, 82, 28, 0.788);
  color: white;
}

.app-bar-icons3 {
  background-color: black;
}

.main-content-row {
  background-color: inherit;
  height: 548px;
  width: 100%;
  margin-top: 2%;
}

.main-container-row-column {
  margin-top: -10%;
  width: calc(33.33% - 2%);
  height: 100%; /* Set the width to one-third of the container minus margin */
}

.add-functionality-button {
  flex-direction: row;
  margin-top: 50%;
}

.add-filter-button {
  width: max-content;
  padding: 2%;
  margin: 4%;
  margin-top: 10%;
  flex-direction: row;
  border-radius: 8px;
  color: rgba(137, 194, 137, 0.792);
  border: 2px solid rgba(137, 194, 137, 0.792);
}

.add-field-button {
  width: max-content;
  padding: 2%;
  margin: 4%;
  margin-top: 10%;
  flex-direction: row;
  border-radius: 8px;
  color: rgba(114, 44, 107, 0.792);
  border: 2px solid rgba(114, 44, 107, 0.792);
}

.add-group-button {
  width: max-content;
  padding: 2%;
  margin: 4%;
  margin-top: 10%;
  flex-direction: row;
  border-radius: 8px;
  color: rgba(152, 152, 60, 0.792);
  border: 2px solid rgba(152, 152, 60, 0.792);
}

.add-button-row {
  margin: 4%;
}

.add-button i {
  font-size: 30px;
  margin: 2%;
  margin-left: 4%;

  color: rgba(119, 207, 113, 0.697);
}
.label-add-button {
  font-size: 10px;
  color: black !important;
  font-weight: 800;
  font-weight: 200;
}

.add-button div {
  flex-direction: column;
}

.view-button {
  /* background-color: #1c915b !important; */
  color: white !important;
}
</style>
