// filepath: sales-page/src/js/script.js

document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.getElementById('user-form');
    const userInput = document.getElementById('user-input');
    const registeredUsers = ['user1', 'user2', 'user3']; // Example registered users

    userForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const userName = userInput.value.trim();

        if (!isUserRegistered(userName)) {
            window.location.href = 'register.html';
        } else {
            // Proceed with form submission or other actions for registered users
            alert('Welcome back, ' + userName + '!');
        }
    });

    function isUserRegistered(userName) {
        return registeredUsers.includes(userName);
    }
});