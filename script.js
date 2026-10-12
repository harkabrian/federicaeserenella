const form = document.getElementById("rsvpForm");
const success = document.getElementById("successMessage");
const copyIban = document.getElementById("copyIban");
const copyFeedback = document.getElementById("copyFeedback");
const progressBar = document.getElementById("progressBar");
const heroPhoto = document.querySelector(".hero-photo");
const nav = document.querySelector(".site-nav");

function updateCountdown() {
  const target = new Date("2027-05-22T11:45:00+02:00").getTime();
  const diff = Math.max(0, target - Date.now());
  const days = document.getElementById("days");
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");
  if (!days) return;
  days.textContent = Math.floor(diff / 86400000);
  hours.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0");
  minutes.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  seconds.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

function loadPhotoSlots() {
  document.querySelectorAll("[data-photo]").forEach((element) => {
    const path = element.dataset.photo;
    const image = new Image();
    image.onload = () => {
      if (element.classList.contains("hero-photo")) {
        element.style.backgroundImage = `url("${path}")`;
      } else {
        element.style.setProperty("--bg-image", `url("${path}")`);
        if (element.classList.contains("story-photo")) element.style.backgroundImage = `url("${path}")`;
      }
      element.classList.add("has-photo");
    };
    image.src = path;
  });
}
loadPhotoSlots();

let ticking = false;
function updateScrollEffects() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (nav) nav.style.background = scrollTop > 60 ? "rgba(30,42,33,.62)" : "rgba(30,42,33,.2)";
  if (heroPhoto && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroPhoto.style.transform = `translateY(${scrollTop * 0.12}px) scale(1.04)`;
  }
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}, { passive: true });
updateScrollEffects();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const endpoint = form.dataset.formspreeEndpoint?.trim();
  if (!endpoint) {
    alert("Il modulo RSVP non è ancora collegato al servizio di raccolta risposte.");
    return;
  }
  const honeypot = form.elements.namedItem("website");
  if (honeypot?.value) return;

  const button = form.querySelector('button[type="submit"]');
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Invio…";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("RSVP submission failed");
    form.reset();
    form.querySelectorAll("input:not([type='hidden']), select, textarea").forEach((el) => (el.disabled = true));
    button.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch {
    alert("Non siamo riuscite a inviare la conferma. Riprova tra poco.");
    button.disabled = false;
    button.textContent = originalText;
  }
});

document.querySelectorAll(".faq-list details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll(".faq-list details").forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});

copyIban?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(copyIban.dataset.iban);
    copyFeedback.textContent = "IBAN copiato.";
  } catch {
    copyFeedback.textContent = "Seleziona e copia l'IBAN manualmente.";
  }
  setTimeout(() => (copyFeedback.textContent = ""), 2500);
});
