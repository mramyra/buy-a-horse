// Инициализация Firebase
const firebaseConfig = {
    apiKey: "твой-apiKey",
    authDomain: "твой-authDomain",
    projectId: "buy-a-horse",
    storageBucket: "твой-storageBucket",
    messagingSenderId: "твой-messagingSenderId",
    appId: "твой-appId",
    databaseURL: "https://buy-a-horse-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Проверка, что firebase доступен
if (typeof firebase === 'undefined') {
    console.error('Firebase SDK не загружен! Проверь подключение в HTML.');
    throw new Error('Firebase SDK не загружен');
}

console.log('Инициализация Firebase...');
// Инициализация приложения Firebase
firebase.initializeApp(firebaseConfig);

// Инициализация Realtime Database
window.db = firebase.database();
console.log('Realtime Database инициализирована:', window.db);

// Функция выхода
function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('mainContainer').classList.add('fade-out');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 300);
}