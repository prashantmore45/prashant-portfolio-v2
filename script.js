import { projects } from "./data.js";


const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".right");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});


let projectsHTML = '';

projects.forEach((project) => {
  projectsHTML += `
    <div class="project-card" data-id="${project.id}">
      <img src="${project.image}" alt="Amazon Clone Project Screenshot">
      <h3>${project.name}</h3>
      <p>${project.description}</p>
      <a href="${project.link}" target="_blank">View on GitHub</a>
    </div>`;
  }
)

document.querySelector(".project-container").innerHTML = projectsHTML;