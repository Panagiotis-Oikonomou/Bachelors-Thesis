const map_button = document.querySelector('.map-button');
const cont = document.querySelector('.container');

map_button.addEventListener('click', () => {
    cont.classList.toggle('main-move');
});