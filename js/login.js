const actionButton = document.getElementById('actionButton');
const toggleFormButton = document.getElementById('toggleForm');
const formTitle = document.getElementById('formTitle');
let isLoginMode = true;

// Проверка, что window.db доступен
if (!window.db) {
    console.error('Realtime Database не инициализирована! Проверь window.db в common.js');
    alert('Ошибка: база данных не инициализирована. Проверь консоль.');
}

// Переключение между входом и регистрацией
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

// Обработка действия (вход или регистрация)
actionButton.addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    console.log('Попытка', isLoginMode ? 'входа' : 'регистрации', 'для пользователя:', username);

    if (username === '' || password === '') {
        alert('Пожалуйста, заполните все поля!');
        return;
    }

    try {
        const userRef = window.db.ref('users/' + username);
        console.log('Проверяю существование пользователя...');
        const snapshot = await userRef.once('value');

        if (isLoginMode) {
            // Режим входа
            if (!snapshot.exists()) {
                console.log('Пользователь не найден:', username);
                alert('Пользователь не найден! Пожалуйста, зарегистрируйтесь.');
                return;
            }

            const userData = snapshot.val();
            if (userData.password !== password) {
                console.log('Неверный пароль для пользователя:', username);
                alert('Неверный пароль!');
                return;
            }

            // Успешный вход
            console.log('Успешный вход для пользователя:', username);
            localStorage.setItem('currentUser', username);
            document.getElementById('mainContainer').classList.add('fade-out');
            setTimeout(() => {
                window.location.href = 'game.html';
            }, 300);
        } else {
            // Режим регистрации
            if (snapshot.exists()) {
                console.log('Пользователь уже существует:', username);
                alert('Пользователь с таким именем уже существует! Пожалуйста, выберите другое имя.');
                return;
            }

            // Регистрация нового пользователя
            console.log('Регистрирую нового пользователя:', username);
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
                achievements: []
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
        console.error('Ошибка при работе с Realtime Database:', error);
        alert('Произошла ошибка при регистрации/входе. Проверь консоль для подробностей.');
    }
});