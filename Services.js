// === SERVICES.JS ===
// Handles "Add Service" buttons, duration modal, and redirect to Appointment page

let selectedServiceName = "";

// === DURATION OPTIONS PER SERVICE ===
const durationsByService = {
  "Combination Massage": ["1 hr", "1.5 hrs", "2 hrs"],
  "Swedish Massage": ["1 hr", "1.5 hrs", "2 hrs"],
  "Hilot Traditional Massage": ["1 hr", "1.5 hrs", "2 hrs"],
  "Deep Tissue Massage": ["1 hr", "1.5 hrs", "2 hrs"],
  "Thai Massage": ["1 hr", "1.5 hrs", "2 hrs"],
  "Hot Stone Massage": ["1.5 hrs", "2 hrs"],
  "Ventosa Massage": ["1.5 hrs", "2 hrs"],
  "Body Scrub Massage": ["1.5 hrs", "2 hrs"],
  "Hand & Foot Reflexology": ["1 hr", "1.5 hrs", "2 hrs"],
  "PostNatal & PreNatal": ["1 hr", "1.5 hrs"],
  "Kiddie Massage": ["1 hr"],
  "Ear Candling": ["0.5 hr"]
};

// === ELEMENTS ===
const modalOverlay = document.getElementById("durationModal");
const modalServiceName = document.getElementById("modalServiceName");
const durationOptions = document.getElementById("durationOptions");
const container = document.querySelector(".service-container");
const cards = document.querySelectorAll(".service-card");

// === ADD SERVICE ===
function addToCart(serviceName) {
  selectedServiceName = serviceName;
  openModal(serviceName);
}

// === OPEN MODAL ===
function openModal(serviceName) {
  modalServiceName.textContent = `Choose Duration for ${serviceName}`;
  durationOptions.innerHTML = "";

  const durations = durationsByService[serviceName] || ["1 hr"];
  durations.forEach((duration) => {
    const btn = document.createElement("button");
    btn.classList.add("duration-btn");
    btn.textContent = duration;
    btn.addEventListener("click", () => selectDuration(serviceName, duration));
    durationOptions.appendChild(btn);
  });

  modalOverlay.style.display = "flex";

  // Blur effect activation
  container.classList.add("filtered");
}

// === CLOSE MODAL ===
function closeModal() {
  modalOverlay.style.display = "none";

  // 🔧 Fix: restore clickability
  container.classList.remove("filtered");
  cards.forEach(c => c.classList.remove("active-card"));
}

// === SHOW LOADING OVERLAY ===
function showLoadingOverlay(message) {
  let overlay = document.createElement("div");
  overlay.classList.add("loading-overlay");
  overlay.innerHTML = `
    <div class="spinner"></div>
    <div class="loading-text">${message}</div>
  `;
  document.body.appendChild(overlay);
  overlay.style.display = "flex";
}

// === SELECT DURATION ===
function selectDuration(serviceName, duration) {
  const selectedService = { name: serviceName, duration: duration };

  // Save to localStorage
  localStorage.setItem("selectedService", JSON.stringify(selectedService));

  // Close modal & clear filters
  closeModal();

  // Show loading overlay
  showLoadingOverlay("Redirecting to appointment...");

  // Redirect after short delay
  setTimeout(() => {
    window.location.href = "Appointment.html";
  }, 800);
}

// === CLOSE MODAL WHEN CLICKING OUTSIDE ===
window.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// === CARD CLICK BEHAVIOR ===
cards.forEach((card) => {
  card.addEventListener("click", () => {
    // Highlight only clicked card
    cards.forEach((c) => c.classList.remove("active-card"));
    container.classList.add("filtered");
    card.classList.add("active-card");
  });
});

// === RESTORE CARDS AFTER MODAL CLOSE ===
if (modalOverlay) {
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
}

// === LOADING OVERLAY TRIGGER FOR BUTTONS ===
document.querySelectorAll(".add-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const overlay = document.querySelector(".loading-overlay");
    if (overlay) {
      overlay.classList.add("active");
      setTimeout(() => {
        overlay.classList.remove("active");
      }, 1800);
    }
  });
});

// === AUTO-FILL ON APPOINTMENT PAGE ===
document.addEventListener("DOMContentLoaded", () => {
  const selectedService = JSON.parse(localStorage.getItem("selectedService"));
  if (selectedService && window.location.pathname.includes("Appointment.html")) {
    const serviceDisplay = document.getElementById("selectedServiceDisplay");
    if (serviceDisplay) {
      serviceDisplay.textContent = `${selectedService.name} (${selectedService.duration})`;
    }
    // Clear storage after showing
    localStorage.removeItem("selectedService");
  }
});
document.getElementById('adminLogo').addEventListener('click', function() {
  window.location.href = 'admin.html';
});