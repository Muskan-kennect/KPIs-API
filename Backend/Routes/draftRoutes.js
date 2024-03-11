const express = require('express');
const router = express.Router();

const client = require("../config/dbConnection");
const { addDraft, getAllDrafts, deleteDraft, updateDraft, getDraftById, saveDraftEditUpdate, getDraftsByQuery } = require("../Controller/draftController")

router.post("/addDraft",addDraft);
router.get("/getAllDrafts",getAllDrafts);
router.get("/getSpecificDraft/:id",getDraftById);
router.delete("/deleteDraft/:id",deleteDraft);
router.put("/saveDraftUpdate/:id",saveDraftEditUpdate);

router.get("/searchDraft",getDraftsByQuery)
router.put("/updateDraft/:id",updateDraft);

module.exports = router;
