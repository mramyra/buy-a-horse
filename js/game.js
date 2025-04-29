// Инициализация переменных
let coins = 0;
let horsesBought = 0;
const goal = 10000000;
let clickValue = 1;
let passiveIncome = 0;
let konamiActivated = false;
const KONAMI_BONUS_CLICK_VALUE = 100000;
let clicks = 0;
let lastClicks = 0;
let cps = 0;

// Данные об улучшениях
const upgrades = {
    sickle: { level: 0, basePrice: 50, price: 50, baseEffect: 1, effect: 0 },
    shovel: { level: 0, basePrice: 1000, price: 1000, baseEffect: 5, effect: 0 },
    worker: { level: 0, basePrice: 200, price: 200, baseEffect: 1, effect: 0 },
    stable: { level: 0, basePrice: 5000, price: 5000, baseEffect: 20, effect: 0 }
};

// Определение достижений с прогрессом
const achievements = [
    {
        id: 'newbie',
        name: 'Новичок',
        description: 'Собери 100 монет',
        condition: () => coins >= 100,
        progress: () => Math.min(coins, 100),
        maxProgress: 100,
        reward: 50,
        completed: false
    },
    {
        id: 'farmer',
        name: 'Фермер',
        description: 'Купи 1 уровень "Ловкого работника"',
        condition: () => upgrades.worker.level >= 1,
        progress: () => upgrades.worker.level,
        maxProgress: 1,
        reward: 200,
        completed: false
    },
    {
        id: 'konami',
        name: 'Секретный код',
        description: 'Активируй код Konami',
        condition: () => konamiActivated,
        progress: () => (konamiActivated ? 1 : 0),
        maxProgress: 1,
        reward: 500,
        completed: false
    },
    {
        id: 'millionaire',
        name: 'Миллионер',
        description: 'Собери 1,000,000 монет',
        condition: () => coins >= 1000000,
        progress: () => Math.min(coins, 1000000),
        maxProgress: 1000000,
        reward: 1000,
        completed: false
    },
    {
        id: 'clicker_10',
        name: 'Начинающий кликер',
        description: 'Сделай 10 кликов',
        condition: () => clicks >= 10,
        progress: () => Math.min(clicks, 10),
        maxProgress: 10,
        reward: 20,
        completed: false
    },
    {
        id: 'clicker_100',
        name: 'Уверенный кликер',
        description: 'Сделай 100 кликов',
        condition: () => clicks >= 100,
        progress: () => Math.min(clicks, 100),
        maxProgress: 100,
        reward: 100,
        completed: false
    },
    {
        id: 'clicker_1000',
        name: 'Мастер кликов',
        description: 'Сделай 1,000 кликов',
        condition: () => clicks >= 1000,
        progress: () => Math.min(clicks, 1000),
        maxProgress: 1000,
        reward: 500,
        completed: false
    },
    {
        id: 'sickle_5',
        name: 'Мастер серпа',
        description: 'Купи 5 уровней "Острого серпа"',
        condition: () => upgrades.sickle.level >= 5,
        progress: () => upgrades.sickle.level,
        maxProgress: 5,
        reward: 300,
        completed: false
    },
    {
        id: 'shovel_3',
        name: 'Золотой копатель',
        description: 'Купи 3 уровня "Золотой лопаты"',
        condition: () => upgrades.shovel.level >= 3,
        progress: () => upgrades.shovel.level,
        maxProgress: 3,
        reward: 600,
        completed: false
    },
    {
        id: 'worker_10',
        name: 'Бригадир',
        description: 'Купи 10 уровней "Ловкого работника"',
        condition: () => upgrades.worker.level >= 10,
        progress: () => upgrades.worker.level,
        maxProgress: 10,
        reward: 800,
        completed: false
    },
    {
        id: 'stable_5',
        name: 'Владелец конюшни',
        description: 'Купи 5 уровней "Конюшни мечты"',
        condition: () => upgrades.stable.level >= 5,
        progress: () => upgrades.stable.level,
        maxProgress: 5,
        reward: 1000,
        completed: false
    },
    {
        id: 'coins_5000',
        name: 'Собиратель',
        description: 'Собери 5,000 монет',
        condition: () => coins >= 5000,
        progress: () => Math.min(coins, 5000),
        maxProgress: 5000,
        reward: 150,
        completed: false
    },
    {
        id: 'coins_50000',
        name: 'Богатей',
        description: 'Собери 50,000 монет',
        condition: () => coins >= 50000,
        progress: () => Math.min(coins, 50000),
        maxProgress: 50000,
        reward: 400,
        completed: false
    },
    {
        id: 'coins_5000000',
        name: 'Полпути к мечте',
        description: 'Собери 5,000,000 монет',
        condition: () => coins >= 5000000,
        progress: () => Math.min(coins, 5000000),
        maxProgress: 5000000,
        reward: 2000,
        completed: false
    },
    {
        id: 'passive_10',
        name: 'Пассивный доход',
        description: 'Достигни пассивного дохода 10 монет/сек',
        condition: () => passiveIncome >= 10,
        progress: () => Math.min(passiveIncome, 10),
        maxProgress: 10,
        reward: 300,
        completed: false
    },
    {
        id: 'passive_50',
        name: 'Стабильный доход',
        description: 'Достигни пассивного дохода 50 монет/сек',
        condition: () => passiveIncome >= 50,
        progress: () => Math.min(passiveIncome, 50),
        maxProgress: 50,
        reward: 700,
        completed: false
    },
    {
        id: 'passive_100',
        name: 'Магнат',
        description: 'Достигни пассивного дохода 100 монет/сек',
        condition: () => passiveIncome >= 100,
        progress: () => Math.min(passiveIncome, 100),
        maxProgress: 100,
        reward: 1500,
        completed: false
    },
    {
        id: 'click_value_10',
        name: 'Усилитель кликов',
        description: 'Достигни 10 монет за клик',
        condition: () => clickValue >= 10,
        progress: () => Math.min(clickValue, 10),
        maxProgress: 10,
        reward: 250,
        completed: false
    },
    {
        id: 'click_value_50',
        name: 'Мощный клик',
        description: 'Достигни 50 монет за клик',
        condition: () => clickValue >= 50,
        progress: () => Math.min(clickValue, 50),
        maxProgress: 50,
        reward: 800,
        completed: false
    },
    {
        id: 'upgrades_5',
        name: 'Покупатель',
        description: 'Купи 5 любых улучшений',
        condition: () => (upgrades.sickle.level + upgrades.shovel.level + upgrades.worker.level + upgrades.stable.level) >= 5,
        progress: () => Math.min(upgrades.sickle.level + upgrades.shovel.level + upgrades.worker.level + upgrades.stable.level, 5),
        maxProgress: 5,
        reward: 200,
        completed: false
    },
    {
        id: 'upgrades_20',
        name: 'Коллекционер',
        description: 'Купи 20 любых улучшений',
        condition: () => (upgrades.sickle.level + upgrades.shovel.level + upgrades.worker.level + upgrades.stable.level) >= 20,
        progress: () => Math.min(upgrades.sickle.level + upgrades.shovel.level + upgrades.worker.level + upgrades.stable.level, 20),
        maxProgress: 20,
        reward: 600,
        completed: false
    },
    {
        id: 'upgrades_50',
        name: 'Инвестор',
        description: 'Купи 50 любых улучшений',
        condition: () => (upgrades.sickle.level + upgrades.shovel.level + upgrades.worker.level + upgrades.stable.level) >= 50,
        progress: () => Math.min(upgrades.sickle.level + upgrades.shovel.level + upgrades.worker.level + upgrades.stable.level, 50),
        maxProgress: 50,
        reward: 1200,
        completed: false
    },
    {
        id: 'coins_100000',
        name: 'Сотня тысяч',
        description: 'Собери 100,000 монет',
        condition: () => coins >= 100000,
        progress: () => Math.min(coins, 100000),
        maxProgress: 100000,
        reward: 500,
        completed: false
    },
    {
        id: 'sickle_10',
        name: 'Супер серп',
        description: 'Купи 10 уровней "Острого серпа"',
        condition: () => upgrades.sickle.level >= 10,
        progress: () => upgrades.sickle.level,
        maxProgress: 10,
        reward: 600,
        completed: false
    }
];

