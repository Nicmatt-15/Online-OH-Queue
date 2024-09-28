/* Import */
import FetchWrapper from "./fetch-wrapper.js";

/* For any communication with our backend*/
const BASE_URL = "http://localhost:3000/";
const API = new FetchWrapper(BASE_URL);
let socket;

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

/* This part of the code handles displaying the auto updating
UTC time in the page header */
function updateUTCTime() {
    const now = new Date();
    const utcTime = now.toUTCString();
    document.querySelector('#utcTime').textContent = utcTime;
}

// Update the time every second
setInterval(updateUTCTime, 1000);

// Display time immediately when page loads
updateUTCTime();

/* This part of the code handles the toggling between
login and signup form*/
const loginTabButton = document.querySelector("#loginTab");
const signupTabButton = document.querySelector("#signupTab");

loginTabButton.addEventListener("click", () => {
    loginContainer.classList.remove("hidden");
    signupContainer.classList.add("hidden");
});

signupTabButton.addEventListener("click", () => {
    loginContainer.classList.add("hidden");
    signupContainer.classList.remove("hidden");
});

/* This part handles toggling of staff login */
const loginStaffCheck = document.querySelector("#loginStaff");
const loginStaffShiftStartLabel = document.querySelector(".login-staff-start-time-label");
const loginStaffShiftStartInput = document.querySelector(".login-staff-start-time");
const loginStaffShiftEndLabel = document.querySelector(".login-staff-end-time-label");
const loginStaffShiftEndInput = document.querySelector(".login-staff-end-time");
const loginStaffStartTime = document.querySelector("#loginStaffStartTime");
const loginStaffEndTime = document.querySelector("#loginStaffEndTime");

loginStaffCheck.addEventListener("click", () => {
    if (loginStaffCheck.checked) {
        loginStaffShiftStartLabel.classList.remove("hidden");
        loginStaffShiftStartInput.classList.remove("hidden");
        loginStaffShiftEndLabel.classList.remove("hidden");
        loginStaffShiftEndInput.classList.remove("hidden");

        // Make the time required input
        loginStaffStartTime.setAttribute("required", "");
        loginStaffEndTime.setAttribute("required", "");
    } else {
        loginStaffShiftStartLabel.classList.add("hidden");
        loginStaffShiftStartInput.classList.add("hidden");
        loginStaffShiftEndLabel.classList.add("hidden");
        loginStaffShiftEndInput.classList.add("hidden");

        loginStaffStartTime.removeAttribute("required");
        loginStaffEndTime.removeAttribute("required");
    }
});

/* This part of the code handles the login submission form */
loginForm.addEventListener("submit", () => {
    // Prevent the default form submission
    event.preventDefault();

    // Access form data
    const loginEmail = document.querySelector("#loginEmail").value;
    const loginPassword = document.querySelector("#loginPassword").value;
    const loginStaff = loginStaffCheck.checked;
    const loginStaffStartShiftTime = loginStaffStartTime.value;
    const loginStaffEndShiftTime = loginStaffEndTime.value;

    API.post("api/login/", {
        loginEmail: loginEmail,
        loginPassword: loginPassword,
        loginStaff: loginStaff,
        loginStaffStartShiftTime: loginStaffStartShiftTime,
        loginStaffEndShiftTime: loginStaffEndShiftTime
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

        // Initialize socket for user when user successfully logs in
        socket = io('http://localhost:3000');

        // Listen for queue updates for socket connection
        socket.on('queueUpdated', (updatedQueue) => {
            updateQueueTable(updatedQueue, isStaff);
        });

        // Listen for Available TA updates for socket connection
        socket.on('availableTAUpdated', (updatedAvailableTA) => {
            updateAvailableTATable(updatedAvailableTA, isStaff);
        });

        // Immediately emmits the user info for the backend
        // so the backend can map the user info and the socket id
        socket.emit('registerUser', loginEmail);

        // Check if the user logging in is the staff. If it is,
        // let the backend know.
        if (isStaff) {
            socket.emit('newAvailableTA', {});
        }

        // Save the user email in the local storage
        // so that we can use it as a data to send
        // when the user make request (submitting question
        // as student)
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
        window.alert("Server Error (Sign-in): Please Try Again Later!")
        clearLoginArea();
    }
}

function clearLoginArea() {
    const loginEmailBox = document.querySelector("#loginEmail");
    const loginPasswordBox = document.querySelector("#loginPassword");
    const loginShowPasswordCheck = document.querySelector("#loginShowPassword");

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
    // Load the queue first
    API.post("api/getqueue", {})
    .then(response => response.json())
    .then(data => updateQueueTable(data.queue, isStaff));

    // Load the Available TA next
    API.post("api/getavailableta", {})
    .then(response => response.json())
    .then(data => updateAvailableTATable(data.available_ta, isStaff));

    if (isStaff) {
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
            window.alert("Server Error (Sign-up): Please Try Again Later!");
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
const closeModalX = document.querySelector("#closeModalX");
function openModal() {
    modal.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
}

joinOHButton.addEventListener("click", () => {
    openModal();
});

closeModalX.addEventListener("click", () => {closeModal()});

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

        // Emit event when user joins the queue into the socket.io
        // server so other user's will get their queue updated
        socket.emit('joinQueue', localStorage.getItem("userEmail"));
    }).catch(error => {
        window.alert(`Server Error (Join Queue): Please Try Again Later!: ${error}`);
    });
});

