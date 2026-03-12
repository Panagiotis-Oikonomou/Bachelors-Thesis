const menu = document.querySelector('.menu');
const container = document.querySelector('.container');

menu.addEventListener('click', () => {
    container.classList.toggle('main-hidden');
});