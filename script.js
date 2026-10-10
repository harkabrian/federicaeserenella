document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       REVEAL ANIMATIONS
    ========================= */

    const revealElements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });


    /* =========================
       RSVP DEMO
    ========================= */

    const form = document.getElementById("rsvp-form");
    const success = document.getElementById("rsvp-success");

    if (form && success) {

        form.addEventListener("submit", (event) => {

            event.preventDefault();

            form.style.display = "none";
            success.hidden = false;

            success.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        });

    }


    /* =========================
       FAQ
    ========================= */

    const faqItems = document.querySelectorAll("details");

    faqItems.forEach((item) => {

        item.addEventListener("toggle", () => {

            if (item.open) {

                faqItems.forEach((other) => {

                    if (other !== item) {
                        other.removeAttribute("open");
                    }

                });

            }

        });

    });

});
