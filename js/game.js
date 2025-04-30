// game.js

// Начальные переменные игры
let coins = 0; // Количество монет
let horsesBought = 0; // Количество купленных лошадей
const goal = 10000000; // Цель для покупки лошади (10 миллионов монет)
let clickValue = 1; // Значение монет за клик
let passiveIncome = 0; // Пассивный доход (монеты в секунду)
let konamiActivated = false; // Флаг активации кода Konami
const KONAMI_BONUS_CLICK_VALUE = 100000; // Бонус за клик при активации кода Konami
let clicks = 0; // Общее количество кликов
let lastClicks = 0; // Количество кликов на последней проверке CPS
let cps = 0; // Скорость кликов в секунду (CPS)

// Объект с улучшениями (уровни, цены, эффекты)
const upgrades = {
    sickle: { level: 0, basePrice: 50, price: 50, baseEffect: 1, effect: 0 }, // Улучшение "Острый серп"
    shovel: { level: 0, basePrice: 1000, price: 1000, baseEffect: 5, effect: 0 }, // Улучшение "Золотая лопата"
    worker: { level: 0, basePrice: 200, price: 200, baseEffect: 1, effect: 0 }, // Улучшение "Ловкий работник"
    stable: { level: 0, basePrice: 5000, price: 5000, baseEffect: 20, effect: 0 } // Улучшение "Конюшня мечты"
};

