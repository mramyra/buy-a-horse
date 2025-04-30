document.getElementById('playAgain').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('mainContainer').classList.add('fade-out');
    setTimeout(() => {
        window.location.href = 'game.html';
    }, 300);
});

document.getElementById('logout').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
});