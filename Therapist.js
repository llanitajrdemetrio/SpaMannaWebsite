<script>
  document.addEventListener("DOMContentLoaded", () => {
    // 🚫 Prevent user from accessing Therapist page after booking
    if (sessionStorage.getItem("booked") === "true") {
      window.location.replace("Appointment.html");
      return;
    }

    // ✅ Select all service cards
    const cards = document.querySelectorAll(".service-card");
    const loadingOverlay = document.getElementById("loadingOverlay");
    const successMessage = document.getElementById("successMessage");

    // === CARD EXPAND ===
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        // Collapse all other cards
        cards.forEach((c) => {
          if (c !== card) {
            c.classList.remove("expanded");
          }
        });
        card.classList.toggle("expanded");
      });

      // === BOOK BUTTON ===
      const bookBtn = card.querySelector(".book-btn");
      if (bookBtn) {
        bookBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const nameEl = card.querySelector("h3");
          const name = nameEl ? nameEl.textContent.trim() : "Therapist";

          if (loadingOverlay) {
            loadingOverlay.classList.add("active");
          }

          setTimeout(() => {
            if (loadingOverlay) {
              loadingOverlay.classList.remove("active");
            }
            if (successMessage) {
              successMessage.style.display = "block";
            }

            setTimeout(() => {
              if (successMessage) {
                successMessage.style.display = "none";
              }

              // 💾 Save booking session
              sessionStorage.setItem("booked", "true");

              // 🚀 Redirect to Appointment page
              window.location.replace(
                `Appointment.html?therapist=${encodeURIComponent(name)}`
              );
            }, 2000);
          }, 2000);
        });
      }
    });
  });

  // 💡 Prevent browser from caching this page (so back button won't load it)
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      window.location.replace("Appointment.html");
    }
  });

  // 💡 Extra safeguard: trap back button while still here
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = () => {
    window.history.go(1);
  };
</script>
