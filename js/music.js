/* 
music.js - Music control and toggle logic
*/

const music = document.getElementById('music');
const musicToggleCheckbox = document.getElementById('music-toggle-checkbox');

document.getElementById('start-btn').onclick = function() {
  if (music && (!musicToggleCheckbox || musicToggleCheckbox.checked)) {
    music.play().catch(() => {});
  }
};

if (musicToggleCheckbox) {
  musicToggleCheckbox.addEventListener('change', function() {
    if (musicToggleCheckbox.checked) {
      music.play().catch(() => {});
    } else {
      music.pause();
      music.currentTime = 0;
    }
  });
}