// Получение текущего пользователя
const currentUser = localStorage.getItem('currentUser');

// Загрузка прогресса из Firestore
async function loadProgress() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const userDoc = await window.db.collection('users').doc(currentUser).get();
    if (userDoc.exists) {
        const data = userDoc.data();
        coins = data.coins || 0;
        clickValue = data.clickValue || 1;
        passiveIncome = data.passiveIncome || 0;
        horsesBought = data.horsesBought || 0;
        for (const key in upgrades) {
            if (data.upgrades && data.upgrades[key]) {
                upgrades[key].level = data.upgrades[key].level;
                upgrades[key].price = data.upgrades[key].price;
                upgrades[key].effect = data.upgrades[key].effect;
            }
        }
        if (data.achievements) {
            achievements.forEach(achievement => {
                const savedAchievement = data.achievements.find(a => a.id === achievement.id);
                if (savedAchievement) {
                    achievement.completed = savedAchievement.completed;
                }
            });
        }
    } else {
        // Если пользователь новый, создаём запись в Firestore
        await window.db.collection('users').doc(currentUser).set({
            username: currentUser,
            coins: 0,
            clickValue: 1,
            passiveIncome: 0,
            horsesBought: 0,
            upgrades: upgrades,
            achievements: achievements
        });
    }

    updateUI();
}

