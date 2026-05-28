// script.js

document.querySelector(".contact-form")
.addEventListener("submit", function(e){

  e.preventDefault();

  alert(
    "Thank you for contacting Triangle Coatings. A representative will reach out shortly."
  );

  this.reset();
});
