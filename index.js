/* Login Related Elements */
let loginContainer = document.querySelector("#loginContainer");
let loginForm = document.querySelector("#loginForm");
let modal = document.querySelector("#myModal");

/* Modal Related Elements */
let questionForm = document.querySelector("#questionForm");
let statusContainer = document.querySelector("#statusContainer");

/* Profile Button Related Elements */
let profileButton = document.querySelector("#profileButton");
let profileButtonText = document.querySelector("#profileButton svg text");

/* This part of the code handles the login submission form */
loginForm.addEventListener("submit", () => {
    // Prevent the default form submission
    event.preventDefault();

    // Access form data
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    // Log the form data to the console (or handle it as needed)
    console.log('Form submitted!');
    console.log('Username:', username);
    console.log('Password:', password);

    closeLogin();
    openStatus();
    showProfileButton(username.substring(0, 1));
})

function openLogin() {
    loginContainer.style.display = 'block';
}

function closeLogin() {
    loginContainer.style.display = 'none';
}

function showProfileButton(userFirstLetter) {
    profileButton.removeAttribute("hidden");
    profileButtonText.textContent = userFirstLetter;
}

function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

function openStatus() {
    statusContainer.style.display = 'block';
}

function closeStatus() {
    statusContainer.style.display = 'none';
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    if (event.target == document.getElementById('myModal')) {
        document.getElementById('usmyModal').style.display = 'none';
    }
}

questionForm.addEventListener("submit", () => {
    // Prevent the default form submission
    event.preventDefault();

    // Access form data
    const studentClass = document.querySelector("#class").value;
    const questionType = document.querySelector("#questionType").value;
    const questionContent = document.querySelector("#questionContent").value;

    // Log the form data to the console (or handle it as needed)
    console.log('Form submitted!');
    console.log('Student class:', studentClass);
    console.log('Question Type:', questionType);
    console.log('Question Content:', questionContent);

    closeModal();
    openStatus();
})

/*
This code is for dark mode and light mode
*/
let darkModeButton = document.querySelector("#darkModeButton");
let lightModeButton = document.querySelector("#lightModeButton");

darkModeButton.addEventListener("click", () => {
    console.log("hey");
    document.body.classList.add("darkmode");
});

lightModeButton.addEventListener("click", () => {
    document.body.classList.remove("darkmode");
});