// CONFIG: Set your backend URL

const BACKEND = "https://prashant-portfolio-v2-backend.onrender.com";

// Apply theme on load (mobile system theme support)
(function applyInitialTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    // User preference has priority
    if (savedTheme === "light") {
      document.body.classList.add("light-mode");
    }
  } else {
    // No saved preference → follow system theme
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    if (prefersLight) {
      document.body.classList.add("light-mode");
    }
  }
})();

// LOAD PROJECTS FROM BACKEND

async function loadProjects() {

  const container = document.querySelector(".project-container");

  const cached = localStorage.getItem("projects");
  const cacheVersion = localStorage.getItem("projects_version");

  const CURRENT_VERSION = "v2";

  if (cached && cacheVersion === CURRENT_VERSION) {
    renderProjects(JSON.parse(cached));
    return;
  }

  try {
    const res = await fetch(`${BACKEND}/api/projects`);
    const projects = await res.json();

    localStorage.setItem("projects", JSON.stringify(projects));
    localStorage.setItem("projects_version", CURRENT_VERSION);

    renderProjects(projects);

  } catch (err) {
    container.innerHTML = "<p class='loading-text'>Failed to load projects.</p>";
    console.error(err);
  }
}


// LAZY LOAD PROJECTS ON SCROLL
let projectsLoaded = false;

window.addEventListener("scroll", () => {
  const projectsSection = document.getElementById("projects");
  if (!projectsSection || projectsLoaded) return;

  const rect = projectsSection.getBoundingClientRect();

  if (rect.top < window.innerHeight - 100) {
    loadProjects();
    projectsLoaded = true;
  }
});


function renderProjects(projects) {
  const container = document.querySelector(".project-container");
  container.innerHTML = "";

  projects.forEach(project => {
    container.innerHTML += `
      <div class="project-card">

        <!-- Project Image -->
        <img src="${project.image}" alt="${project.title}">

        <!-- Project Title -->
        <h3>${project.title}</h3>

        <!-- Project Type -->
        <span class="project-type">${project.type || "Web Application"}</span>

        <!-- Description -->
        <p>${project.description}</p>

        <!-- Tech Stack Badges -->
        <div class="tech-stack">
          ${project.tech?.map(tech => `<span class="tech-badge">${tech}</span>`).join("") || ""}
        </div>

        <!-- Action Buttons -->
        <div class="project-links">
          ${project.github ? `<a href="${project.github}" target="_blank">View Code</a>` : ""}
          ${project.demo ? `<a href="${project.demo}" target="_blank">Live Demo</a>` : ""}
        </div>

      </div>
    `;
  });

}


// CONTACT FORM SUBMISSION

const contactForm = document.querySelector(".contact form");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get values
    const name = contactForm.querySelector("input[type='text']").value.trim();
    const email = contactForm.querySelector("input[type='email']").value.trim();
    const message = contactForm.querySelector("textarea").value.trim();

    const payload = { name, email, message };

    try {
      const res = await fetch(`${BACKEND}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        alert("Message sent successfully! ✅");
        contactForm.reset();
      } else {
        alert("Failed to send message ❌");
      }

    } catch (error) {
      console.error(error);
      alert("Error sending message ❌");
    }
  });
}


// VISITOR COUNTER

async function incrementVisitor() {
  try {
    const res = await fetch(`${BACKEND}/api/visitors/add`, { method: "POST" });
    const data = await res.json();

    const visitorEl = document.getElementById("visitorCount");
    if (visitorEl) visitorEl.innerText = data.total;

  } catch (err) {
    console.error("Visitor count failed:", err);
  }
}

incrementVisitor();


// RESUME DOWNLOAD BUTTON
const resumeBtn = document.querySelector(".cta");

if (resumeBtn) {
  resumeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.open(`${BACKEND}/api/resume/download`, "_blank");
  });
}


function openSidebar() {
  document.getElementById("sidebar").style.width = "250px";
  document.body.style.overflow = "hidden";
}

function closeSidebar() {
  document.getElementById("sidebar").style.width = "0";
  document.body.style.overflow = "";
}