// Сохранение прогресса в Firestore
async function saveProgress() {
    if (!currentUser) return;

    await window.db.collection('users').doc(currentUser).set({
        username: currentUser,
        coins: coins,
        clickValue: clickValue,
        passiveIncome: passiveIncome,
        horsesBought: horsesBought,
        upgrades: upgrades,
        achievements: achievements
    }, { merge: true });
}

// Отображение достижений в модальном окне
function renderAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    achievementsList.innerHTML = '';
    achievements.forEach(achievement => {
        const card = document.createElement('div');
        card.classList.add('achievement-card', 'p-4', 'rounded', 'shadow', 'bg-gray-100');
        if (achievement.completed) {
            card.classList.add('completed');
        }
        const progress = achievement.progress();
        const maxProgress = achievement.maxProgress;
        const progressPercentage = (progress / maxProgress) * 100;
        card.innerHTML = `
            <div>
                <h3 class="font-bold">${achievement.name}</h3>
                <p class="text-sm">${achievement.description}</p>
                <p class="text-sm">Прогресс: ${progress}/${maxProgress}</p>
                <div class="achievement-progress-bar">
                    <div class="achievement-progress-bar-fill" style="width: ${progressPercentage}%"></div>
                </div>
                <p class="text-sm">Награда: ${achievement.reward} монет</p>
                <p class="text-sm font-semibold">${achievement.completed ? 'Выполнено!' : 'Не выполнено'}</p>
            </div>
        `;
        achievementsList.appendChild(card);
    });
}

// Проверка достижений
function checkAchievements() {
    achievements.forEach(achievement => {
        if (!achievement.completed && achievement.condition()) {
            achievement.completed = true;
            coins += achievement.reward;
            showAchievementNotification(achievement);
            saveProgress();
        }
    });
}

