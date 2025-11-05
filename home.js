// ===== Redirect to admin login when clicking logo =====
document.getElementById('adminLogo').addEventListener('click', function() {
  window.location.href = 'admin.html';
});

// ===== "Book Now" button functionality =====
const bookNowBtn = document.getElementById('bookNowBtn');
if (bookNowBtn) {
  bookNowBtn.addEventListener('click', function() {
    // 🧹 Clear previous selected services from localStorage
    localStorage.removeItem('selectedServices');
    // ✅ Redirect to appointment page
    window.location.href = 'Appointment.html';
  });
}

// ===== Test PHP database connection =====
fetch('home.php')
  .then(res => res.json())
  .then(data => {
    console.log(data); // Check response in console
    const statusBox = document.createElement('p');
    statusBox.style.color = '#ffb6d5';
    statusBox.style.textAlign = 'center';
    statusBox.style.marginTop = '120px';
    statusBox.textContent = data.message;
    document.body.prepend(statusBox);
  })
  .catch(err => console.error('Error connecting to database:', err));
