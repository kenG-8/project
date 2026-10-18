const messages = [
    {
        img: "./assets/a1.jpg", //Thay ảnh
        text: "Chúc bạn luôn vui vẻ, xinh đẹp và ngập tràn yêu thương!" //Thay lời nhắn
    },
    {
        img: "./assets/a2.jpg",
        text: "Mỗi ngày của bạn đều là một đoá hoa nở rộ."
    },
    {
        img: "./assets/a3.jpg",
        text: "Cảm ơn bạn vì đã luôn mạnh mẽ và tuyệt vời như thế!"
    },
    {
        img: "./assets/a4.jpg",
        text: "Chúc bạn một ngày 20/10 thật hạnh phúc và trọn vẹn! "
    },
    {
        img: "./assets/a5.jpg",
        text: "Bạn là món quà tuyệt vời nhất mà cuộc sống mang lại! "
    }
];

let hasFirstLetterFallen = false;

const popup = document.getElementById("popup");
const overlay = document.getElementById("overlay");
const popupImage = document.getElementById("popupImage");
const popupMessage = document.getElementById("popupMessage");
const centerText = document.getElementById("centerText");
//Thay những ảnh rơi từ trên xuống ở đây
const letterImages = [
    "./assets/letters.png",
    "./assets/q3.png",
    "./assets/h1.png",
    "./assets/h3.png",
    "./assets/t2.png",
    "./assets/t5.png",
];

function createHeartExplosion(x, y) {
    //Thay icon khi ấn thư, hoa, quà
    const hearts = ["❤️", "💐", "🎁", "🌹", "💕", "💖"];
    const numHearts = 12;
    
    for (let i = 0; i < numHearts; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        
        const angle = (Math.PI * 2 / numHearts) * i;
        const distance = Math.random() * 80 + 40;
        
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
        heart.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
        heart.style.fontSize = (Math.random() * 10 + 20) + 'px';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 2000);
    }
}

function createFallingLetter() {
    const letter = document.createElement("img");
    const randomImage = letterImages[Math.floor(Math.random() * letterImages.length)];
    letter.src = randomImage;
    letter.classList.add("falling-letter");
    letter.style.left = Math.random() * (window.innerWidth - 50) + "px";
    letter.addEventListener("click", (e) => {
        createHeartExplosion(e.clientX, e.clientY);
        letter.classList.add('letter-clicked');
        setTimeout(() => {
            showPopup();
        }, 300);
    });
    
    document.body.appendChild(letter);
    
    setTimeout(() => {
        letter.remove();
    }, 8000);
}

let availableIndexes = [...Array(22).keys()]; // [0, 1, 2, ..., 21]

// remake by thethanh

function showPopup() {
    // Nếu đã dùng hết, reset lại danh sách
    if (availableIndexes.length === 0) {
        availableIndexes = [...Array(22).keys()];
    }

    // Chọn ngẫu nhiên một chỉ số từ danh sách còn lại
    const randomIndex = Math.floor(Math.random() * availableIndexes.length);
    const currentMessageIndex = availableIndexes[randomIndex];

    // Hiển thị popup
    const message = messages[currentMessageIndex];
    popupImage.src = message.img;
    popupMessage.textContent = message.text;
    popup.style.display = "block";
    overlay.classList.add("active");

    popup.dataset.currentMessage = message.text;

    // Xóa chỉ số đã dùng khỏi danh sách
    availableIndexes.splice(randomIndex, 1);
}

// end remake by thethanh

function closePopup() {
    popup.style.display = "none";
    overlay.classList.remove("active");

    if (popup.dataset.currentMessage) {
        centerText.innerHTML = popup.dataset.currentMessage;
    }
}

document.body.addEventListener("click", function () {
    const player = document.getElementById("player");
    if (player.paused) {
        player.play();
    }
});

overlay.addEventListener("click", closePopup);
setInterval(() => {
    createFallingLetter();
}, 1000);