// Уведомление о выполнении достижения
function showAchievementNotification(achievement) {
    const notification = document.getElementById('achievementNotification');
    notification.textContent = `Достижение "${achievement.name}" выполнено! +${achievement.reward} монет`;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Расчёт рейтинга
function calculateRating(horsesBought, coins) {
    return (horsesBought * 1000) + coins;
}

// Отображение рейтинга из Firestore
async function renderLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboardBody');
    leaderboardBody.innerHTML = '';
    const querySnapshot = await window.db.collection('users').get();
    const users = [];
    querySnapshot.forEach(doc => {
        const user = doc.data();
        users.push({
            username: user.username,
            horsesBought: user.horsesBought || 0,
            coins: user.coins || 0
        });
    });
    users.sort((a, b) => calculateRating(b.horsesBought, b.coins) - calculateRating(a.horsesBought, a.coins));
    users.forEach(user => {
        const row = document.createElement('tr');
        const rating = calculateRating(user.horsesBought, user.coins);
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.horsesBought}</td>
            <td>${Math.floor(user.coins)}</td>
            <td>${rating}</td>
        `;
        leaderboardBody.appendChild(row);
    });
}

// Обновление интерфейса
function updateUI() {
    document.getElementById('coinCount').textContent = Math.floor(coins);
    document.getElementById('progressBar').style.width = `${Math.min((coins / goal) * 100, 100)}%`;
    document.getElementById('progressText').textContent = `${Math.floor(coins)} / ${goal}`;

    const upgradeElements = {
        sickle: { level: 'sickleLevel', effect: 'sickleEffect', price: 'sicklePrice', button: 'buySickle', card: 'sickleCard' },
        shovel: { level: 'shovelLevel', effect: 'shovelEffect', price: 'shovelPrice', button: 'buyShovel', card: 'shovelCard' },
        worker: { level: 'workerLevel', effect: 'workerEffect', price: 'workerPrice', button: 'buyWorker', card: 'workerCard' },
        stable: { level: 'stableLevel', effect: 'stableEffect', price: 'stablePrice', button: 'buyStable', card: 'stableCard' }
    };

    for (const key in upgrades) {
        const el = upgradeElements[key];
        document.getElementById(el.level).textContent = upgrades[key].level;
        document.getElementById(el.effect).textContent = upgrades[key].effect;
        document.getElementById(el.price).textContent = Math.ceil(upgrades[key].price);
        const button = document.getElementById(el.button);
        const card = document.getElementById(el.card);
        if (coins < upgrades[key].price) {
            button.disabled = true;
            card.classList.add('locked');
        } else {
            button.disabled = false;
            card.classList.remove('locked');
        }
    }

    checkAchievements();

    if (coins >= goal) {
        horsesBought++;
        document.getElementById('mainContainer').classList.add('fade-out');
        setTimeout(() => {
            window.location.href = 'win.html';
            coins = 0;
            resetUpgrades();
            saveProgress();
        }, 300);
    }
}

// Сброс улучшений и достижений
function resetUpgrades() {
    for (const key in upgrades) {
        upgrades[key].level = 0;
        upgrades[key].price = upgrades[key].basePrice;
        upgrades[key].effect = 0;
    }
    clickValue = 1;
    passiveIncome = 0;
    achievements.forEach(achievement => achievement.completed = false);
    renderAchievements();
}

// Реализация кода Konami
const konamiCode = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];
let konamiPosition = 0;

document.addEventListener('keydown', (e) => {
    const requiredKey = konamiCode[konamiPosition];
    if (e.code === requiredKey) {
        konamiPosition++;
        if (konamiPosition === konamiCode.length) {
            activateKonami();
            konamiPosition = 0;
        }
    } else {
        konamiPosition = 0;
    }
});

function activateKonami() {
    konamiActivated = true;
    const konamiMessage = document.getElementById('konamiMessage');
    konamiMessage.style.display = 'block';
    setTimeout(() => {
        konamiMessage.style.display = 'none';
    }, 3000);
    updateUI();
}

// Обработка кликов по монете
const clickArea = document.getElementById('clickArea');
clickArea.addEventListener('click', (e) => {
    coins += konamiActivated ? KONAMI_BONUS_CLICK_VALUE : clickValue;
    clicks++;
    clickArea.querySelector('img').classList.add('clicked');

    // Создание частиц
    for (let i = 0; i < 3; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        particle.style.left = `${e.offsetX}px`;
        particle.style.top = `${e.offsetY}px`;
        particle.style.setProperty('--x', `${x}px`);
        particle.style.setProperty('--y', `${y}px`);
        clickArea.appendChild(particle);
        setTimeout(() => particle.remove(), 500);
    }

    saveProgress();
    updateUI();
});

// Подсчёт CPS
setInterval(() => {
    cps = clicks - lastClicks;
    lastClicks = clicks;
    document.getElementById('cpsCount').textContent = cps;
}, 1000);

// Покупка улучшений
function buyUpgrade(upgradeKey) {
    const upgrade = upgrades[upgradeKey];
    if (coins >= upgrade.price) {
        coins -= upgrade.price;
        upgrade.level++;
        upgrade.price = upgrade.basePrice * Math.pow(1.15, upgrade.level);
        upgrade.effect = upgrade.baseEffect * upgrade.level;

        if (upgradeKey === 'sickle' || upgradeKey === 'shovel') {
            clickValue = 1 + upgrades.sickle.effect + upgrades.shovel.effect;
        } else {
            passiveIncome = upgrades.worker.effect + upgrades.stable.effect;
        }

        const card = document.getElementById(`${upgradeKey}Card`);
        card.classList.add('purchased');
        setTimeout(() => card.classList.remove('purchased'), 500);

        saveProgress();
        updateUI();
    } else {
        alert('Недостаточно монет!');
    }
}

document.getElementById('buySickle').addEventListener('click', () => buyUpgrade('sickle'));
document.getElementById('buyShovel').addEventListener('click', () => buyUpgrade('shovel'));
document.getElementById('buyWorker').addEventListener('click', () => buyUpgrade('worker'));
document.getElementById('buyStable').addEventListener('click', () => buyUpgrade('stable'));

// Пассивный доход
setInterval(() => {
    coins += passiveIncome;
    saveProgress();
    updateUI();
}, 1000);

// Выход без сброса прогресса
document.getElementById('logout').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
});

// Управление модальным окном достижений
const achievementsModal = document.getElementById('achievementsModal');
const showAchievementsBtn = document.getElementById('showAchievements');
const closeModalBtn = document.getElementById('closeModal');

showAchievementsBtn.addEventListener('click', () => {
    renderAchievements();
    achievementsModal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
    achievementsModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === achievementsModal) {
        achievementsModal.style.display = 'none';
    }
});

// Управление модальным окном рейтинга
const leaderboardModal = document.getElementById('leaderboardModal');
const showLeaderboardBtn = document.getElementById('showLeaderboard');
const closeLeaderboardModalBtn = document.getElementById('closeLeaderboardModal');

showLeaderboardBtn.addEventListener('click', () => {
    renderLeaderboard();
    leaderboardModal.style.display = 'flex';
});

closeLeaderboardModalBtn.addEventListener('click', () => {
    leaderboardModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === leaderboardModal) {
        leaderboardModal.style.display = 'none';
    }
});

// Загрузка прогресса при старте
loadProgress();