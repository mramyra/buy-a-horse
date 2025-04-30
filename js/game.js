// game.js

// Глобальные переменные
let coins = 0;
let clickValue = 1;
let passiveIncome = 0;
let upgrades = {
    sickle: { level: 0, basePrice: 50, price: 50, baseEffect: 1, effect: 0 },
    shovel: { level: 0, basePrice: 1000, price: 1000, baseEffect: 5, effect: 0 },
    worker: { level: 0, basePrice: 200, price: 200, baseEffect: 1, effect: 0 },
    stable: { level: 0, basePrice: 5000, price: 5000, baseEffect: 20, effect: 0 }
};
let achievements = [
    { id: 'newbie', name: 'Новичок', description: 'Собери 100 монет', target: 100, progress: 0, completed: false },
    { id: 'farmer', name: 'Фермер', description: 'Собери 1000 монет', target: 1000, progress: 0, completed: false },
    { id: 'konami', name: 'Konami Код', description: 'Активируй код Konami', target: 1, progress: 0, completed: false },
    { id: 'millionaire', name: 'Миллионер', description: 'Собери 1,000,000 монет', target: 1000000, progress: 0, completed: false },
    { id: 'clicker_10', name: 'Кликер I', description: 'Сделай 10 кликов', target: 10, progress: 0, completed: false },
    { id: 'clicker_100', name: 'Кликер II', description: 'Сделай 100 кликов', target: 100, progress: 0, completed: false },
    { id: 'clicker_1000', name: 'Кликер III', description: 'Сделай 1000 кликов', target: 1000, progress: 0, completed: false },
    { id: 'sickle_5', name: 'Мастер серпа I', description: 'Улучши серп до 5 уровня', target: 5, progress: 0, completed: false },
    { id: 'shovel_3', name: 'Мастер лопаты I', description: 'Улучши лопату до 3 уровня', target: 3, progress: 0, completed: false },
    { id: 'worker_10', name: 'Работодатель I', description: 'Нанимай 10 работников', target: 10, progress: 0, completed: false },
    { id: 'stable_5', name: 'Коннозаводчик I', description: 'Построй 5 конюшен', target: 5, progress: 0, completed: false },
    { id: 'coins_5000', name: 'Богач I', description: 'Собери 5000 монет', target: 5000, progress: 0, completed: false },
    { id: 'coins_50000', name: 'Богач II', description: 'Собери 50000 монет', target: 50000, progress: 0, completed: false },
    { id: 'coins_5000000', name: 'Богач III', description: 'Собери 5000000 монет', target: 5000000, progress: 0, completed: false },
    { id: 'passive_10', name: 'Пассивный доход I', description: 'Достигни 10 монет/сек', target: 10, progress: 0, completed: false },
    { id: 'passive_50', name: 'Пассивный доход II', description: 'Достигни 50 монет/сек', target: 50, progress: 0, completed: false },
    { id: 'passive_100', name: 'Пассивный доход III', description: 'Достигни 100 монет/сек', target: 100, progress: 0, completed: false },
    { id: 'click_value_10', name: 'Сила клика I', description: 'Достигни 10 монет за клик', target: 10, progress: 0, completed: false },
    { id: 'click_value_50', name: 'Сила клика II', description: 'Достигни 50 монет за клик', target: 50, progress: 0, completed: false },
    { id: 'upgrades_5', name: 'Покупатель I', description: 'Купи 5 улучшений', target: 5, progress: 0, completed: false },
    { id: 'upgrades_20', name: 'Покупатель II', description: 'Купи 20 улучшений', target: 20, progress: 0, completed: false },
    { id: 'upgrades_50', name: 'Покупатель III', description: 'Купи 50 улучшений', target: 50, progress: 0, completed: false },
    { id: 'coins_100000', name: 'Магнат', description: 'Собери 100,000 монет', target: 100000, progress: 0, completed: false },
    { id: 'sickle_10', name: 'Мастер серпа II', description: 'Улучши серп до 10 уровня', target: 10, progress: 0, completed: false }
];
let horsesBought = 0;
let clickCount = 0;
let totalUpgradesBought = 0;
let konamiActive = false;
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiProgress = [];
const currentUser = localStorage.getItem('currentUser');
const goal = 10000000;

