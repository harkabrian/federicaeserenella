const form = document.getElementById("rsvpForm");
const success = document.getElementById("successMessage1");
const copyIban = document.getElementById("copyIban");
const copyFeedback = document.getElementById("copyFeedback");
const progressBar = document.getElementById("progressBar");
const heroPhoto = document.querySelector(".hero-photo");
const nav = document.querySelector(".site-nav");

const rsvpStyles = document.createElement("link");
rsvpStyles.rel = "stylesheet";
rsvpStyles.href = "rsvp.css";
document.head.appendChild(rsvpStyles);

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

const guestCount = document.getElementById("guestCount");
const namesList = document.getElementById("namesList");
const addName = document.getElementById("addName");

function renderNameFields() {
  if (!guestCount || !namesList) return;
  const count = Number(guestCount.value || 1);
  const current = [...namesList.querySelectorAll("input[name='participant_names[]']")].map((input) => input.value);
  namesList.innerHTML = "";
  for (let i = 0; i < count; i += 1) {
    const row = document.createElement("div");
    row.className = "names-row";
    const input = document.createElement("input");
    input.type = "text";
    input.name = "participant_names[]";
    input.placeholder = "Nome e cognome";
    input.required = true;
    input.value = current[i] || "";
    row.appendChild(input);
    if (count > 1) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.setAttribute("aria-label", `Rimuovi partecipante ${i + 1}`);
      remove.textContent = "⌫";
      remove.addEventListener("click", () => {
        if (guestCount.value > 1) {
          guestCount.value = String(Math.max(1, Number(guestCount.value) - 1));
          renderNameFields();
        }
      });
      row.appendChild(remove);
    }
    namesList.appendChild(row);
  }
}
renderNameFields();
guestCount?.addEventListener("change", renderNameFields);
addName?.addEventListener("click", () => {
  if (!guestCount) return;
  const next = Math.min(4, Number(guestCount.value || 1) + 1);
  guestCount.value = String(next);
  renderNameFields();
});

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
  button.textContent = "Inviato";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("RSVP submission failed");
    form.reset();
    renderNameFields();
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
