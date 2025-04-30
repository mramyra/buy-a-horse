// win.js

// Ждём загрузки DOM
document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        // Перенаправляем, если пользователь не авторизован, без асинхронных операций
        window.location.href = 'index.html';
        return;
    }

    // Получаем ссылку на кнопку "Играть снова"
    const playAgainButton = document.getElementById('playAgain');

    try {
        // Проверяем, инициализирован ли window.db
        if (!window.db) {
            throw new Error('Firestore не инициализирован. Проверь подключение Firebase и common.js.');
        }

        // Получаем данные пользователя из Firestore
        const userRef = window.db.collection('users').doc(currentUser);
        const doc = await userRef.get();
        if (!doc.exists) {
            console.error('Пользователь не найден:', currentUser);
            window.location.href = 'index.html';
            return;
        }

        // Получаем текущие данные
        const userData = doc.data();
        let horsesBought = userData.horsesBought || 0; // horsesBought уже увеличен в game.js

        // Сбрасываем прогресс для новой игры
        const initialUpgrades = {
            sickle: { level: 0, basePrice: 50, price: 50, baseEffect: 1, effect: 0 },
            shovel: { level: 0, basePrice: 1000, price: 1000, baseEffect: 5, effect: 0 },
            worker: { level: 0, basePrice: 200, price: 200, baseEffect: 1, effect: 0 },
            stable: { level: 0, basePrice: 5000, price: 5000, baseEffect: 20, effect: 0 }
        };

        const initialAchievements = [
            { id: 'newbie', completed: false },
            { id: 'farmer', completed: false },
            { id: 'konami', completed: false },
            { id: 'millionaire', completed: false },
            { id: 'clicker_10', completed: false },
            { id: 'clicker_100', completed: false },
            { id: 'clicker_1000', completed: false },
            { id: 'sickle_5', completed: false },
            { id: 'shovel_3', completed: false },
            { id: 'worker_10', completed: false },
            { id: 'stable_5', completed: false },
            { id: 'coins_5000', completed: false },
            { id: 'coins_50000', completed: false },
            { id: 'coins_5000000', completed: false },
            { id: 'passive_10', completed: false },
            { id: 'passive_50', completed: false },
            { id: 'passive_100', completed: false },
            { id: 'click_value_10', completed: false },
            { id: 'click_value_50', completed: false },
            { id: 'upgrades_5', completed: false },
            { id: 'upgrades_20', completed: false },
            { id: 'upgrades_50', completed: false },
            { id: 'coins_100000', completed: false },
            { id: 'sickle_10', completed: false }
        ];

        // Сохраняем сброшенный прогресс, оставляя horsesBought неизменным
        await userRef.update({
            coins: 0, // Сбрасываем монеты
            clickValue: 1, // Сбрасываем значение клика
            passiveIncome: 0, // Сбрасываем пассивный доход
            upgrades: initialUpgrades, // Сбрасываем улучшения
            achievements: initialAchievements // Сбрасываем достижения
        });

        // Обработчик для кнопки "Играть снова"
        playAgainButton.addEventListener('click', () => {
            document.getElementById('mainContainer').classList.add('fade-out');
            setTimeout(() => {
                window.location.href = 'game.html'; // Перенаправляем на страницу игры
            }, 300);
        });
    } catch (error) {
        console.error('Ошибка при обработке данных:', error);
        alert('Произошла ошибка. Проверь консоль.');
        // В случае ошибки всё равно позволим пользователю продолжить игру
        playAgainButton.addEventListener('click', () => {
            document.getElementById('mainContainer').classList.add('fade-out');
            setTimeout(() => {
                window.location.href = 'game.html';
            }, 300);
        });
    }
});