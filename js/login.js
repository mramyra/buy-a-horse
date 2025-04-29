document.getElementById('loginButton').addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    if (username === '') {
        alert('Пожалуйста, введите имя пользователя!');
        return;
    }

    const userRef = window.db.collection('users').doc(username);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        await userRef.set({
            username: username,
            coins: 0,
            clickValue: 1,
            passiveIncome: 0,
            horsesBought: 0,
            upgrades: {
                sickle: { level: 0, basePrice: 50, price: 50, baseEffect: 1, effect: 0 },
                shovel: { level: 0, basePrice: 1000, price: 1000, baseEffect: 5, effect: 0 },
                worker: { level: 0, basePrice: 200, price: 200, baseEffect: 1, effect: 0 },
                stable: { level: 0, basePrice: 5000, price: 5000, baseEffect: 20, effect: 0 }
            },
            achievements: []
        });
    }

    localStorage.setItem('currentUser', username);
    document.getElementById('mainContainer').classList.add('fade-out');
    setTimeout(() => {
        window.location.href = 'game.html';
    }, 300);
});