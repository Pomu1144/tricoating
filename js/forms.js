// Honest form handling for a static (no-backend) site.
// Any form marked with data-mailto-to submits by opening the user's mail
// client addressed to a real Triangle Coatings inbox. We never fabricate a
// confirmation, order number, or claim a server received the data.

import { buildMailto } from "./util.js";

const FIELD_LABELS = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  interest: "Product interest",
  project: "Project details",
  lookupEmail: "Email on file",
  orderNumber: "Order number",
  message: "Message",
};

function initMailtoForm(form) {
  const to = form.dataset.mailtoTo;
  const subject = form.dataset.mailtoSubject || "Website enquiry";
  const note = form.querySelector("[data-form-message]") || form.querySelector(".form-note");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const lines = ["Sent from the Triangle Coatings website.", ""];
    for (const [key, value] of data.entries()) {
      if (!String(value).trim()) continue;
      lines.push(`${FIELD_LABELS[key] || key}: ${value}`);
    }

    window.location.href = buildMailto(to, subject, lines);
    if (note) {
      note.textContent =
        "Your email application should open with your message addressed to " +
        to +
        ". If it does not, please call 1-925-583-0800. A specialist will follow up during business hours.";
    }
  });
}

export function initForms() {
  document.querySelectorAll("form[data-mailto-to]").forEach(initMailtoForm);
}
