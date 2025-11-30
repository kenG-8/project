let opened = false;

function openNotebook() {
    const notebook = document.getElementById('notebook');
    if(!opened) {
        notebook.style.transform = 'rotateY(-180deg)'; // mở vở
        opened = true;
    } else {
        notebook.style.transform = 'rotateY(0deg)'; // đóng vở
        opened = false;
    }
}
