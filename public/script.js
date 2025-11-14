// CONFIG: Set your backend URL

const BACKEND = "https://prashant-portfolio-v2-backend.onrender.com";

// Replace after deployment


// MOBILE NAVBAR HAMBURGER

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".right");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});



// LOAD PROJECTS FROM BACKEND

async function loadProjects() {
  try {
    const res = await fetch(`${BACKEND}/api/projects`);
    const projects = await res.json();

    let projectsHTML = "";

    projects.forEach((project) => {
      projectsHTML += `
        <div class="project-card" data-id="${project.id}">
          <img src="${project.image}" alt="${project.title}">
          <h3>${project.title}</h3>
          <p>${project.description}</p>

          <div class="project-links">
            ${project.github ? `<a href="${project.github}" target="_blank">View on GitHub</a>` : ""}
            ${project.demo ? `<a href="${project.demo}" target="_blank">Live Demo</a>` : ""}
          </div>
        </div>
      `;
    });

    document.querySelector(".project-container").innerHTML = projectsHTML;

  } catch (err) {
    console.error("Error loading projects:", err);
  }
}

loadProjects();


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
