const API_URL = "http://35.234.221.31:5000/api/forms";

const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const submitButton = document.getElementById("submitButton");
const refreshButton = document.getElementById("refreshButton");
const statusMessage = document.getElementById("statusMessage");
const formList = document.getElementById("formList");

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className =
    type === "success" ? "success-message" : "error-message";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getRecordsFromResponse(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.forms)) {
    return data.forms;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  return [];
}

async function loadForms() {
  formList.innerHTML =
    '<p class="loading-message">Loading submitted users...</p>';

  try {
    const response = await fetch(API_URL);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Forms load nahi ho paye.");
    }

    const forms = getRecordsFromResponse(data);

    if (forms.length === 0) {
      formList.innerHTML =
        '<p class="empty-message">Abhi koi form submit nahi hua hai.</p>';
      return;
    }

    formList.innerHTML = forms
      .map((form) => {
        const createdDate = form.createdAt
          ? new Date(form.createdAt).toLocaleString()
          : "Date unavailable";

        return `
          <article class="record-card">
            <h3>${escapeHtml(form.name || "Unknown User")}</h3>

            <p>
              <strong>Email:</strong>
              ${escapeHtml(form.email || "Not provided")}
            </p>

            <p>
              <strong>Message:</strong>
              ${escapeHtml(form.message || "Not provided")}
            </p>

            <p class="record-date">
              Submitted: ${escapeHtml(createdDate)}
            </p>

            <button
              type="button"
              class="delete-button"
              data-id="${escapeHtml(form._id)}"
            >
              Delete
            </button>
          </article>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Load forms error:", error);

    formList.innerHTML = `
      <p class="error-message">
        ${escapeHtml(error.message)}
      </p>
    `;
  }
}

async function submitForm(event) {
  event.preventDefault();

  const formData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim()
  };

  if (!formData.name || !formData.email || !formData.message) {
    showStatus("Please sabhi fields fill karein.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";
  showStatus("", "success");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Form submit nahi hua.");
    }

    showStatus("Form successfully submit ho gaya.", "success");

    contactForm.reset();

    await loadForms();
  } catch (error) {
    console.error("Submit form error:", error);
    showStatus(error.message, "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Form";
  }
}

async function deleteForm(formId) {
  const shouldDelete = window.confirm(
    "Kya aap is submitted form ko delete karna chahte hain?"
  );

  if (!shouldDelete) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${formId}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Form delete nahi hua.");
    }

    showStatus("Form successfully delete ho gaya.", "success");

    await loadForms();
  } catch (error) {
    console.error("Delete form error:", error);
    showStatus(error.message, "error");
  }
}

contactForm.addEventListener("submit", submitForm);

refreshButton.addEventListener("click", loadForms);

formList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-button");

  if (!deleteButton) {
    return;
  }

  const formId = deleteButton.dataset.id;

  if (formId) {
    deleteForm(formId);
  }
});

loadForms();