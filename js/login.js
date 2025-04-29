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