// Функция загрузки прогресса
async function loadProgress() {
    if (!currentUser) {
        console.warn('Пользователь не авторизован. Пропускаем загрузку прогресса.');
        return;
    }

    try {
        if (!window.db) {
            throw new Error('Firestore не инициализирован. Проверь подключение Firebase и common.js.');
        }

        const userRef = window.db.collection('users').doc(currentUser);
        const doc = await userRef.get();
        if (!doc.exists) {
            console.error('Пользователь не найден:', currentUser);
            window.location.href = 'index.html';
            return;
        }

        const data = doc.data();
        coins = data.coins || 0;
        clickValue = data.clickValue || 1;
        passiveIncome = data.passiveIncome || 0;
        upgrades = data.upgrades || upgrades;
        achievements = data.achievements || achievements;
        horsesBought = data.horsesBought || 0;
        clickCount = data.clickCount || 0;
        totalUpgradesBought = data.totalUpgradesBought || 0;
        konamiActive = data.konamiActive || false;
        if (konamiActive) {
            clickValue += 100000;
            document.getElementById('konamiMessage').style.display = 'block';
        }

        updateUI();
    } catch (error) {
        console.error('Ошибка при загрузке прогресса:', error);
    }
}

// Функция сохранения прогресса
async function saveProgress() {
    if (!currentUser) {
        console.warn('Пользователь не авторизован. Пропускаем сохранение прогресса.');
        return;
    }

    try {
        if (!window.db) {
            throw new Error('Firestore не инициализирован. Проверь подключение Firebase и common.js.');
        }

        const userRef = window.db.collection('users').doc(currentUser);
        await userRef.set({
            coins: coins,
            clickValue: clickValue,
            passiveIncome: passiveIncome,
            upgrades: upgrades,
            achievements: achievements,
            horsesBought: horsesBought,
            clickCount: clickCount,
            totalUpgradesBought: totalUpgradesBought,
            konamiActive: konamiActive
        }, { merge: true });
    } catch (error) {
        console.error('Ошибка при сохранении прогресса:', error);
    }
}

// Функция проверки авторизации
function checkAuth() {
    if (!currentUser) {
        window.location.href = 'index.html';
    }
}

// Обновление UI
function updateUI() {
    document.getElementById('coinCount').textContent = Math.floor(coins);
    document.getElementById('progressText').textContent = `${Math.floor(coins)} / ${goal}`;
    document.getElementById('progressBar').style.width = `${(coins / goal) * 100}%`;
    document.getElementById('cpsCount').textContent = passiveIncome;

    document.getElementById('sickleLevel').textContent = upgrades.sickle.level;
    document.getElementById('sickleEffect').textContent = upgrades.sickle.effect;
    document.getElementById('sicklePrice').textContent = Math.floor(upgrades.sickle.price);

    document.getElementById('shovelLevel').textContent = upgrades.shovel.level;
    document.getElementById('shovelEffect').textContent = upgrades.shovel.effect;
    document.getElementById('shovelPrice').textContent = Math.floor(upgrades.shovel.price);

    document.getElementById('workerLevel').textContent = upgrades.worker.level;
    document.getElementById('workerEffect').textContent = upgrades.worker.effect;
    document.getElementById('workerPrice').textContent = Math.floor(upgrades.worker.price);

    document.getElementById('stableLevel').textContent = upgrades.stable.level;
    document.getElementById('stableEffect').textContent = upgrades.stable.effect;
    document.getElementById('stablePrice').textContent = Math.floor(upgrades.stable.price);
}

