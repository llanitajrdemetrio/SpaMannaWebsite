document.addEventListener("DOMContentLoaded", () => {
  // Retrieve bookings from localStorage (added from appointment page)
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  // --- Total bookings ---
  const totalBookings = bookings.length;
  document.getElementById("totalBookings").textContent = totalBookings;

  // --- Count per service ---
  const serviceCount = {};
  bookings.forEach(b => {
    if (Array.isArray(b.services)) {
      b.services.forEach(s => {
        serviceCount[s] = (serviceCount[s] || 0) + 1;
      });
    }
  });

  // --- Most popular service ---
  const topService = Object.entries(serviceCount)
    .sort((a,b) => b[1]-a[1])[0]?.[0] || "None";
  document.getElementById("topService").textContent = topService;

  // --- Predicted next month (+12% growth) ---
  const predicted = Math.round(totalBookings * 1.12);
  document.getElementById("predictedBookings").textContent = predicted;

  /* ---------------- BAR CHART ---------------- */
  const ctx1 = document.getElementById("serviceChart");
  new Chart(ctx1, {
    type: "bar",
    data: {
      labels: Object.keys(serviceCount),
      datasets: [{
        label: "Bookings",
        data: Object.values(serviceCount),
        backgroundColor: [
          "#ff85bc", "#d2277a", "#f1a1d0", "#c64b93", "#ffbde0", "#b93c7e"
        ],
        borderRadius: 6,
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { color: "#555" } },
        x: { ticks: { color: "#555" } }
      }
    }
  });

  /* ---------------- PIE CHART ---------------- */
  const ctx2 = document.getElementById("pieChart");
  new Chart(ctx2, {
    type: "doughnut",
    data: {
      labels: Object.keys(serviceCount),
      datasets: [{
        data: Object.values(serviceCount),
        backgroundColor: [
          "#ff85bc", "#d2277a", "#f1a1d0", "#c64b93", "#ffbde0", "#b93c7e"
        ],
        borderWidth: 2,
      }]
    },
    options: {
      plugins: { legend: { position: "bottom" } },
      cutout: "70%",
    }
  });

  /* ---------------- LINE CHART ---------------- */
  const monthlyData = {};
  bookings.forEach(b => {
    const date = new Date(b.bookedAt);
    const month = date.toLocaleString('default', { month: 'short' });
    monthlyData[month] = (monthlyData[month] || 0) + 1;
  });

  const ctx3 = document.getElementById("trendChart");
  new Chart(ctx3, {
    type: "line",
    data: {
      labels: Object.keys(monthlyData),
      datasets: [{
        label: "Bookings per Month",
        data: Object.values(monthlyData),
        borderColor: "#d2277a",
        backgroundColor: "rgba(210,39,122,0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "#9c2b64"
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { color: "#555" } },
        x: { ticks: { color: "#555" } }
      }
    }
  });
});