// Определения достижений (условия, описания, награды)
const achievementDefinitions = [
    { id: 'newbie', name: 'Новичок', description: 'Собери 100 монет', condition: () => coins >= 100, progress: () => Math.min(coins, 100), maxProgress: 100, reward: 50 },
    { id: 'farmer', name: 'Фермер', description: 'Купи 1 уровень "Ловкого работника"', condition: () => upgrades.worker.level >= 1, progress: () => upgrades.worker.level, maxProgress: 1, reward: 200 },
    { id: 'konami', name: 'Секретный код', description: 'Активируй код Konami', condition: () => konamiActivated, progress: () => (konamiActivated ? 1 : 0), maxProgress: 1, reward: 500 },
    { id: 'millionaire', name: 'Миллионер', description: 'Собери 1,000,000 монет', condition: () => coins >= 1000000, progress: () => Math.min(coins, 1000000), maxProgress: 1000000, reward: 1000 },
    { id: 'clicker_10', name: 'Начинающий кликер', description: 'Сделай 10 кликов', condition: () => clicks >= 10, progress: () => Math.min(clicks, 10), maxProgress: 10, reward: 20 },
    { id: 'clicker_100', name: 'Уверенный кликер', description: 'Сделай 100 кликов', condition: () => clicks >= 100, progress: () => Math.min(clicks, 100), maxProgress: 100, reward: 100 },
    { id: 'clicker_1000', name: 'Мастер кликов', description: 'Сделай 1,000 кликов', condition: () => clicks >= 1000, progress: () => Math.min(clicks, 1000), maxProgress: 1000, reward: 500 },
    { id: 'sickle_5', name: 'Мастер серпа', description: 'Купи 5 уровней "Острого серпа"', condition: () => upgrades.sickle.level >= 5, progress: () => upgrades.sickle.level, maxProgress: 5, reward: 300 },
    { id: 'shovel_3', name: 'Золотой копатель', description: 'Купи 3 уровня "Золотой лопаты"', condition: () => upgrades.shovel.level >= 3, progress: () => upgrades.shovel.level, maxProgress: 3, reward: 600 },
    { id: 'worker_10', name: 'Бригадир', description: 'Купи 10 уровней "Ловкого работника"', condition: () => upgrades.worker.level >= 10, progress: () => upgrades.worker.level, maxProgress: 10, reward: 800 },
    { id: 'stable_5', name: 'Владелец конюшни', description: 'Купи 5 уровней "Конюшни мечты"', condition: () => upgrades.stable.level >= 5, progress: () => upgrades.stable.level, maxProgress: 5, reward: 1000 },
    { id: 'coins_5000', name: 'Собиратель', description: 'Собери 5,000 монет', condition: () => coins >= 5000, progress: () => Math.min(coins, 5000), maxProgress: 5000, reward: 150 },
    { id: 'coins_50000', name: 'Богатей', description: 'Собери 50,000 монет', condition: () => coins >= 50000, progress: () => Math.min(coins, 50000), maxProgress: 50000, reward: 400 },
    { id: 'coins_5000000', name: 'Полпути к мечте', description: 'Собери 5,000,000 монет', condition: () => coins >= 5000000, progress: () => Math.min(coins, 5000000), maxProgress: 5000000, reward: 2000 },
    { id: 'passive_10', name: 'Пассивный доход', description: 'Достигни пассивного дохода 10 монет/сек', condition: () => passiveIncome >= 10, progress: () => Math.min(passiveIncome, 10), maxProgress: 10, reward: 300 },
    { id: 'passive_50', name: 'Стабильный доход', description: 'Достигни пассивного дохода 50 монет/сек', condition: () => passiveIncome >= 50, progress: () => Math.min(passiveIncome, 50), maxProgress: 50, reward: 700 },
    { id: 'passive_100', name: 'Магнат', description: 'Достигни пассивного дохода 100 монет/сек', condition: () => passiveIncome >= 100, progress: () => Math.min(passiveIncome, 100), maxProgress: 100, reward: 1500 },
    { id: 'click_value_10', name: 'Усилитель кликов', description: 'Достигни 10 монет за клик', condition: () => clickValue >= 10, progress: () => Math.min(clickValue, 10), maxProgress: 10, reward: 250 },
    { id: 'click_value_50', name: 'Мощный клик', description: 'Достигни 50 монет за клик', condition: () => clickValue >= 50, progress: () => Math.min(clickValue, 50), maxProgress: 50, reward: 800 },
    { id: 'upgrades_5', name: 'Покупатель', description: 'Купи 5 любых улучшений', condition: () => (upgrades.sickle.level + upgrades.shovel.level + upgrades.worker.level + upgrades.stable.level) >= 5, progress: () => Math.min(upgrades.sickle.level + upgrades.shovel.level + upgrades.worker.level + upgrades.stable.level, 5), maxProgress: 5, reward: 200 },
    { id: 'upgrades_20', name: 'Коллекционер', description: 'Купи 20 любых улучшений', condition: () => (upgrades.sickle.level + upgrades.shovel.level + upgrades.worker.level + upgrades.stable.level) >= 20, progress: () => Math.min(upgrades.sickle.level + upgrades.shovel.level + upgrades.worker.level + upgrades.stable.level, 20), maxProgress: 20, reward: 600 },
    { id: 'upgrades_50', name: 'Инвестор', description: 'Купи 50 любых улучшений', condition: () => (upgrades.sickle.level + upgrades.shovel.level + upgrades.worker.level + upgrades.stable.level) >= 50, progress: () => Math.min(upgrades.sickle.level + upgrades.shovel.level + upgrades.worker.level + upgrades.stable.level, 50), maxProgress: 50, reward: 1200 },
    { id: 'coins_100000', name: 'Сотня тысяч', description: 'Собери 100,000 монет', condition: () => coins >= 100000, progress: () => Math.min(coins, 100000), maxProgress: 100000, reward: 500 },
    { id: 'sickle_10', name: 'Супер серп', description: 'Купи 10 уровней "Острого серпа"', condition: () => upgrades.sickle.level >= 10, progress: () => upgrades.sickle.level, maxProgress: 10, reward: 600 }
];

// Инициализация достижений (все изначально не выполнены)
let achievements = achievementDefinitions.map(def => ({
    id: def.id,
    completed: false
}));

// Получаем текущего пользователя из localStorage
const currentUser = localStorage.getItem('currentUser');

