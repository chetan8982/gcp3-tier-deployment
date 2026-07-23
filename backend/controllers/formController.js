const mongoose = require("mongoose");
const Form = require("../models/Form");

// GET /api/forms
async function getForms(req, res) {
  try {
    const forms = await Form.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: forms.length,
      data: forms
    });
  } catch (error) {
    console.error("Get forms error:", error);

    res.status(500).json({
      success: false,
      message: "Records load nahi ho sake"
    });
  }
}

// POST /api/forms
async function createForm(req, res) {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email aur message required hain"
      });
    }

    const form = await Form.create({
      name,
      email,
      message
    });

    res.status(201).json({
      success: true,
      message: "Form successfully submit ho gaya",
      data: form
    });
  } catch (error) {
    console.error("Create form error:", error);

    if (error.name === "ValidationError") {
      const validationMessages = Object.values(
        error.errors
      ).map(item => item.message);

      return res.status(400).json({
        success: false,
        message: validationMessages.join(", ")
      });
    }

    res.status(500).json({
      success: false,
      message: "Form submit nahi ho saka"
    });
  }
}

// DELETE /api/forms/:id
async function deleteForm(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid record ID"
      });
    }

    const deletedForm = await Form.findByIdAndDelete(id);

    if (!deletedForm) {
      return res.status(404).json({
        success: false,
        message: "Record nahi mila"
      });
    }

    res.status(200).json({
      success: true,
      message: "Record delete ho gaya"
    });
  } catch (error) {
    console.error("Delete form error:", error);

    res.status(500).json({
      success: false,
      message: "Record delete nahi ho saka"
    });
  }
}

module.exports = {
  getForms,
  createForm,
  deleteForm
};