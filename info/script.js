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
    { title:"In Love", artist:"LowG", src:"assest/audio/au1.mp3", cover:"https://i.scdn.co/image/ab67616d0000b2730e4f73e2d29e3c6f4320f3fa"},
    { title:"Anh đã ôn hơn", artist:"MCK", src:"assest/audio/au2.mp3", cover:"https://i.scdn.co/image/ab67616d0000b273f5505e7e39be33f679e7f828"},
    { title:"Ghé qua", artist:"Rainy Day", src:"assest/audio/au3.mp3", cover:"https://i.scdn.co/image/ab67616d0000b2738222d4f29a007f309a47d25e"},
    { title:"Tay to", artist:"MCK", src:"assest/audio/au4.mp3", cover:"https://i.scdn.co/image/ab67616d0000b273418c3ec4765d75806c596395"}
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