// Функция загрузки прогресса игрока из Firestore
async function loadProgress() {
    // Проверяем, есть ли текущий пользователь
    if (!currentUser) {
        window.location.href = 'index.html'; // Перенаправляем на главную, если пользователь не авторизован
        return;
    }

    try {
        // Запрашиваем данные пользователя из Firestore
        const userRef = window.db.collection('users').doc(currentUser);
        const doc = await userRef.get();
        if (doc.exists) {
            // Если пользователь существует, загружаем его данные
            const data = doc.data();
            coins = data.coins || 0;
            clickValue = data.clickValue || 1;
            passiveIncome = data.passiveIncome || 0;
            horsesBought = data.horsesBought || 0;
            // Загружаем уровни улучшений
            for (const key in upgrades) {
                if (data.upgrades && data.upgrades[key]) {
                    upgrades[key].level = data.upgrades[key].level;
                    upgrades[key].price = data.upgrades[key].price;
                    upgrades[key].effect = data.upgrades[key].effect;
                }
            }
            // Загружаем достижения
            if (data.achievements) {
                achievements = data.achievements.map(saved => {
                    const def = achievementDefinitions.find(def => def.id === saved.id);
                    return {
                        id: saved.id,
                        completed: saved.completed || false
                    };
                });
            }
        } else {
            // Если пользователь новый, создаём начальные данные
            await userRef.set({
                username: currentUser,
                coins: 0,
                clickValue: 1,
                passiveIncome: 0,
                horsesBought: 0,
                upgrades: upgrades,
                achievements: achievements
            });
        }
        updateUI(); // Обновляем интерфейс
    } catch (error) {
        console.error('Ошибка при загрузке прогресса:', error);
        alert('Не удалось загрузить прогресс. Проверь консоль.');
    }
}

// Функция сохранения прогресса игрока в Firestore
async function saveProgress() {
    if (!currentUser) return; // Пропускаем, если пользователь не авторизован

    try {
        // Обновляем только указанные поля, не затрагивая password
        await window.db.collection('users').doc(currentUser).update({
            coins: coins,
            clickValue: clickValue,
            passiveIncome: passiveIncome,
            horsesBought: horsesBought,
            upgrades: upgrades,
            achievements: achievements
        });
    } catch (error) {
        console.error('Ошибка при сохранении прогресса:', error);
        alert('Не удалось сохранить прогресс. Проверь консоль.');
    }
}

// Функция отображения достижений в модальном окне
function renderAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    achievementsList.innerHTML = ''; // Очищаем список
    achievements.forEach(achievement => {
        const def = achievementDefinitions.find(d => d.id === achievement.id);
        const card = document.createElement('div');
        card.classList.add('achievement-card', 'p-4', 'rounded', 'shadow', 'bg-gray-100');
        if (achievement.completed) {
            card.classList.add('completed'); // Отмечаем выполненное достижение
        }
        const progress = def.progress();
        const maxProgress = def.maxProgress;
        const progressPercentage = (progress / maxProgress) * 100;
        card.innerHTML = `
            <div>
                <h3 class="font-bold">${def.name}</h3>
                <p class="text-sm">${def.description}</p>
                <p class="text-sm">Прогресс: ${progress}/${maxProgress}</p>
                <div class="achievement-progress-bar">
                    <div class="achievement-progress-bar-fill" style="width: ${progressPercentage}%"></div>
                </div>
                <p class="text-sm">Награда: ${def.reward} монет</p>
                <p class="text-sm font-semibold">${achievement.completed ? 'Выполнено!' : 'Не выполнено'}</p>
            </div>
        `;
        achievementsList.appendChild(card);
    });
}

// Функция проверки выполнения достижений
function checkAchievements() {
    achievements.forEach(achievement => {
        if (achievement.completed) return; // Пропускаем уже выполненные достижения
        const def = achievementDefinitions.find(d => d.id === achievement.id);
        if (def.condition()) {
            // Если условие достижения выполнено
            achievement.completed = true;
            coins += def.reward; // Начисляем награду
            showAchievementNotification(def); // Показываем уведомление
            saveProgress(); // Сохраняем прогресс
        }
    });
}

// Функция отображения уведомления о выполнении достижения
function showAchievementNotification(achievement) {
    const notification = document.getElementById('achievementNotification');
    notification.textContent = `Достижение "${achievement.name}" выполнено! +${achievement.reward} монет`;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none'; // Скрываем через 3 секунды
    }, 3000);
}

// Функция расчёта рейтинга игрока для таблицы лидеров
function calculateRating(horsesBought) {
    return horsesBought; // Теперь рейтинг зависит только от количества купленных лошадей
}

