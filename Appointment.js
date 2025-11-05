// Appointment.js - full fixed script
document.addEventListener("DOMContentLoaded", () => {
  // Elements (guard against missing DOM nodes)
  const appointmentForm = document.getElementById("appointmentForm");
  const dropdownToggle = document.getElementById("dropdownToggle");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const mobileNumber = document.getElementById("mobileNumber");
  const mobileWarning = document.getElementById("mobileWarning");
  const dateInput = document.getElementById("appointmentDate");
  const proceedBtn = document.getElementById("proceedBtn");
  const startTime = document.getElementById("startTime");
  const endTimeDisplay = document.getElementById("endTimeDisplay");
  const adminLogo = document.getElementById("adminLogo");
  const navLinks = Array.from(document.querySelectorAll("nav ul li a"));

  if (!appointmentForm) return console.warn("Appointment form not found - script stopped.");

  // extra inputs
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const notesInput = document.getElementById("notes");

  // create gmail warning if not present in HTML
  let gmailWarning = document.getElementById("emailWarning");
  if (!gmailWarning && emailInput) {
    gmailWarning = document.createElement("span");
    gmailWarning.id = "emailWarning";
    gmailWarning.textContent = "⚠ Please enter a valid Gmail address (must end with @gmail.com).";
    gmailWarning.style.display = "none";
    gmailWarning.style.color = "#ff6666";
    gmailWarning.style.fontSize = "0.85rem";
    gmailWarning.style.fontWeight = "600";
    emailInput.insertAdjacentElement("afterend", gmailWarning);
  }

  let selectedService = null;
  let serviceLocked = false; // prevent changing when user came from services

  // Disable past dates
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
  }

  // Utility: convert HH:MM -> "h:mm AM/PM"
  function convertTo12Hr(time) {
    const [hStr, mStr] = time.split(":");
    let h = parseInt(hStr, 10);
    const m = mStr.padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }

  // Populate service list
  const allServices = [
    { name: "Combination Massage - 1hr", duration: 1 },
    { name: "Combination Massage - 1.5hrs", duration: 1.5 },
    { name: "Combination Massage - 2hrs", duration: 2 },
    { name: "Swedish Massage - 1hr", duration: 1 },
    { name: "Swedish Massage - 1.5hrs", duration: 1.5 },
    { name: "Swedish Massage - 2hrs", duration: 2 },
    { name: "Hilot Traditional Massage - 1hr", duration: 1 },
    { name: "Hilot Traditional Massage - 1.5hrs", duration: 1.5 },
    { name: "Hilot Traditional Massage - 2hrs", duration: 2 },
    { name: "Deep Tissue Massage - 1hr", duration: 1 },
    { name: "Deep Tissue Massage - 1.5hrs", duration: 1.5 },
    { name: "Deep Tissue Massage - 2hrs", duration: 2 },
    { name: "Thai Massage - 1hr", duration: 1 },
    { name: "Thai Massage - 1.5hrs", duration: 1.5 },
    { name: "Thai Massage - 2hrs", duration: 2 },
    { name: "Hot Stone Massage - 1.5hrs", duration: 1.5 },
    { name: "Hot Stone Massage - 2hrs", duration: 2 },
    { name: "Ventosa Massage - 1.5hrs", duration: 1.5 },
    { name: "Ventosa Massage - 2hrs", duration: 2 },
    { name: "Body Scrub Massage - 1.5hrs", duration: 1.5 },
    { name: "Body Scrub Massage - 2hrs", duration: 2 },
    { name: "Hand & Foot Reflexology - 1hr", duration: 1 },
    { name: "Hand & Foot Reflexology - 1.5hrs", duration: 1.5 },
    { name: "Hand & Foot Reflexology - 2hrs", duration: 2 },
    { name: "PostNatal & PreNatal - 1hr", duration: 1 },
    { name: "PostNatal & PreNatal - 1.5hrs", duration: 1.5 },
    { name: "Kiddie Massage - 1hr", duration: 1 },
    { name: "Ear Candling - 0.5hr", duration: 0.5 }
  ];

  // populate dropdown
  if (dropdownMenu && dropdownToggle) {
    dropdownMenu.innerHTML = "";
    allServices.forEach(service => {
      const item = document.createElement("div");
      item.className = "dropdown-item";
      item.textContent = service.name;
      item.addEventListener("click", () => {
        if (serviceLocked) return;
        dropdownMenu.querySelectorAll(".dropdown-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        dropdownToggle.textContent = service.name;
        selectedService = service;
        updateEndTime();
        dropdownMenu.classList.remove("active");
      });
      dropdownMenu.appendChild(item);
    });

    dropdownToggle.addEventListener("click", () => {
      if (!serviceLocked) dropdownMenu.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) dropdownMenu.classList.remove("active");
    });
  }

  // Populate start times
  if (startTime) {
    startTime.innerHTML = "<option value=''>Select Start Time ▾</option>";
    for (let hour = 9; hour <= 19; hour++) {
      startTime.add(new Option(convertTo12Hr(`${hour}:00`), `${hour}:00`));
      startTime.add(new Option(convertTo12Hr(`${hour}:30`), `${hour}:30`));
    }
    startTime.addEventListener("change", updateEndTime);
  }

  function updateEndTime() {
    if (!startTime || !selectedService) {
      if (endTimeDisplay) endTimeDisplay.textContent = "";
      return;
    }
    const start = startTime.value;
    if (!start) {
      endTimeDisplay.textContent = "";
      return;
    }
    const [hour, minute] = start.split(":").map(Number);
    const end = new Date();
    end.setHours(hour);
    end.setMinutes(minute + (selectedService.duration || 1) * 60);
    const endFormatted = convertTo12Hr(
      `${end.getHours().toString().padStart(2, "0")}:${end.getMinutes().toString().padStart(2, "0")}`
    );
    if (endTimeDisplay) endTimeDisplay.textContent = `🕓 Appointment ends at: ${endFormatted}`;
  }

  // Load saved data
  const savedSingle = JSON.parse(localStorage.getItem("selectedService"));
  const savedDraft = JSON.parse(localStorage.getItem("appointmentData"));

  if (savedSingle) {
    // User came from Services
    const txt = `${savedSingle.name} – ${savedSingle.duration}`;
    if (dropdownToggle) dropdownToggle.textContent = txt;

    selectedService = {
      name: txt,
      duration:
        savedSingle.duration.includes("1.5") ? 1.5 :
        savedSingle.duration.includes("2") ? 2 :
        savedSingle.duration.includes("0.5") ? 0.5 : 1
    };

    const durationNote = document.createElement("p");
    durationNote.textContent = `⏱ Duration: ${savedSingle.duration}`;
    durationNote.style.color = "#ffbde0";
    durationNote.style.fontWeight = "600";
    durationNote.style.marginTop = "8px";
    if (dropdownToggle) dropdownToggle.insertAdjacentElement("afterend", durationNote);
    updateEndTime();

    serviceLocked = true;
    if (dropdownToggle) {
      dropdownToggle.style.pointerEvents = "none";
      dropdownToggle.style.opacity = "0.6";
      dropdownToggle.setAttribute("aria-disabled", "true");
    }
    if (dropdownMenu) dropdownMenu.classList.remove("active");

    localStorage.removeItem("selectedService");
    localStorage.removeItem("appointmentData");
  } 
  else if (savedDraft) {
    if (fullNameInput) fullNameInput.value = savedDraft.name || "";
    if (emailInput) {
      emailInput.value = savedDraft.email || "";
      gmailWarning.style.display = emailInput.value && !emailInput.value.toLowerCase().endsWith("@gmail.com") ? "block" : "none";
    }
    if (mobileNumber) mobileNumber.value = savedDraft.mobile || "";
    if (dateInput) dateInput.value = savedDraft.date || "";
    if (startTime) startTime.value = savedDraft.startTimeValue || "";
    if (dropdownToggle) dropdownToggle.textContent = savedDraft.service || "Select Services ▾";
    if (endTimeDisplay && savedDraft.endTime)
      endTimeDisplay.textContent = `🕓 Appointment ends at: ${savedDraft.endTime}`;
  } else {
    appointmentForm.reset();
    localStorage.removeItem("appointmentData");
  }

  // Validation & saving logic
  if (mobileNumber) {
    mobileNumber.addEventListener("input", () => {
      mobileNumber.value = mobileNumber.value.replace(/[^\d]/g, "");
      if (mobileNumber.value.length > 11) mobileNumber.value = mobileNumber.value.slice(0, 11);
      if (mobileNumber.value.length === 0) {
        mobileWarning.style.display = "none";
      } else if (mobileNumber.value.length < 11) {
        mobileWarning.textContent = "⚠ Mobile number must be 11 digits.";
        mobileWarning.style.display = "block";
      } else {
        mobileWarning.style.display = "none";
      }
    });
  }

  if (emailInput && gmailWarning) {
    emailInput.addEventListener("input", () => {
      gmailWarning.style.display = emailInput.value && !emailInput.value.toLowerCase().endsWith("@gmail.com") ? "block" : "none";
    });
  }

  appointmentForm.addEventListener("input", () => {
    try {
      const data = {
        name: fullNameInput ? fullNameInput.value.trim() : "",
        email: emailInput ? emailInput.value.trim() : "",
        mobile: mobileNumber ? mobileNumber.value.trim() : "",
        date: dateInput ? dateInput.value.trim() : "",
        startTimeValue: startTime ? startTime.value : "",
        endTime: endTimeDisplay ? endTimeDisplay.textContent.replace("🕓 Appointment ends at: ", "") : "",
        service: dropdownToggle ? dropdownToggle.textContent : "",
        notes: notesInput ? notesInput.value : ""
      };
      localStorage.setItem("appointmentData", JSON.stringify(data));
    } catch (err) {
      console.warn("Could not save draft:", err);
    }
  });

  // Proceed button
  if (proceedBtn) {
    proceedBtn.addEventListener("click", () => {
      const name = fullNameInput ? fullNameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const mobile = mobileNumber ? mobileNumber.value.trim() : "";
      const date = dateInput ? dateInput.value.trim() : "";
      const timeStart = startTime ? startTime.value : "";

      if (!name || !email || !mobile || !date || !timeStart || !selectedService) {
        alert("⚠ Please fill out all required fields and select a service and time.");
        return;
      }

      if (!email.toLowerCase().endsWith("@gmail.com")) {
        alert("⚠ Please enter a valid Gmail address (must end with @gmail.com).");
        return;
      }

      if (mobile.length !== 11) {
        alert("⚠ Mobile number must be exactly 11 digits.");
        return;
      }

      const appointmentData = {
        name,
        email,
        mobile,
        date,
        startTime: convertTo12Hr(timeStart),
        endTime: endTimeDisplay ? endTimeDisplay.textContent.replace("🕓 Appointment ends at: ", "") : "",
        service: selectedService.name || (dropdownToggle ? dropdownToggle.textContent : "")
      };

      try {
        localStorage.setItem("appointmentData", JSON.stringify(appointmentData));
      } catch (e) {
        console.warn("Could not save appointmentData:", e);
      }

      // 🌀 Loading overlay before redirect
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.background = "rgba(0,0,0,0.7)";
      overlay.style.display = "flex";
      overlay.style.flexDirection = "column";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.color = "#fff";
      overlay.style.fontSize = "1.2rem";
      overlay.innerHTML = `
        <div class="spinner" style="
          border: 4px solid rgba(255,255,255,0.2);
          border-top: 4px solid #ffbde0;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        "></div>
        <p style="margin-top:15px;">Redirecting to therapist selection...</p>
      `;
      document.body.appendChild(overlay);

      const style = document.createElement("style");
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);

      setTimeout(() => {
        // 🔥 Clear everything before redirect
        localStorage.removeItem("appointmentData");
        appointmentForm.reset();
        window.location.href = "Therapist.html";
      }, 1200);
    });
  }

  // Reset form when coming back using browser back button
  window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
      appointmentForm.reset();
      localStorage.removeItem("appointmentData");
      localStorage.removeItem("selectedService");
    }
  });

  // cleanup for nav and admin logo
  if (navLinks && navLinks.length) {
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        localStorage.removeItem("appointmentData");
        appointmentForm.reset();
      });
    }); 
  }

  if (adminLogo) {
    adminLogo.addEventListener("click", () => {
      localStorage.removeItem("appointmentData");
      appointmentForm.reset();
      window.location.href = "admin.html";
    });
  }

  window.addEventListener("beforeunload", () => {
    localStorage.removeItem("appointmentData");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && dropdownMenu) dropdownMenu.classList.remove("active");
  });
});
