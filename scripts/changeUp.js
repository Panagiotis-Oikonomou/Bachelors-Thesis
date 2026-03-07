const file = window.location.pathname.split("/").pop();
const img = document.getElementById("chats");

const images = {
    "mychats.html": "../media/photos/chatsVisit.png",
    "profile.html": "../media/photos/profileVisit.png",
    "checkmatchings.html": "../media/photos/mymatchingsVisit.png",
    "criteria.html": "../media/photos/criteriaVisit.png",
    "match.html": "../media/photos/matchVisit.png",
    "notifications.html": "../media/photos/notificationsVisit.png",
    "paroxoi.html": "../media/photos/paroxoiWhite.png",
    "users.html": "../media/photos/usersVisit.png",
    "myareas.html": "../media/photos/myareasVisit.png"
};

if (images[file]) {
    img.src = images[file];
}