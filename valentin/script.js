const canvas = document.getElementById('heartRain');
const ctx = canvas.getContext('2d');

let width, height;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initDrops();
}

const fontSize = 16;
let columns = Math.ceil(width / fontSize);
let drops = [];

function initDrops() {
    columns = Math.ceil(width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * (height / fontSize));
    }
}

window.addEventListener('resize', () => {
    resize();
    resizeOverlay();
});

resize();
initDrops();

const chars = "VALENTINE1402I❤U";
const charArray = chars.split("");

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, width, height);

    ctx.font = fontSize + "px 'Share Tech Mono', monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];

        if (text === '❤' || Math.random() > 0.97) {
            ctx.fillStyle = "#ff0055";
        } else {
            ctx.fillStyle = "#555555";
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i] += 0.8;
    }

    requestAnimationFrame(drawMatrix);
}

drawMatrix();

const overlayCanvas = document.getElementById('heartOverlay');
const oCtx = overlayCanvas.getContext('2d');

let oWidth, oHeight;

let particles = [];
let noteIndex = 0;
let isHeart = true;

function resizeOverlay() {
    oWidth = window.innerWidth;
    oHeight = window.innerHeight;
    overlayCanvas.width = oWidth;
    overlayCanvas.height = oHeight;
    if (particles.length > 0) {
        if (isHeart) {
            toHeart();
        } else {
            toCurrentNote();
        }
    }
}
resizeOverlay();

const listnote = [
    "Chúc bạn Valentine vui vẻ",
    "Mãi luôn xinh đẹp nhé",
    "Cậu luôn là bông hoa đẹp nhất trên đời",
    "Chúc cậu luôn hạnh phúc",
    "LOVE YOU ❤"
];

class Particle {
    constructor(x, y) {
        this.x = Math.random() * oWidth;
        this.y = Math.random() * oHeight;
        this.targetX = x;
        this.targetY = y;
        this.size = 4;
        this.color = '#ffffff';
        this.speed = 0.05;
    }

    update() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;

        this.x += dx * this.speed;
        this.y += dy * this.speed;
    }

    draw() {
        oCtx.fillStyle = this.color;
        oCtx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
}

function getHeartPoints() {
    const vCanvas = document.createElement('canvas');
    vCanvas.width = oWidth;
    vCanvas.height = oHeight;
    const vCtx = vCanvas.getContext('2d');

    vCtx.fillStyle = '#ff0055';
    vCtx.beginPath();

    const k = Math.min(oWidth, oHeight) / 45;
    const cx = oWidth / 2;
    const cy = oHeight / 2 - oHeight * 0.05;

    for (let t = 0; t <= Math.PI * 2; t += 0.01) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        if (t === 0) {
            vCtx.moveTo(cx + x * k, cy + y * k);
        } else {
            vCtx.lineTo(cx + x * k, cy + y * k);
        }
    }
    vCtx.closePath();
    vCtx.fill();

    return samplePointsFromCanvas(vCanvas, 3);
}

function getTextPoints(text) {
    const vCanvas = document.createElement('canvas');
    vCanvas.width = oWidth;
    vCanvas.height = oHeight;
    const vCtx = vCanvas.getContext('2d');

    const fontSize = Math.max(Math.min(oWidth / 10, oHeight / 8), 50);
    vCtx.font = `900 ${fontSize}px Arial, sans-serif`;
    vCtx.fillStyle = '#fff';
    vCtx.textAlign = 'center';
    vCtx.textBaseline = 'middle';

    const words = text.split(' ');
    const lineHeight = fontSize * 1.2;
    const maxWidth = oWidth * 0.85;

    let lines = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = vCtx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine !== '') {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });
    lines.push(currentLine);

    const startY = oHeight / 2 - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, i) => {
        vCtx.fillText(line, oWidth / 2, startY + i * lineHeight);
    });

    return samplePointsFromCanvas(vCanvas, 3);
}

function samplePointsFromCanvas(canvas, gap) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const points = [];

    for (let y = 0; y < canvas.height; y += gap) {
        for (let x = 0; x < canvas.width; x += gap) {
            const index = (y * canvas.width + x) * 4;
            if (imageData[index + 3] > 128) {
                points.push({ x, y });
            }
        }
    }

    return points;
}

function updateParticles(targetPoints) {
    if (particles.length < targetPoints.length) {
        const needed = targetPoints.length - particles.length;
        for (let i = 0; i < needed; i++) {
            const p = new Particle(oWidth / 2, oHeight / 2);
            particles.push(p);
        }
    }

    for (let i = 0; i < particles.length; i++) {
        if (i < targetPoints.length) {
            particles[i].targetX = targetPoints[i].x;
            particles[i].targetY = targetPoints[i].y;
            particles[i].color = '#ffffff';
        } else {
            particles[i].targetX = oWidth / 2;
            particles[i].targetY = oHeight / 2;
            particles[i].color = 'rgba(255, 255, 255, 0)';
        }
    }
}

function toHeart() {
    isHeart = true;
    const points = getHeartPoints();
    updateParticles(points);
    const hint = document.getElementById('clickHint');
    if (hint) hint.style.opacity = 1;
}

function toCurrentNote() {
    const text = listnote[noteIndex];
    const points = getTextPoints(text);
    updateParticles(points);
    const hint = document.getElementById('clickHint');
    if (hint) hint.style.opacity = 0;
}

function toNextNote() {
    isHeart = false;
    const text = listnote[noteIndex];
    const points = getTextPoints(text);
    updateParticles(points);
    const hint = document.getElementById('clickHint');
    if (hint) hint.style.opacity = 0;
    noteIndex = (noteIndex + 1) % listnote.length;
}

function animateOverlay() {
    oCtx.clearRect(0, 0, oWidth, oHeight);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animateOverlay);
}

overlayCanvas.addEventListener('click', () => {
    if (isHeart) {
        noteIndex = 0;
        toNextNote();
    } else {
        if (noteIndex >= listnote.length) {
            noteIndex = 0;
            toHeart();
        } else {
            toNextNote();
        }
    }
});

overlayCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (isHeart) {
        noteIndex = 0;
        toNextNote();
    } else {
        if (noteIndex >= listnote.length) {
            noteIndex = 0;
            toHeart();
        } else {
            toNextNote();
        }
    }
});

toHeart();
animateOverlay();