// Проверка достижения цели
function checkGoal() {
    if (coins >= goal) {
        coins -= goal;
        horsesBought += 1;
        saveProgress().then(() => {
            window.location.href = 'win.html';
        });
    }
}

// Обновление достижений
function updateAchievements() {
    achievements.forEach(achievement => {
        if (achievement.completed) return;

        let progress = 0;
        if (achievement.id.startsWith('coins_')) {
            progress = coins;
        } else if (achievement.id.startsWith('clicker_')) {
            progress = clickCount;
        } else if (achievement.id === 'sickle_5' || achievement.id === 'sickle_10') {
            progress = upgrades.sickle.level;
        } else if (achievement.id === 'shovel_3') {
            progress = upgrades.shovel.level;
        } else if (achievement.id === 'worker_10') {
            progress = upgrades.worker.level;
        } else if (achievement.id === 'stable_5') {
            progress = upgrades.stable.level;
        } else if (achievement.id.startsWith('passive_')) {
            progress = passiveIncome;
        } else if (achievement.id.startsWith('click_value_')) {
            progress = clickValue;
        } else if (achievement.id.startsWith('upgrades_')) {
            progress = totalUpgradesBought;
        }

        achievement.progress = progress;
        if (progress >= achievement.target) {
            achievement.completed = true;
            showAchievementNotification();
        }
    });
}

