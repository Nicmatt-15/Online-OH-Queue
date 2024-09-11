/* Login/Sign-up Related Elements */
let authContainer = document.querySelector("#authContainer");
let loginContainer = document.querySelector("#loginContainer");
let signupContainer = document.querySelector("#signupContainer");
let loginForm = document.querySelector("#loginForm");
let modal = document.querySelector("#myModal");

/* Modal Related Elements */
let questionForm = document.querySelector("#questionForm");
let statusContainer = document.querySelector("#statusContainer");

/* Profile Button Related Elements */
let profileButton = document.querySelector("#profileButton");
let profileButtonText = document.querySelector("#profileButton svg text");

/* This part of the code handles the toggling between
login and signup form*/
let loginTabButton = document.querySelector("#signinTab");
let signupTabButton = document.querySelector("#signupTab");

loginTabButton.addEventListener("click", () => {
    loginContainer.classList.remove("hidden");
    signupContainer.classList.add("hidden");
});

signupTabButton.addEventListener("click", () => {
    loginContainer.classList.add("hidden");
    signupContainer.classList.remove("hidden");
});


/* This part of the code handles the login submission form */
loginForm.addEventListener("submit", () => {
    // Prevent the default form submission
    event.preventDefault();

    // Access form data
    const loginEmail = document.querySelector("#loginEmail").value;
    const loginPassword = document.querySelector("#loginPassword").value;

    // Log the form data to the console (or handle it as needed)
    console.log('Form submitted!');
    console.log('Email:', loginEmail);
    console.log('Password:', loginPassword);

    closeAuth();
    openStatus();
    showProfileButton(loginEmail.substring(0, 1));
})

function openLogin() {
    authContainer.classList.remove("hidden");
}

function closeAuth() {
    authContainer.classList.add("hidden");
}

function showProfileButton(userFirstLetter) {
    profileButton.classList.remove("hidden");
    profileButtonText.textContent = userFirstLetter;
}

function openStatus() {
    statusContainer.classList.remove("hidden");
}

function closeStatus() {
    statusContainer.classList.add("hidden");
}

/* This part of the code handles the checkbox revealing
and unrevealing the password textbox */
let loginPasswordInput = document.querySelector("#loginPassword");
let signupPasswordInput = document.querySelector("#signupPassword");
let loginPasswordCheckbox = document.querySelector("#loginShowPassword");
let signupPasswordCheckbox = document.querySelector("#signupShowPassword");

loginPasswordCheckbox.addEventListener("click", () => {
    if (loginPasswordInput.type === "password") {
        loginPasswordInput.type = "text";
    } else {
        loginPasswordInput.type = "password";
    }
})

signupPasswordCheckbox.addEventListener("click", () => {
    if (signupPasswordInput.type === "password") {
        signupPasswordInput.type = "text";
    } else {
        signupPasswordInput.type = "password";
    }
})

/* This part of the code handles opening and closing modal 
when student clicks join office hour*/
let joinOHButton = document.querySelector("#openModalButton")
function openModal() {
    modal.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
}

joinOHButton.addEventListener("click", () => {
    openModal();
});


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