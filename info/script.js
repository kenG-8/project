const audio = document.getElementById("audio");
const togglePlayBtn = document.getElementById("togglePlayBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const barsBox = document.getElementById("bars");
const current = document.getElementById("current");
const duration = document.getElementById("duration");
const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const coverImg = document.getElementById("coverImg");
const loveMessage = document.getElementById("loveMessage");

const playlist = [
    { title:"In Love", artist:"LowG", src:"assest/audio/au1.mp3", cover:"assest/inlove.png"},
    { title:"Anh đã ôn hơn", artist:"MCK", src:"assest/audio/au2.mp3", cover:"assest/adoh.png"},
    { title:"Ghé qua", artist:"Rainy Day", src:"assest/audio/au3.mp3", cover:"assest/ghequa.png"},
    { title:"Tay to", artist:"MCK", src:"assest/audio/au4.mp3", cover:"assest/tayto.png"}
];

let currentSongIndex=0, isPlaying=false, audioCtx, analyzer, source, barCount=40;

function loadSong(i){ 
    const s=playlist[i]; 
    audio.src=s.src; 
    songTitle.textContent=s.title; 
    artistName.textContent=s.artist; 
    coverImg.src=s.cover; 
    audio.load();
}

function playSong(){ isPlaying=true; togglePlayBtn.textContent="⏸"; audio.play(); startVis(); }
function pauseSong(){ isPlaying=false; togglePlayBtn.textContent="▶"; audio.pause(); }

togglePlayBtn.onclick=()=>isPlaying?pauseSong():playSong();
prevBtn.onclick=()=>{ currentSongIndex=(currentSongIndex-1+playlist.length)%playlist.length; loadSong(currentSongIndex); playSong(); };
nextBtn.onclick=()=>{ currentSongIndex=(currentSongIndex+1)%playlist.length; loadSong(currentSongIndex); playSong(); };

audio.addEventListener('ended', nextBtn.onclick);

function toBars(){ 
    for(let i=0;i<barCount;i++){ 
        let d=document.createElement("div"); 
        d.className="bar"; 
        barsBox.appendChild(d); 
    }
}

function fmt(t){ 
    let m=Math.floor(t/60); 
    let s=Math.floor(t%60); 
    return m+":"+(s<10?"0"+s:s);
}

function startVis(){
    if(!audioCtx){ 
        audioCtx=new (window.AudioContext||window.webkitAudioContext)(); 
        analyzer=audioCtx.createAnalyser(); 
        analyzer.fftSize=128;
        source=audioCtx.createMediaElementSource(audio); 
        source.connect(analyzer); 
        analyzer.connect(audioCtx.destination);
    }
    if(audioCtx.state==='suspended') audioCtx.resume();
    if(isPlaying) visual();
}

function visual(){
    if(!isPlaying) return; 
    let data=new Uint8Array(analyzer.frequencyBinCount); 
    analyzer.getByteFrequencyData(data);
    let bars=document.querySelectorAll('.bar');
    for(let i=0;i<barCount;i++){ 
        bars[i].style.height=Math.max(5,data[i]/4)+'px'; 
    }
    requestAnimationFrame(visual);
}

audio.addEventListener("loadedmetadata",()=>{ duration.textContent=fmt(audio.duration); });
audio.addEventListener("timeupdate",()=>{ current.textContent=fmt(audio.currentTime); });

document.addEventListener('DOMContentLoaded',()=>{
    toBars(); 
    loadSong(currentSongIndex);
    setTimeout(()=>{
        loveMessage.classList.add('show'); 
        loveMessage.addEventListener('animationend',handleLoveMessageAnimationEnd,{once:true}); 
    },1000);
});
const articles = document.querySelectorAll('article');
  document.addEventListener('pointermove', (event) => {
    articles.forEach(article => {
      const rect = article.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (event.clientX - centerX) / (rect.width / 2);
      const y = (event.clientY - centerY) / (rect.height / 2);
      article.style.setProperty('--pointer-x', x.toFixed(3));
      article.style.setProperty('--pointer-y', y.toFixed(3));
    });
  });
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
const fblink = document.querySelector('#fb');
const iglink = document.querySelector('#ig');
const ttlink = document.querySelector('#tiktok');
const githublink = document.querySelector('#github');

fblink.addEventListener('click', () => {
    window.open("https://www.facebook.com/trung.gtat", '_blank');
});

iglink.addEventListener('click', () => {
    window.open("https://www.instagram.com/trungg.24/", '_blank');
});

githublink.addEventListener('click', () => {
    window.open("https://github.com/kenG-8", '_blank');
});

ttlink.addEventListener('click', () => {
    window.open("https://www.tiktok.com/@trungg2737", '_blank');
});
