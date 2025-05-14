document.addEventListener('DOMContentLoaded', () => {
    const actionButton = document.getElementById('actionButton');
    const toggleFormButton = document.getElementById('toggleForm');
    const formTitle = document.getElementById('formTitle');
    let isLoginMode = true;

    if (!actionButton || !toggleFormButton || !formTitle) {
        console.error('Не удалось найти элементы формы:', { actionButton, toggleFormButton, formTitle });
        return;
    }

    if (!window.db) {
        console.error('Firestore не инициализирована! Проверь window.db в common.js');
        alert('Ошибка: база данных не инициализирована. Проверь консоль.');
        return;
    }

    toggleFormButton.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        if (isLoginMode) {
            formTitle.textContent = 'Вход';
            actionButton.textContent = 'Войти';
            toggleFormButton.textContent = 'Нет аккаунта? Зарегистрируйтесь';
        } else {
            formTitle.textContent = 'Регистрация';
            actionButton.textContent = 'Зарегистрироваться';
            toggleFormButton.textContent = 'Уже есть аккаунт? Войдите';
        }
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    });

    actionButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        console.log('Попытка', isLoginMode ? 'входа' : 'регистрации', 'для пользователя:', username);

        if (username === '' || password === '') {
            alert('Пожалуйста, заполните все поля!');
            return;
        }

        try {
            const userRef = window.db.collection('users').doc(username);
            console.log('Проверяю существование пользователя...');
            const doc = await userRef.get();
            console.log('Документ:', doc.exists ? doc.data() : 'не существует');

            if (isLoginMode) {
                if (!doc.exists) {
                    console.log('Пользователь не найден:', username);
                    alert('Пользователь не найден! Пожалуйста, зарегистрируйтесь.');
                    return;
                }

                const userData = doc.data();
                const savedPassword = String(userData.password);
                const inputPassword = String(password);
                console.log('Сохранённый пароль:', savedPassword, 'Тип:', typeof savedPassword);
                console.log('Введённый пароль:', inputPassword, 'Тип:', typeof inputPassword);
                if (savedPassword !== inputPassword) {
                    console.log('Неверный пароль для пользователя:', username);
                    alert('Неверный пароль!');
                    return;
                }

                console.log('Успешный вход для пользователя:', username);
                localStorage.setItem('currentUser', username);
                document.getElementById('mainContainer').classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = 'game.html';
                }, 300);
            } else {
                if (doc.exists) {
                    console.log('Пользователь уже существует:', username);
                    alert('Пользователь с таким именем уже существует! Пожалуйста, выберите другое имя.');
                    return;
                }

                const initialAchievements = [
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

                console.log('Регистрирую нового пользователя:', username);
                console.log('Сохраняю пароль:', password); // Добавляем отладку
                await userRef.set({
                    username: username,
                    password: password,
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
                    achievements: initialAchievements
                });

                console.log('Регистрация успешна для пользователя:', username);
                alert('Регистрация успешна! Теперь вы можете войти.');
                isLoginMode = true;
                formTitle.textContent = 'Вход';
                actionButton.textContent = 'Войти';
                toggleFormButton.textContent = 'Нет аккаунта? Зарегистрируйтесь';
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
            }
        } catch (error) {
            console.error('Ошибка при работе с Firestore:', error);
            alert('Произошла ошибка при регистрации/входе. Проверь консоль для подробностей.');
        }
    });
});
