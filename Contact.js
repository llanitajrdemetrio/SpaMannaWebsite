// === MAP INITIALIZATION ===
const spaCoords = [14.570363, 121.082239];
const map = L.map("map", { preferCanvas: true }).setView(spaCoords, 16);

// === TILE LAYER ===
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// === SPA MARKER (ALWAYS VISIBLE) ===
const spaIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/4315/4315113.png",
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -45],
});

const spaPopupHtml = `
  <div style="
    font-weight: 800;
    font-size: 15px;
    color: #9c2b64;
    text-align: center;
    text-transform: uppercase;
    margin-bottom: 6px;
  ">
    💗 SPA MANNA MASSAGE
  </div>
  <div style="
    font-weight: 600;
    font-size: 13px;
    color: #333;
    text-align: center;
    line-height: 1.5;
  ">
    1873 M. Eusebio Avenue, Barangay San Miguel,<br>
    Pasig City, Metro Manila, Philippines
  </div>
`;

const spaMarker = L.marker(spaCoords, { icon: spaIcon })
  .addTo(map)
  .bindPopup(spaPopupHtml)
  .openPopup();

// === SPA HIGHLIGHT CIRCLE ===
const spaCircle = L.circle(spaCoords, {
  color: "#ff66b2",
  fillColor: "#ffb6d5",
  fillOpacity: 0.25,
  radius: 220,
  weight: 4,
}).addTo(map);
spaCircle.bringToFront();

// === TRAVEL & ROUTE SETUP ===
let routeControl = null;

function formatTime(mins) {
  if (mins < 60) return `${Math.round(mins)} mins`;
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return `${h} hr${m ? ` ${m} mins` : ""}`;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function drawRoute(lat, lon) {
  if (routeControl) map.removeControl(routeControl);
  routeControl = L.Routing.control({
    waypoints: [L.latLng(lat, lon), L.latLng(spaCoords)],
    routeWhileDragging: false,
    draggableWaypoints: false,
    createMarker: () => null,
    addWaypoints: false,
    lineOptions: { styles: [{ color: "limegreen", opacity: 0.9, weight: 5 }] },
    showAlternatives: false,
    fitSelectedRoute: false,
  }).addTo(map);
}

function updateTravelCard(lat, lon) {
  const distance = haversineKm(lat, lon, spaCoords[0], spaCoords[1]);
  const mins = (distance / 20) * 60;
  const el = document.getElementById("travelCard");
  if (el) {
    el.innerHTML = `
      <strong>Expected Travel Time</strong><br><br>
      🚗 Car: <b>${formatTime(mins)}</b><br>
      🏍️ Motorcycle: <b>${formatTime(mins * 0.9)}</b><br>
      🚌 Bus: <b>${formatTime(mins * 1.2)}</b>
    `;
  }
}

// === SEARCH & GEOCODE ===
const input = document.getElementById("userLocation");
const findBtn = document.getElementById("findBtn");

function reopenBothPopups() {
  setTimeout(() => {
    spaMarker.openPopup();
    if (window.userMarker) window.userMarker.openPopup();
  }, 600);
}

function searchLocation() {
  const q = input.value.trim();
  if (!q) return alert("Please enter your location.");

  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(q)}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (!data || !data.length) {
        alert("Location not found.");
        return;
      }

      const { lat, lon, display_name } = data[0];
      const userCoords = [parseFloat(lat), parseFloat(lon)];

      // === NEW: User marker stays forever ===
      if (!window.userMarker) {
        const userPopupHtml = `
          <div style="
            font-weight: 800;
            font-size: 15px;
            color: #0056b3;
            text-align: center;
            text-transform: uppercase;
            margin-bottom: 4px;
          ">
            📍 YOUR LOCATION
          </div>
          <div style="
            font-weight: 600;
            font-size: 13px;
            color: #333;
            text-align: center;
            line-height: 1.4;
          ">
            ${display_name}
          </div>
        `;
        window.userMarker = L.marker(userCoords, {
          icon: L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -35],
          }),
        })
          .addTo(map)
          .bindPopup(userPopupHtml)
          .openPopup();
      } else {
        // update user marker position + popup text
        window.userMarker.setLatLng(userCoords);
        window.userMarker
          .bindPopup(`
            <div style="
              font-weight: 800;
              font-size: 15px;
              color: #0056b3;
              text-align: center;
              text-transform: uppercase;
              margin-bottom: 4px;
            ">
              📍 YOUR LOCATION
            </div>
            <div style="
              font-weight: 600;
              font-size: 13px;
              color: #333;
              text-align: center;
              line-height: 1.4;
            ">
              ${display_name}
            </div>
          `)
          .openPopup();
      }

      updateTravelCard(lat, lon);
      drawRoute(lat, lon);

      // === Keep both markers in view ===
      const bounds = L.latLngBounds([userCoords, spaCoords]);
      map.fitBounds(bounds, {
        padding: [80, 80],
        animate: true,
        duration: 1.5,
        maxZoom: 15,
      });

      // keep everything visible always
      spaMarker.addTo(map);
      spaCircle.addTo(map);
      reopenBothPopups();
    })
    .catch((err) => {
      console.error("Geocode error:", err);
      alert("Error fetching location.");
    });
}

// === EVENT LISTENERS ===
findBtn.addEventListener("click", searchLocation);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchLocation();
  }
});

// === MESSAGE FORM ===
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const overlay = document.getElementById("loaderOverlay");
    if (overlay) overlay.style.display = "flex";
    setTimeout(() => {
      if (overlay) overlay.style.display = "none";
      showToast("Message sent! We will reply soon.");
      contactForm.reset();
    }, 900);
  });
}

// === TOAST SYSTEM ===
function showToast(msg, time = 3000) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerHTML = `${msg} <span class="close-btn" id="toastClose">✕</span>`;
  toast.style.display = "block";
  requestAnimationFrame(() => toast.classList.add("show"));
  const close = document.getElementById("toastClose");
  if (close) close.addEventListener("click", hideToast);
  setTimeout(hideToast, time);
}

function hideToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.classList.remove("show");
  setTimeout(() => (toast.style.display = "none"), 300);
}

// === LOGO REDIRECT ===
const adminLogo = document.getElementById("adminLogo");
if (adminLogo) {
  adminLogo.addEventListener("click", () => {
    window.location.href = "admin.html";
  });
}
