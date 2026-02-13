// Tạo sao nhấp nháy
/* ======================= TẠO SAO NỀN TRỜI ======================= */
const starsContainer = document.getElementById('stars');

// Tạo 100 ngôi sao ngẫu nhiên
for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    starsContainer.appendChild(star);
}

/* ======================= CANVAS SETUP ======================= */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Resize canvas theo kích thước màn hình
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Hàm random tiện dụng
function random(min, max) {
    return Math.random() * (max - min) + min;
}

/* ======================= CLASS PARTICLE (HẠT PHÁO) ======================= */
class Particle {
    constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        
        // Góc bay ngẫu nhiên 0–360°
        const angle = random(0, Math.PI * 2);
        const speed = random(2, 8);
        
        // Vận tốc ban đầu
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        // Thời gian sống ngắn hơn
        this.life = 60;
        this.maxLife = 60;
        
        // Màu sắc cố định (không đổi màu để tối ưu)
        this.hue = hue;
        this.size = random(2, 4);
    }
    
    update() {
        // Trọng lực
        this.vy += 0.1;
        
        // Giảm tốc
        this.vx *= 0.97;
        
        // Cập nhật vị trí
        this.x += this.vx;
        this.y += this.vy;
        
        this.life--;
    }
    
    draw() {
        const alpha = this.life / this.maxLife;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Vẽ đơn giản hơn - chỉ vẽ hạt với glow nhẹ
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
        ctx.fill();
        
        ctx.restore();
    }
}

/* ======================= CLASS FIREWORK (PHÁO BAY LÊN) ======================= */
class Firework {
    constructor() {
        this.x = random(canvas.width * 0.2, canvas.width * 0.8);
        this.y = canvas.height;
        
        // Điểm nổ
        this.targetY = random(canvas.height * 0.2, canvas.height * 0.5);
        this.speed = random(7, 10);
        this.color = `hsl(${random(0, 360)}, 100%, 60%)`;
        this.exploded = false;
        this.trail = [];
    }
    
    update() {
        // Lưu vị trí để tạo đuôi
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 10) this.trail.shift();
        
        // Bay lên
        this.y -= this.speed;
        
        // Đến điểm thì nổ
        if (this.y <= this.targetY) {
            this.exploded = true;
            explode(this.x, this.y, this.color);
        }
    }
    
    draw() {
        // Vẽ đuôi pháo
        ctx.save();
        this.trail.forEach((pos, i) => {
            const alpha = i / this.trail.length;
            ctx.globalAlpha = alpha * 0.5;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        });
        ctx.restore();
        
        // Vẽ pháo chính
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

/* ======================= QUẢN LÝ PHÁO & HẠT ======================= */
let fireworks = [];
let particles = [];

// Hàm nổ pháo → tối ưu số lượng hạt
function explode(x, y, color) {
    const particleCount = 60; // Giảm từ 100-150 xuống 60
    const baseHue = parseInt(color.match(/hsl\((\d+)/)[1]);
    
    // Tạo bảng màu đơn giản hơn (3 màu thay vì 6)
    const colors = [
        baseHue,
        (baseHue + 60) % 360,
        (baseHue + 120) % 360
    ];
    
    // Chỉ dùng 1 kiểu nổ đơn giản
    for (let i = 0; i < particleCount; i++) {
        const hue = colors[i % colors.length];
        particles.push(new Particle(x, y, hue));
    }
}

/* ======================= BẮN PHÁO TỰ ĐỘNG ======================= */
function launchFirework() {
    fireworks.push(new Firework());
    setTimeout(launchFirework, random(400, 1000));
}
launchFirework();

/* ======================= VÒNG LẶP ANIMATION ======================= */
function animate() {
    // Tạo hiệu ứng mờ dần nền
    ctx.fillStyle = "rgba(10, 14, 39, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 💥 Vẽ vòng sóng ánh sáng
    shockwaves = shockwaves.filter(s => s.life > 0);
    shockwaves.forEach(s => {
        s.radius += 4;
        s.life--;
        
        const alpha = s.life / 30;
        ctx.save();
        ctx.globalAlpha = alpha * 0.3;
        ctx.strokeStyle = `hsl(${s.hue}, 100%, 70%)`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    });
    
    // Cập nhật & vẽ pháo bay
    fireworks = fireworks.filter(f => !f.exploded);
    fireworks.forEach(f => {
        f.update();
        f.draw();
    });
    
    // Cập nhật & vẽ hạt nổ
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    requestAnimationFrame(animate);
}
animate();