let loginContainer = document.querySelector("#loginContainer");
let loginForm = document.querySelector("#loginForm");
let modal = document.querySelector("#myModal");
let questionForm = document.querySelector("#questionForm");
let statusContainer = document.querySelector("#statusContainer");

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
})

function openLogin() {
    loginContainer.style.display = 'block';
}

function closeLogin() {
    loginContainer.style.display = 'none';
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