// Функция отображения таблицы лидеров
async function renderLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboardBody');
    leaderboardBody.innerHTML = ''; // Очищаем таблицу
    try {
        // Запрашиваем всех пользователей из Firestore
        const snapshot = await window.db.collection('users').get();
        const users = [];
        snapshot.forEach(doc => {
            const user = doc.data();
            users.push({
                username: user.username,
                horsesBought: user.horsesBought || 0,
                coins: user.coins || 0
            });
        });
        // Сортируем пользователей по количеству купленных лошадей
        users.sort((a, b) => calculateRating(b.horsesBought) - calculateRating(a.horsesBought));
        // Отображаем пользователей в таблице с местами
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            const progressPercentage = (user.coins / goal) * 100; // Прогресс к следующему коню
            row.innerHTML = `
                <td>${index + 1}</td> <!-- Показываем место игрока -->
                <td>${user.username}</td>
                <td>${user.horsesBought}</td>
                <td>
                    <div class="w-full bg-gray-300 rounded">
                        <div class="bg-blue-500 h-4 rounded" style="width: ${progressPercentage}%"></div>
                    </div>
                </td>
            `;
            leaderboardBody.appendChild(row);
        });
    } catch (error) {
        console.error('Ошибка при загрузке рейтинга:', error);
        alert('Не удалось загрузить рейтинг. Проверь консоль.');
    }
}

// Функция обновления интерфейса игры
function updateUI() {
    // Обновляем отображение монет и прогресса
    document.getElementById('coinCount').textContent = Math.floor(coins);
    document.getElementById('progressBar').style.width = `${Math.min((coins / goal) * 100, 100)}%`;
    document.getElementById('progressText').textContent = `${Math.floor(coins)} / ${goal}`;

    // Объект для соответствия улучшений и элементов интерфейса
    const upgradeElements = {
        sickle: { level: 'sickleLevel', effect: 'sickleEffect', price: 'sicklePrice', button: 'buySickle', card: 'sickleCard' },
        shovel: { level: 'shovelLevel', effect: 'shovelEffect', price: 'shovelPrice', button: 'buyShovel', card: 'shovelCard' },
        worker: { level: 'workerLevel', effect: 'workerEffect', price: 'workerPrice', button: 'buyWorker', card: 'workerCard' },
        stable: { level: 'stableLevel', effect: 'stableEffect', price: 'stablePrice', button: 'buyStable', card: 'stableCard' }
    };

    // Обновляем информацию об улучшениях
    for (const key in upgrades) {
        const el = upgradeElements[key];
        document.getElementById(el.level).textContent = upgrades[key].level;
        document.getElementById(el.effect).textContent = upgrades[key].effect;
        document.getElementById(el.price).textContent = Math.ceil(upgrades[key].price);
        const button = document.getElementById(el.button);
        const card = document.getElementById(el.card);
        // Блокируем кнопку, если недостаточно монет
        if (coins < upgrades[key].price) {
            button.disabled = true;
            card.classList.add('locked');
        } else {
            button.disabled = false;
            card.classList.remove('locked');
        }
    }

    checkAchievements(); // Проверяем достижения

    // Проверяем, достигнута ли цель для покупки лошади
    if (coins >= goal) {
        horsesBought++; // Увеличиваем количество купленных лошадей
        saveProgress(); // Сохраняем прогресс перед перенаправлением
        document.getElementById('mainContainer').classList.add('fade-out');
        setTimeout(() => {
            window.location.href = 'win.html'; // Перенаправляем на страницу победы
        }, 300);
    }
}

// Функция сброса улучшений после покупки лошади
function resetUpgrades() {
    for (const key in upgrades) {
        upgrades[key].level = 0;
        upgrades[key].price = upgrades[key].basePrice;
        upgrades[key].effect = 0;
    }
    clickValue = 1;
    passiveIncome = 0;
    // Сбрасываем достижения
    achievements = achievementDefinitions.map(def => ({
        id: def.id,
        completed: false
    }));
    renderAchievements();
}

// Код Konami для активации бонуса
const konamiCode = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];
let konamiPosition = 0;

// Обработчик ввода кода Konami
document.addEventListener('keydown', (e) => {
    const requiredKey = konamiCode[konamiPosition];
    if (e.code === requiredKey) {
        konamiPosition++;
        if (konamiPosition === konamiCode.length) {
            activateKonami(); // Активируем бонус
            konamiPosition = 0;
        }
    } else {
        konamiPosition = 0; // Сбрасываем, если код введён неверно
    }
});

// Функция активации бонуса Konami
function activateKonami() {
    konamiActivated = true;
    const konamiMessage = document.getElementById('konamiMessage');
    konamiMessage.style.display = 'block';
    setTimeout(() => {
        konamiMessage.style.display = 'none'; // Скрываем сообщение через 3 секунды
    }, 3000);
    updateUI();
}

