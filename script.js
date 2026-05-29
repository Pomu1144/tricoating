const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const navGroups = document.querySelectorAll(".nav-group");
const slides = Array.from(document.querySelectorAll(".hero-slide"));
const prevButton = document.querySelector(".slider-control--prev");
const nextButton = document.querySelector(".slider-control--next");
const dotsContainer = document.querySelector(".slider-dots");
let activeSlide = 0;
let slideTimer;

function setSlide(index) {
  activeSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
  });

  dotsContainer.querySelectorAll("button").forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeSlide);
    dot.setAttribute("aria-pressed", String(dotIndex === activeSlide));
  });
}

function startSlider() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => setSlide(activeSlide + 1), 6500);
}

function advanceSlide(step) {
  setSlide(activeSlide + step);
  startSlider();
}

slides.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Show slide ${index + 1}`);
  dot.addEventListener("click", () => {
    setSlide(index);
    startSlider();
  });
  dotsContainer.appendChild(dot);
});

prevButton.addEventListener("click", () => advanceSlide(-1));
nextButton.addEventListener("click", () => advanceSlide(1));

menuToggle.addEventListener("click", () => {
  const isOpen = body.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navGroups.forEach((group) => {
  const button = group.querySelector("button");

  button.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 820px)").matches) {
      navGroups.forEach((otherGroup) => {
        if (otherGroup !== group) otherGroup.classList.remove("is-open");
      });
      group.classList.toggle("is-open");
    }
  });
});

document.querySelectorAll(".primary-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

setSlide(0);
startSlider();
