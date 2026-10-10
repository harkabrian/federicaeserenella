const form = document.getElementById("rsvpForm");
const success = document.getElementById("successMessage");
const copyIban = document.getElementById("copyIban");
const copyFeedback = document.getElementById("copyFeedback");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  // DEMO: il backend RSVP non è ancora collegato.
  // Quando scegliamo il servizio (es. Formspree/Basin/endpoint serverless),
  // sostituiamo questo blocco con l'invio reale.
  form.querySelectorAll("input, select, textarea, button").forEach((el) => {
    el.disabled = true;
  });

  success.hidden = false;
  success.scrollIntoView({ behavior: "smooth", block: "center" });
});

document.querySelectorAll(".faq details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll(".faq details").forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});

copyIban?.addEventListener("click", async () => {
  const iban = copyIban.dataset.iban;
  try {
    await navigator.clipboard.writeText(iban);
    copyFeedback.textContent = "IBAN copiato.";
  } catch {
    copyFeedback.textContent = "Seleziona e copia l'IBAN manualmente.";
  }
  window.setTimeout(() => (copyFeedback.textContent = ""), 2500);
});