// Обработчик кликов по области для добычи монет
const clickArea = document.getElementById('clickArea');
clickArea.addEventListener('click', (e) => {
    // Начисляем монеты за клик (с учётом бонуса Konami)
    coins += konamiActivated ? KONAMI_BONUS_CLICK_VALUE : clickValue;
    clicks++; // Увеличиваем счётчик кликов
    clickArea.querySelector('img').classList.add('clicked'); // Анимация клика

    // Создаём частицы для визуального эффекта
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
        setTimeout(() => particle.remove(), 500); // Удаляем частицу через 500 мс
    }

    saveProgress(); // Сохраняем прогресс
    updateUI(); // Обновляем интерфейс
});

// Подсчёт CPS (кликов в секунду)
setInterval(() => {
    cps = clicks - lastClicks;
    lastClicks = clicks;
    document.getElementById('cpsCount').textContent = cps;
}, 1000);

// Функция покупки улучшения
function buyUpgrade(upgradeKey) {
    const upgrade = upgrades[upgradeKey];
    if (coins >= upgrade.price) {
        // Если хватает монет, покупаем улучшение
        coins -= upgrade.price;
        upgrade.level++;
        upgrade.price = upgrade.basePrice * Math.pow(1.15, upgrade.level); // Увеличиваем цену
        upgrade.effect = upgrade.baseEffect * upgrade.level; // Увеличиваем эффект

        // Обновляем значение клика или пассивного дохода
        if (upgradeKey === 'sickle' || upgradeKey === 'shovel') {
            clickValue = 1 + upgrades.sickle.effect + upgrades.shovel.effect;
        } else {
            passiveIncome = upgrades.worker.effect + upgrades.stable.effect;
        }

        // Добавляем визуальный эффект покупки
        const card = document.getElementById(`${upgradeKey}Card`);
        card.classList.add('purchased');
        setTimeout(() => card.classList.remove('purchased'), 500);

        saveProgress(); // Сохраняем прогресс
        updateUI(); // Обновляем интерфейс
    } else {
        alert('Недостаточно монет!');
    }
}

// Привязываем обработчики к кнопкам покупки улучшений
document.getElementById('buySickle').addEventListener('click', () => buyUpgrade('sickle'));
document.getElementById('buyShovel').addEventListener('click', () => buyUpgrade('shovel'));
document.getElementById('buyWorker').addEventListener('click', () => buyUpgrade('worker'));
document.getElementById('buyStable').addEventListener('click', () => buyUpgrade('stable'));

// Таймер для начисления пассивного дохода (каждую секунду)
setInterval(() => {
    coins += passiveIncome;
    saveProgress();
    updateUI();
}, 1000);

// Обработчик выхода из аккаунта
document.getElementById('logout').addEventListener('click', (e) => {
    e.preventDefault();
    logout(); // Вызываем функцию выхода
});

// Управление модальным окном достижений
const achievementsModal = document.getElementById('achievementsModal');
const showAchievementsBtn = document.getElementById('showAchievements');
const closeModalBtn = document.getElementById('closeModal');

showAchievementsBtn.addEventListener('click', () => {
    renderAchievements();
    achievementsModal.style.display = 'flex'; // Показываем модальное окно
});

closeModalBtn.addEventListener('click', () => {
    achievementsModal.style.display = 'none'; // Скрываем модальное окно
});

window.addEventListener('click', (e) => {
    if (e.target === achievementsModal) {
        achievementsModal.style.display = 'none'; // Скрываем при клике вне окна
    }
});

// Управление модальным окном таблицы лидеров
const leaderboardModal = document.getElementById('leaderboardModal');
const showLeaderboardBtn = document.getElementById('showLeaderboard');
const closeLeaderboardModalBtn = document.getElementById('closeLeaderboardModal');

showLeaderboardBtn.addEventListener('click', () => {
    renderLeaderboard();
    leaderboardModal.style.display = 'flex'; // Показываем модальное окно
});

closeLeaderboardModalBtn.addEventListener('click', () => {
    leaderboardModal.style.display = 'none'; // Скрываем модальное окно
});

window.addEventListener('click', (e) => {
    if (e.target === leaderboardModal) {
        leaderboardModal.style.display = 'none'; // Скрываем при клике вне окна
    }
});

// Загружаем прогресс при запуске игры
loadProgress();