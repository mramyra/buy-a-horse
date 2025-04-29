// Плавный переход при клике на ссылки
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        document.getElementById('mainContainer').classList.add('fade-out');
        setTimeout(() => {
            window.location.href = href;
        }, 300);
    });
});