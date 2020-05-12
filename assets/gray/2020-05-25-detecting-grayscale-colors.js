document.querySelectorAll('[data-color]').forEach(el => {
  const color = document.createElement('span')
  color.classList.add('color-preview')
  let targetColor = (el.dataset.color || el.textContent).trim();
  color.style.cssText = `
    color: ${targetColor};
    background: ${targetColor};
  `;
  color.onclick = () => {
    color.classList.toggle('show')
  }
  el.append(color)
});

document.addEventListener('keydown', function({key}) {
  if (key !== "Escape") {
    return;
  }

  document.querySelectorAll('.color-preview.show')
    .forEach(el => el.classList.remove('show'));
});

document.addEventListener("DOMContentLoaded", function() {
  const lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

  if ("IntersectionObserver" in window) {
    const lazyVideoObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (video) {
        if (video.isIntersecting) {
          video.target.load();
          video.target.classList.remove("lazy");
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideos.forEach(function(lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});
