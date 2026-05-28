// =========================
// SCRIPT.JS
// =========================

document
  .querySelector(".contact-form")
  .addEventListener("submit", function(e){

    e.preventDefault();

    alert(
      "Thank you for contacting Triangle Coatings. A representative will contact you shortly."
    );

    this.reset();

});