// Показ уведомления о достижении
function showAchievementNotification() {
    const notification = document.getElementById('achievementNotification');
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Обновление списка достижений
function updateAchievementsList() {
    const achievementsList = document.getElementById('achievementsList');
    achievementsList.innerHTML = '';

    achievements.forEach(achievement => {
        const card = document.createElement('div');
        card.className = `p-4 rounded-lg shadow ${achievement.completed ? 'bg-yellow-200' : 'bg-gray-200'}`;
        card.innerHTML = `
            <h3 class="text-lg font-bold">${achievement.name}</h3>
            <p>${achievement.description}</p>
            <p>Прогресс: ${Math.min(achievement.progress, achievement.target)} / ${achievement.target}</p>
        `;
        achievementsList.appendChild(card);
    });

    document.getElementById('achievementsModal').style.display = 'block';
}

// Обновление рейтинга
async function updateLeaderboard() {
    try {
        if (!window.db) {
            throw new Error('Firestore не инициализирован. Проверь подключение Firebase и common.js.');
        }

        const leaderboardBody = document.getElementById('leaderboardBody');
        leaderboardBody.innerHTML = '';

        const usersSnapshot = await window.db.collection('users').get();
        const users = [];
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            users.push({
                id: doc.id,
                username: userData.username || 'Аноним',
                horsesBought: userData.horsesBought || 0,
                coins: userData.coins || 0
            });
        });

        // Сортировка по количеству купленных коней (по убыванию)
        users.sort((a, b) => b.horsesBought - a.horsesBought);

        // Заполнение таблицы
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.horsesBought}</td>
                <td>${Math.floor(user.coins)}</td>
                <td>${index + 1}</td>
            `;
            leaderboardBody.appendChild(row);
        });

        document.getElementById('leaderboardModal').style.display = 'block';
    } catch (error) {
        console.error('Ошибка при обновлении рейтинга:', error);
    }
}

// Пассивный доход
function passiveIncomeLoop() {
    setInterval(() => {
        coins += passiveIncome;
        updateUI();
        updateAchievements();
        saveProgress();
        checkGoal();
    }, 1000);
}

// Создание частиц при клике
function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const randomX = (Math.random() - 0.5) * 100;
    const randomY = (Math.random() - 0.5) * 100;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty('--x', `${randomX}px`);
    particle.style.setProperty('--y', `${randomY}px`);
    document.getElementById('clickArea').appendChild(particle);
    setTimeout(() => particle.remove(), 500);
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    await loadProgress();
    passiveIncomeLoop();

    // Клик по монетке
    const clickArea = document.getElementById('clickArea');
    clickArea.addEventListener('click', (e) => {
        coins += clickValue;
        clickCount++;
        clickArea.querySelector('img').classList.add('clicked');
        const rect = clickArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        createParticle(x, y);
        updateUI();
        updateAchievements();
        checkGoal();
        saveProgress();
    });

    // Покупка улучшений
    document.getElementById('buySickle').addEventListener('click', async () => {
        if (coins >= upgrades.sickle.price) {
            coins -= upgrades.sickle.price;
            upgrades.sickle.level++;
            upgrades.sickle.price = upgrades.sickle.basePrice * Math.pow(1.15, upgrades.sickle.level);
            upgrades.sickle.effect = upgrades.sickle.baseEffect * upgrades.sickle.level;
            clickValue += upgrades.sickle.baseEffect;
            totalUpgradesBought++;
            updateUI();
            updateAchievements();
            await saveProgress();
        }
    });

    document.getElementById('buyShovel').addEventListener('click', async () => {
        if (coins >= upgrades.shovel.price) {
            coins -= upgrades.shovel.price;
            upgrades.shovel.level++;
            upgrades.shovel.price = upgrades.shovel.basePrice * Math.pow(1.15, upgrades.shovel.level);
            upgrades.shovel.effect = upgrades.shovel.baseEffect * upgrades.shovel.level;
            clickValue += upgrades.shovel.baseEffect;
            totalUpgradesBought++;
            updateUI();
            updateAchievements();
            await saveProgress();
        }
    });

    document.getElementById('buyWorker').addEventListener('click', async () => {
        if (coins >= upgrades.worker.price) {
            coins -= upgrades.worker.price;
            upgrades.worker.level++;
            upgrades.worker.price = upgrades.worker.basePrice * Math.pow(1.15, upgrades.worker.level);
            upgrades.worker.effect = upgrades.worker.baseEffect * upgrades.worker.level;
            passiveIncome += upgrades.worker.baseEffect;
            totalUpgradesBought++;
            updateUI();
            updateAchievements();
            await saveProgress();
        }
    });

    document.getElementById('buyStable').addEventListener('click', async () => {
        if (coins >= upgrades.stable.price) {
            coins -= upgrades.stable.price;
            upgrades.stable.level++;
            upgrades.stable.price = upgrades.stable.basePrice * Math.pow(1.15, upgrades.stable.level);
            upgrades.stable.effect = upgrades.stable.baseEffect * upgrades.stable.level;
            passiveIncome += upgrades.stable.baseEffect;
            totalUpgradesBought++;
            updateUI();
            updateAchievements();
            await saveProgress();
        }
    });

    // Код Konami
    document.addEventListener('keydown', (e) => {
        konamiProgress.push(e.key);
        if (konamiProgress.length > konamiCode.length) {
            konamiProgress.shift();
        }
        if (konamiProgress.join('') === konamiCode.join('')) {
            if (!konamiActive) {
                clickValue += 100000;
                konamiActive = true;
                document.getElementById('konamiMessage').style.display = 'block';
                achievements.find(a => a.id === 'konami').completed = true;
                showAchievementNotification();
                saveProgress();
            }
        }
    });

    // Показ достижений
    document.getElementById('showAchievements').addEventListener('click', updateAchievementsList);

    // Закрытие модального окна достижений
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('achievementsModal').style.display = 'none';
    });

    // Показ рейтинга
    document.getElementById('showLeaderboard').addEventListener('click', updateLeaderboard);

    // Закрытие модального окна рейтинга
    document.getElementById('closeLeaderboardModal').addEventListener('click', () => {
        document.getElementById('leaderboardModal').style.display = 'none';
    });

    // Выход
    document.getElementById('logout').addEventListener('click', async (e) => {
        e.preventDefault();
        await saveProgress();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});

// Сохранение прогресса перед обновлением страницы
window.addEventListener('beforeunload', async () => {
    await saveProgress();
});