function updateQueueTable(queueData, isStaff) {
    const queueTable = isStaff ? document.querySelector("#staffSideQueueTable") : document.querySelector("#studentSideQueueTable");

    // Make sure we empty the table first
    while (queueTable.children.length > 1) {
        queueTable.removeChild(queueTable.children[1]);
    }

    queueData.forEach(row => {
        const newTableRow = createQueueTableRow(row, isStaff);
        queueTable.appendChild(newTableRow);
    });
}

// This function is used to create
// one row of the queue table entry
function createQueueTableRow(row, isStaff) {
    const newTableRow = document.createElement("tr");
    const newTableRowData = [
        row.queue_number,
        row.student_number,
        row.student_name,
        formatTimeText(row.request_time),
        formatTimeText(row.assign_time),
        formatTimeText(row.finish_time)
    ];

    for(let i = 0; i < 6; i++) {
        const newRowCell = document.createElement("td");
        newRowCell.innerHTML = newTableRowData[i];

        newTableRow.appendChild(newRowCell);
    }

    if (isStaff) {
        const questionCell = document.createElement("td");
        const helpButtonCell = document.createElement("td");

        questionCell.textContent = row.question;
        if (row.assign_time === null) {
            helpButtonCell.innerHTML = `<button type="button" id=helpButtonQueue${row.queue_number} class="help-student-button">Help Student</button>`;
        }

        newTableRow.appendChild(questionCell);
        newTableRow.appendChild(helpButtonCell);
    }

    return newTableRow;
}

// Function to convert time from ISO 8601 format
// (the format the DB uses) to a more readable format
function formatTimeText(unformattedTime) {
    if (unformattedTime === null) {
        return ``;
    }

    let [date, time] = unformattedTime.split("T");
    time = time.slice(0, -5);

    return `${date} <br> ${time}`;
}

/* This part of the code handles updating the Available TA table */
function updateAvailableTATable(availableTAData, isStaff) {
    const availableTATable = isStaff ? document.querySelector("#staffAvailableTA") : document.querySelector("#studentAvailableTA");

    // Make sure we empty the table first
    while (availableTATable.children.length > 1) {
        availableTATable.removeChild(availableTATable.children[1]);
    }

    availableTAData.forEach(row => {
        const newTableRow = createAvailableTATableRow(row);
        availableTATable.appendChild(newTableRow);
    });

    // After building the table, make sure the action button is responsive
    // TODO
    updateHelpButtonListener();
}

function createAvailableTATableRow(row) {
    const newTableRow = document.createElement("tr");
    const newTableRowData = [
        row.staff_name,
        row.status,
        formatTimeText(row.shift_start_time),
        formatTimeText(row.shift_end_time)
    ];

    for(let i = 0; i < 4; i++) {
        const newRowCell = document.createElement("td");
        newRowCell.innerHTML = newTableRowData[i];

        newTableRow.appendChild(newRowCell);
    }

    return newTableRow;
}

/* This part of the code handles when TA decide to
help a student */
function updateHelpButtonListener() {
    const allHelpButtons = document.querySelectorAll(".help-student-button");

    allHelpButtons.forEach(currentHelpButton => {
        // Use jquery to delete any click event listener
        // on the button
        $(currentHelpButton).off("click");

        currentHelpButton.addEventListener("click", () => {
            // Get the queue number from the button id
            const queueNumber = currentHelpButton.id.substring(15);
            window.alert("Successful: You are now helping queue number " + queueNumber);
        })
    });
}
