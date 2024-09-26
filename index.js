/* Import */
import FetchWrapper from "./fetch-wrapper.js";

/* For any communication with our backend*/
const BASE_URL = "http://localhost:3000/";
const API = new FetchWrapper(BASE_URL);

/* Login/Sign-up Related Elements */
const authContainer = document.querySelector("#authContainer");
const loginContainer = document.querySelector("#loginContainer");
const signupContainer = document.querySelector("#signupContainer");
const loginForm = document.querySelector("#loginForm");
const signupForm = document.querySelector("#signupForm");
const modal = document.querySelector("#myModal");

/* Status Page Related Elements */
const studentStatusContainer = document.querySelector("#studentStatusContainer");
const staffStatusContainer = document.querySelector("#staffStatusContainer");

/* Profile Button Related Elements */
const profileButton = document.querySelector("#profileButton");
const profileButtonText = document.querySelector("#profileButton svg text");

/* This part of the code handles the toggling between
login and signup form*/
const loginTabButton = document.querySelector("#signinTab");
const signupTabButton = document.querySelector("#signupTab");

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
    }).then(response => {
        closeAuth(response, loginEmail, loginStaff);
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
function closeAuth(response, loginEmail, isStaff) {
    if (response.ok) {
        authContainer.classList.add("hidden");

        // Save the user email and staff/student status in the local storage
        // so that we can use it as a data to send
        // when the user make request (submitting question
        // as student or helping student as staff)
        localStorage.setItem("userEmail", loginEmail);

        openStatus(isStaff);
        showProfileButton(loginEmail.substring(0, 1));
    } else if (response.status === 401) {
        window.alert("Sign-in failed: Incorrect password!");
        clearLoginArea();
    } else if (response.status === 404) {
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
        // TODO: Load queue for staff version

        staffStatusContainer.classList.remove("hidden");
    } else {
        // Load the queue first (student version)
        API.post("api/getqueue", {})
        .then(response => response.json())
        .then(data => updateQueueTable(data.queue));

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
const loginPasswordInput = document.querySelector("#loginPassword");
const signupPasswordInput = document.querySelector("#signupPassword");
const loginPasswordCheckbox = document.querySelector("#loginShowPassword");
const signupPasswordCheckbox = document.querySelector("#signupShowPassword");

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
const loginEmailInput = document.querySelector("#loginEmail");
const signupEmailInput = document.querySelector("#signupEmail");
const loginEmailWarning = document.querySelector(".login-email-warning");
const signupEmailWarning = document.querySelector(".signup-email-warning");

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
const signupNameForm = document.querySelector("#signupName");
const signupStudentnumForm = document.querySelector("#signupStudentnum");
const signupEmailForm = document.querySelector("#signupEmail");
const signupPasswordForm = document.querySelector("#signupPassword");

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
    }).then(response => {
        if (response.ok) {
            window.alert("Sign-up Successful: Please Check your Email!");
        } else if (response.status === 409) {
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
const joinOHButton = document.querySelector("#openModalButton")
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

/*
This code is for dark mode and light mode
*/
const darkModeButton = document.querySelector("#darkModeButton");
const lightModeButton = document.querySelector("#lightModeButton");

darkModeButton.addEventListener("click", () => {
    console.log("hey");
    document.body.classList.add("darkmode");
});

lightModeButton.addEventListener("click", () => {
    document.body.classList.remove("darkmode");
});

/*
This code is related to student submitting their
question and sending that data to the backend
*/
const studentJoinForm = document.querySelector("#studentJoinForm");
const studentQuestionContent = document.querySelector("#questionContent");

studentJoinForm.addEventListener("submit", () => {
    event.preventDefault();

    const studentQuestion = studentQuestionContent.value;

    closeModal();

    API.post("api/joinqueue/", {
        userEmail: localStorage.getItem("userEmail"),
        studentQuestion: studentQuestion
    }).then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Server Error');
        }
    }).then(data => {
        window.alert("Question submitted: You are now enrolled in the queue");
        updateQueueTable(data.queue);
    }).catch(error => {
        window.alert("Server Error: Please Try Again Later!");
    });
});

function updateQueueTable(queueData) {
    const studentSideQueueTable = document.querySelector("#studentSideQueueTable");

    queueData.forEach(row => {
        const newTableRow = createQueueTableRow(row);
        studentSideQueueTable.appendChild(newTableRow);
    });
}

// This function is used to create
// one row of the queue table entry
function createQueueTableRow(row) {
    const newTableRow = document.createElement("tr");
    const newTableRowData = [
        row.queue_number,
        row.student_number,
        row.student_name,
        row.request_time,
        row.assign_time,
        row.finish_time
    ];

    console.log(row);

    for(let i = 0; i < 6; i++) {
        const newRowCell = document.createElement("td");
        newRowCell.textContent = newTableRowData[i];

        newTableRow.appendChild(newRowCell);
    }

    return newTableRow;
}