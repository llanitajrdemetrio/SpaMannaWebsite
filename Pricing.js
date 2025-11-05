// 3D Parallax Tilt + Light Reflection Effect
document.querySelectorAll('.plan').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / 25).toFixed(2);
    const rotateY = ((x - centerX) / 25).toFixed(2);

    card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0) rotateY(0) scale(1)';
  });
});

// Redirect to admin login when logo is clicked
document.getElementById('adminLogo').addEventListener('click', function() {
  window.location.href = 'admin.html';
});
