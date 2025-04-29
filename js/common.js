// Инициализация Firebase
const firebaseConfig = {
    apiKey: "твой-apiKey",
    authDomain: "твой-authDomain",
    projectId: "твой-projectId",
    storageBucket: "твой-storageBucket",
    messagingSenderId: "твой-messagingSenderId",
    appId: "твой-appId"
};

// Инициализация приложения Firebase
firebase.initializeApp(firebaseConfig);

// Инициализация Realtime Database
window.db = firebase.database();

// Функция выхода
function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('mainContainer').classList.add('fade-out');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 300);
}