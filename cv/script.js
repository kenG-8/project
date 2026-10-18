const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];
let w, h;

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Star {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * w;
    this.y = Math.random() * -h;
    this.size = Math.random() * 2 + 1;
    this.speed = Math.random() * 3 + 1;
    this.alpha = Math.random() * 0.8 + 0.2;
  }
  update() {
    this.y += this.speed;
    this.x += this.speed * 0.3;
    if (this.y > h) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.fill();
  }
}
for (let i = 0; i < 120; i++) stars.push(new Star());
function animateStars() {
  ctx.clearRect(0, 0, w, h);
  stars.forEach(s => { s.update(); s.draw(); });
  requestAnimationFrame(animateStars);
}
animateStars();
const skills = [
  { name: "C++", img: "img/a1.png" },
  { name: "Python", img: "img/a2.png" },
  { name: "C#", img: "img/a3.png" },
  { name: "Unity", img: "img/a4.png" },
  { name: "JavaScript", img: "img/a5.png" },
  { name: "HTML", img: "img/a6.png" }
];
const imgElement = document.getElementById("gallery-img");
const dynamicText = document.querySelector(".dynamic-text");

let skillIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const delayBetweenSkills = 3000; 

function typeEffect() {
  const currentSkill = skills[skillIndex].name;

  if (!isDeleting) {
    dynamicText.textContent = currentSkill.slice(0, ++charIndex);
    if (charIndex === currentSkill.length) {
      setTimeout(() => isDeleting = true, delayBetweenSkills - 1000);
    }
  } else {
    dynamicText.textContent = currentSkill.slice(0, --charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      skillIndex = (skillIndex + 1) % skills.length;
      imgElement.src = skills[skillIndex].img; 
    }
  }
  setTimeout(typeEffect, isDeleting ? 60 : typingSpeed);
}
typeEffect();

const audio = document.querySelector('#audio');
const namea = document.querySelector('.song-title');

const audiolist = [
  'audio/au1.mp3',
  'audio/au2.mp3',
  'audio/au3.mp3',
];
const nameaudio = [
  'In Love',
  'Anh Đã Ổn Hơn',
  'Ghé Qua',
];

let id = 0;
let star = true;
function typeSongName(text) {
  namea.textContent = "";
  let i = 0;
  function typing() {
    if (i < text.length) {
      namea.textContent += text.charAt(i);
      i++;
      setTimeout(typing, 100); 
    }
  }
  typing();
}

function playaudio() {
  audio.src = audiolist[id];
  typeSongName(nameaudio[id]); 
  audio.play();
}

audio.addEventListener('ended', function() {
  id = (id + 1) % audiolist.length;
  playaudio();
});

document.body.addEventListener('click', function() {
  if (star) {
    star = false;
    playaudio();
  }
});
const nextsong = document.querySelector('#next-song');
nextsong.addEventListener('click', function() {
  audio.dispatchEvent(new Event('ended'));
});