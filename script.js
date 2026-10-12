const form = document.getElementById("rsvpForm");
const success = document.getElementById("successMessage");
const copyIban = document.getElementById("copyIban");
const copyFeedback = document.getElementById("copyFeedback");

function updateCountdown() {
  const target = new Date("2027-05-22T11:45:00+02:00").getTime();
  const diff = Math.max(0, target - Date.now());
  document.getElementById("days").textContent = Math.floor(diff / 86400000);
  document.getElementById("hours").textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0");
  document.getElementById("minutes").textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  document.getElementById("seconds").textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const endpoint = form.dataset.formspreeEndpoint?.trim();
  if (!endpoint) {
    alert("Il modulo RSVP è pronto, ma non è ancora collegato al servizio di raccolta risposte.");
    return;
  }
  const button = form.querySelector('button[type="submit"]');
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Invio…";
  try {
    const response = await fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error();
    form.reset();
    form.querySelectorAll("input, select, textarea").forEach((el) => (el.disabled = true));
    button.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch {
    alert("Non siamo riuscite a inviare la conferma. Riprova tra poco.");
    button.disabled = false;
    button.textContent = originalText;
  }
});

document.querySelectorAll(".faq details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll(".faq details").forEach((other) => { if (other !== detail) other.open = false; });
  });
});

copyIban?.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(copyIban.dataset.iban); copyFeedback.textContent = "IBAN copiato."; }
  catch { copyFeedback.textContent = "Seleziona e copia l'IBAN manualmente."; }
  setTimeout(() => (copyFeedback.textContent = ""), 2500);
});
