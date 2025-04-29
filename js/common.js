// Инициализация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCBOyWk1YDcD_06SUrgj17HzoX44wp6-8I",
    authDomain: "buy-a-horse.firebaseapp.com",
    databaseURL: "https://buy-a-horse-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "buy-a-horse",
    storageBucket: "buy-a-horse.firebasestorage.app",
    messagingSenderId: "870680949016",
    appId: "1:870680949016:web:4bfdfe73d68fc5dd036e6d",
    measurementId: "G-CJ23QK2RE9"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Экспортируем db как глобальную переменную
window.db = db;

// Функция для выхода
function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('mainContainer').classList.add('fade-out');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 300);
}