// =====================================================================
// Mobile nav toggle
// =====================================================================
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");

navToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close mobile menu when a link is clicked
document.querySelectorAll(".nav__links a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

// =====================================================================
// Highlight the active section in the nav while scrolling
// =====================================================================
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav__links a");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === '#${id}');
      });
    });
  },
  { rootMargin: "-40% 0px -50% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

// =====================================================================
// Contact form — basic client-side validation + submit handling
//
// This does NOT send an email by itself. Wire it up to one of:
//   - Formspree / Getform (easiest: just point the <form action="">
//     at their endpoint and you can delete this fetch call)
//   - Your own backend API route
// =====================================================================
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!name || !email || !message) {
    setStatus("Please fill in every field.", "error");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setStatus("That email address doesn't look right.", "error");
    return;
  }

  const submitButton = contactForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  setStatus("Sending…", "pending");

  try {
    // Replace this block with a real endpoint (see comment above).
    await new Promise((resolve) => setTimeout(resolve, 700));

    setStatus("Thanks — I'll get back to you soon.", "success");
    contactForm.reset();
  } catch (error) {
    setStatus("Something went wrong. Try emailing me directly instead.", "error");
  } finally {
    submitButton.disabled = false;
  }
});

function setStatus(text, state) {
  formStatus.textContent = text;
  formStatus.dataset.state = state;
}

// =====================================================================
// Footer year
// =====================================================================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();