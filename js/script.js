let track = document.getElementById("carousel-track");
let offset = 0;

function slideCarousel() {
  offset += 1;
  if (offset >= track.scrollWidth / 2) {
    offset = 0;
  }
  track.style.transform = `translateX(-${offset}px)`;
}

setInterval(slideCarousel, 20);


