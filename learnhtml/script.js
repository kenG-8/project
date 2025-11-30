const clone = document.getElementById("clone");

document.querySelectorAll(".card").forEach(card => {

  card.addEventListener("mouseenter", e => {
    const img = card.dataset.img;
    clone.style.backgroundImage = `url(${img})`;
    clone.style.backgroundSize = "contain";
    clone.style.backgroundRepeat = "no-repeat";
    clone.style.opacity = 1;
    clone.style.transform = "translate(-50%, -50%) scale(1.3)";
  });

  card.addEventListener("mousemove", e => {
    clone.style.left = e.pageX + "px";
    clone.style.top = e.pageY + "px";
  });

  card.addEventListener("mouseleave", () => {
    clone.style.opacity = 0;
  });

});
