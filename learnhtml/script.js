const articles = document.querySelectorAll('article');

document.addEventListener('pointermove', (event) => {
  articles.forEach((article) => {
    const rect = article.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (event.clientX - centerX) / (rect.width / 2);
    const y = (event.clientY - centerY) / (rect.height / 2);
    const px = Math.max(-1, Math.min(1, x));
    const py = Math.max(-1, Math.min(1, y));
    const container = article.querySelector('.img-container');
    container.style.transform = `translate(${px*20}px, ${py*20}px)`;
  });
});
const fblink=getSelectionquerry("#fb");
const iglink=getSelection('#ig');
iglink.addEventListener('click',()=>{
  window.location.href="https://www.instagram.com/trungg.24/";
})
fblink.addEventListener('click',()=>{
  window.location.href="https://www.facebook.com/trung.gtat";
})