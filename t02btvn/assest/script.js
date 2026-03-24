document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const panels = document.querySelectorAll('.content-panel');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Xóa active khỏi tất cả tabs
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Xóa active khỏi tất cả panels
            panels.forEach(panel => panel.classList.remove('active'));

            // Đặt active cho tab đang click
            item.classList.add('active');

            // Hiển thị panel tương ứng
            const targetId = item.getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);
            
            if (targetPanel) {
                targetPanel.classList.add('active');
                targetPanel.scrollTo({ top: 0, behavior: 'smooth' }); // Tự cuộn lên đầu đối với phần nội dung
            }
        });
    });

    // --- Logic phóng to ảnh thành viên (Highlight Image) ---
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("imgFull");
    const closeBtn = document.querySelector(".close-modal");
    const memberImages = document.querySelectorAll(".member-item img");

    memberImages.forEach(img => {
        img.onclick = function() {
            modal.style.display = "block";
            modalImg.src = this.src;
            document.body.style.overflow = "hidden"; // Khóa cuộn trang khi mở modal
        }
    });

    // Đóng modal khi click vào nút X
    closeBtn.onclick = function() {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }

    // Đóng modal khi click ra ngoài ảnh
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }
});

// --- Logic chạy nhạc ---
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

const playlist = [
    { title:"Thằng Điên", artist:"Jte-Phương Ly", src:"assest/audio/au1.mp3", cover:"assest/img/au1.jfif"},
    { title:"chỉ một đêm nữa thôi", artist:"MCK", src:"assest/audio/au2.mp3", cover:"assest/img/au2.jfif"},
    { title:"your smile", artist:"Obito-vstra", src:"assest/audio/au3.mp3", cover:"assest/img/au3.jfif"},
    { title:"Ghé qua", artist:"DICK-PC-TOFU", src:"assest/audio/au4.mp3", cover:"assest/img/au4.jfif"}
];

let currentSongIndex = 0, isPlaying = false, audioCtx, analyzer, source, barCount = 30;

function loadSong(i) { 
    if(!playlist[i]) return;
    const s = playlist[i]; 
    audio.src = s.src; 
    songTitle.textContent = s.title; 
    artistName.textContent = s.artist; 
    coverImg.src = s.cover; 
    audio.load();
    if(typeof renderPlaylist === 'function') renderPlaylist();
}

function playSong() { 
    isPlaying = true; 
    togglePlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'; 
    audio.play().catch(e => console.log("Audio play blocked", e)); 
    startVis(); 
}

function pauseSong() { 
    isPlaying = false; 
    togglePlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>'; 
    audio.pause(); 
}

if(togglePlayBtn) {
    togglePlayBtn.onclick = () => isPlaying ? pauseSong() : playSong();
    prevBtn.onclick = () => { currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length; loadSong(currentSongIndex); playSong(); };
    nextBtn.onclick = () => { currentSongIndex = (currentSongIndex + 1) % playlist.length; loadSong(currentSongIndex); playSong(); };

    audio.addEventListener('ended', nextBtn.onclick);
}

function toBars() { 
    if(!barsBox) return;
    for(let i=0; i<barCount; i++) { 
        let d = document.createElement("div"); 
        d.className = "bar"; 
        barsBox.appendChild(d); 
    }
}

function fmt(t) { 
    if(isNaN(t)) return "0:00";
    let m = Math.floor(t / 60); 
    let s = Math.floor(t % 60); 
    return m + ":" + (s < 10 ? "0" + s : s);
}

function startVis() {
    if(!audioCtx) { 
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
            analyzer = audioCtx.createAnalyser(); 
            analyzer.fftSize = 64; 
            source = audioCtx.createMediaElementSource(audio); 
            source.connect(analyzer); 
            analyzer.connect(audioCtx.destination);
        } catch(e) {
            console.log("AudioContext blocked", e);
        }
    }
    if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    if(isPlaying) visual();
}

function visual() {
    if(!isPlaying) return; 
    let data = new Uint8Array(analyzer.frequencyBinCount); 
    analyzer.getByteFrequencyData(data);
    let bars = document.querySelectorAll('.audio-barbox .bar');
    for(let i=0; i<barCount; i++) { 
        if(bars[i]) {
            bars[i].style.height = Math.max(5, data[i] / 4) + 'px'; 
        }
    }
    requestAnimationFrame(visual);
}

// --- Hiển thị Playlist ---
const audioPlayer = document.getElementById("audioPlayer");
const audioPlaylist = document.getElementById("audioPlaylist");
const playlistBtn = document.getElementById("playlistBtn");

function renderPlaylist() {
    if(!audioPlaylist) return;
    audioPlaylist.innerHTML = '';
    playlist.forEach((song, index) => {
        const item = document.createElement("div");
        item.className = `playlist-item ${index === currentSongIndex ? 'playing' : ''}`;
        item.innerHTML = `
            <img src="${song.cover}" alt="cover">
            <div style="flex:1; overflow:hidden;">
                <div style="font-weight: 600; font-size: 0.85rem; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${song.title}</div>
                <div style="font-size: 0.7rem; color: #64748b;">${song.artist}</div>
            </div>
            ${index === currentSongIndex && isPlaying ? '<i class="fa-solid fa-volume-high" style="color:var(--primary-color); font-size: 0.8rem;"></i>' : ''}
        `;
        item.onclick = () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        };
        audioPlaylist.appendChild(item);
    });
}

if(playlistBtn && audioPlaylist) {
    playlistBtn.onclick = () => {
        audioPlaylist.classList.toggle('show');
        playlistBtn.classList.toggle('active');
    };
}

// --- Tính năng gập (Collapse) khi không tương tác ---
let inactivityTimer;
function resetInactivity() {
    if(audioPlayer) {
        // Hủy bỏ mode collapsed khi có tương tác (rê chuột, click)
        audioPlayer.classList.remove('collapsed');
        clearTimeout(inactivityTimer);
        
        // Cài đặt sau 4 giây không tương tác
        inactivityTimer = setTimeout(() => {
            if (!audioPlayer.matches(':hover')) {
                audioPlayer.classList.add('collapsed');
                if (audioPlaylist && audioPlaylist.classList.contains('show')) {
                    audioPlaylist.classList.remove('show');
                    if(playlistBtn) playlistBtn.classList.remove('active');
                }
            }
        }, 4000); 
    }
}

if(audioPlayer) {
    audioPlayer.addEventListener('mousemove', resetInactivity);
    audioPlayer.addEventListener('click', resetInactivity);
    audioPlayer.addEventListener('mouseleave', resetInactivity);
    resetInactivity(); 
}

if(audio) {
    audio.addEventListener("loadedmetadata", () => { duration.textContent = fmt(audio.duration); });
    audio.addEventListener("timeupdate", () => { current.textContent = fmt(audio.currentTime); });
    audio.addEventListener("play", renderPlaylist);
    audio.addEventListener("pause", renderPlaylist);

    toBars(); 
    loadSong(currentSongIndex);
}
