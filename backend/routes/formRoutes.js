const express = require("express");

const {
  getForms,
  createForm,
  deleteForm
} = require("../controllers/formController");

const router = express.Router();

router.get("/", getForms);
router.post("/", createForm);
router.delete("/:id", deleteForm);

module.exports = router;