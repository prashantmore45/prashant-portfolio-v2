const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".right");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});
