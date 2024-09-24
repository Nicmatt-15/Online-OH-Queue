/* Import */
import FetchWrapper from "./fetch-wrapper.js";

/* For any communication with our backend*/
const BASE_URL = "http://localhost:3000/";
const API = new FetchWrapper(BASE_URL);

/* Login/Sign-up Related Elements */
let authContainer = document.querySelector("#authContainer");
let loginContainer = document.querySelector("#loginContainer");
let signupContainer = document.querySelector("#signupContainer");
let loginForm = document.querySelector("#loginForm");
let signupForm = document.querySelector("#signupForm");
let modal = document.querySelector("#myModal");

/* Modal Related Elements */
let questionForm = document.querySelector("#questionForm");
let studentStatusContainer = document.querySelector("#studentStatusContainer");
let staffStatusContainer = document.querySelector("#staffStatusContainer");

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
    const loginStaff = document.querySelector("#loginStaff").checked;

    API.post("api/signin/", {
        loginEmail: loginEmail,
        loginPassword: loginPassword,
        loginStaff: loginStaff
    }).then(data => {
        closeAuth(data, loginEmail, loginStaff);
    });
})

function openLogin() {
    authContainer.classList.remove("hidden");
}

/* Close auth will only be used for login. Sign-up
will never trigger close auth.

We will decide whether to actually close the auth page
and open the stats page depending on the response from the
server side.
*/
function closeAuth(data, loginEmail, isStaff) {
    console.log(data); // TODO
    if (data.ok) {
        authContainer.classList.add("hidden");

        openStatus(isStaff);
        showProfileButton(loginEmail.substring(0, 1));
    } else if (data.status === 401) {
        window.alert("Sign-in failed: Incorrect password!");
        clearLoginArea();
    } else if (data.status === 404) {
        window.alert("Sign-in failed: User not found!");
        clearLoginArea();
    } else {
        window.alert("Server Error: Please Try Again Later!")
        clearLoginArea();
    }
}

function clearLoginArea() {
    const loginEmailBox = document.querySelector("#loginEmail");
    const loginPasswordBox = document.querySelector("#loginPassword");
    const loginShowPasswordCheck = document.querySelector("#loginShowPassword");
    const loginStaffCheck = document.querySelector("#loginStaff");

    loginEmailBox.value = "";
    loginPasswordBox.value = "";
    loginShowPasswordCheck.checked = false;
    loginStaffCheck.checked = false;
    loginPasswordBox.type = "password";
}

function showProfileButton(userFirstLetter) {
    profileButton.classList.remove("hidden");
    profileButtonText.textContent = userFirstLetter;
}

function openStatus(isStaff) {
    if (isStaff) {
        console.log("enter here"); // TODO
        console.log(staffStatusContainer);
        staffStatusContainer.classList.remove("hidden");
    } else {
        studentStatusContainer.classList.remove("hidden");
    }
}

function closeStatus(isStaff) {
    if (isStaff) {
        staffStatusContainer.classList.add("hidden");
    } else {
        studentStatusContainer.classList.add("hidden");
    }
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

/* This part handles verifying that the user input
email (both login and signup) is a valid email address
using regex */
let loginEmailInput = document.querySelector("#loginEmail");
let signupEmailInput = document.querySelector("#signupEmail");
let loginEmailWarning = document.querySelector(".login-email-warning");
let signupEmailWarning = document.querySelector(".signup-email-warning");

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

loginEmailInput.addEventListener("change", () => {
    const userInput = loginEmailInput.value;

    if (validateEmail(userInput)) {
        loginEmailWarning.innerHTML = "";
    } else {
        loginEmailWarning.innerHTML = "<b>Email format is invalid!<b>";
    }
});

signupEmailInput.addEventListener("change", () => {
    const userInput = signupEmailInput.value;

    if (validateEmail(userInput)) {
        signupEmailWarning.innerHTML = "";
    } else {
        signupEmailWarning.innerHTML = "<b>Email format is invalid!<b>";
    }
});

/* This part of the code handles API call for sign-up */
let signupNameForm = document.querySelector("#signupName");
let signupStudentnumForm = document.querySelector("#signupStudentnum");
let signupEmailForm = document.querySelector("#signupEmail");
let signupPasswordForm = document.querySelector("#signupPassword");

signupForm.addEventListener("submit", () => {
    event.preventDefault();

    const signupName = signupNameForm.value;
    const signupStudentnum = signupStudentnumForm.value;
    const signupEmail = signupEmailForm.value;
    const signupPassword = signupPasswordForm.value;

    API.post("api/signup/", {
        signupName: signupName,
        signupStudentnum: signupStudentnum,
        signupEmail: signupEmail,
        signupPassword: signupPassword
    }).then(data => {
        if (data.ok) {
            window.alert("Sign-up Successful: Please Check your Email!");
        } else if (data.status === 409) {
            window.alert("Sign-up Failed: User Already Existed!");
        } else {
            window.alert("Server Error: Please Try Again Later!");
        }

        clearSignupArea();
    });
});

function clearSignupArea() {
    const signupNameForm = document.querySelector("#signupName");
    const signupStudentnumForm = document.querySelector("#signupStudentnum");
    const signupEmailForm = document.querySelector("#signupEmail");
    const signupPasswordForm = document.querySelector("#signupPassword");
    const signupPasswordCheck = document.querySelector("#signupShowPassword");

    signupNameForm.value = "";
    signupStudentnumForm.value = "";
    signupEmailForm.value = "";
    signupPasswordForm.value = "";
    signupPasswordCheck.checked = false;
    signupPasswordForm.type = "password";
}

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