const passwordDisplay = document.querySelector("[data-PasswordDisplay]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const copyButton = document.querySelector("[data-copyButton]")
const copyMessage = document.querySelector("[data-copyMessage]");
const inputSlider = document.querySelector("[data-lengthSlider]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowrcaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-strengthIndicator]");
const generateButton = document.querySelector("[data-generateButton]");
const allCheckboxes = document.querySelectorAll("input[type=checkbox]"); // Select all checkboxes

const symbolstring = "!@#$%^&*()_+{}|:<>?~`-=[]\;',./";

let password = ""; // Password string 
let passwordLength = 10 // Default password length
let checkCount = 0; // initally one checkbox is checked
handleSlider(); // Call the function to display the default password length

function handleSlider() {
    lengthDisplay.innerHTML = passwordLength;

    // Set the background size of the slider
    // The formula is (value - min) * 100 / (max - min) + "% 100%"
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}

// setIndicator("grey"); // Set the default color of the indicator

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
    return (Math.floor(Math.random() * (max - min)) + min);
}

function generateRandomNumber() {
    return getRandomInteger(0, 9);
}

function generateLowercase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUppperrcase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
    const rndIndex = getRandomInteger(0, symbolstring.length - 1);
    return symbolstring.charAt(rndIndex);
}

function strengthCalculator() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowrcaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        password >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyPassword() {
    console.log("copy password function called");
    try {
        await navigator.clipboard.writeText(password);
        copyMessage.innerHTML = "copied";
        // console.log("Password copied");
    } catch (err) {
        console.error("Failed to copy", err);
    }

    copyMessage.classList.add("active");
    setTimeout(() => {
        copyMessage.classList.remove("active");
    }, 2000);
}

function generatePassword() {
    password = ""; // clear the password becasue it will retain the value of previous password

    // create an array of functions to call
    let functionsArray = [];

    if (uppercaseCheck.checked)
        functionsArray.push(generateUppperrcase);

    if (lowrcaseCheck.checked)
        functionsArray.push(generateLowercase);

    if (numbersCheck.checked)
        functionsArray.push(generateRandomNumber);

    if (symbolsCheck.checked)
        functionsArray.push(generateSymbol);


    // do the compulsory additions
    for (let i = 0; i < functionsArray.length; i++) {
        password += functionsArray[i]();
    }

    console.log("compulsory addition done");

    // randomly call the funtions to fil remaining password length
    for (let i = 0; i < passwordLength - functionsArray.length; i++) {
        const rndIndex = getRandomInteger(0, functionsArray.length);
        console.log("rndIndex" + rndIndex);
        password += functionsArray[rndIndex]();
    }

    console.log("remaining addition done");

    // shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("shuffling done");
    return password;
}

function shufflePassword(passwordArray) {
    for (let i = passwordArray.length - 1; i > 0; i--) {
        // generate a random index
        const j = Math.floor(Math.random() * i);
        // swap the elements
        const temp = passwordArray[i];
        passwordArray[i] = passwordArray[j];
        passwordArray[j] = temp;
    }
    return passwordArray.join(""); // converts the array to string
}


// adding event listeners

inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyButton.addEventListener("click", () => {
    if (password === "") return;
    copyPassword();
});

function handleCheckboxChange() {
    checkCount = 0;
    allCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    // special condition
    if (checkCount > passwordLength) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckboxChange);
});

generateButton.addEventListener("click", () => {

    if (checkCount == 0) { // If no checkbox is checked
        alert("Please select atleast one option");
        return;
    }

    if (checkCount > passwordLength) {
        passwordLength = checkCount;
        handleSlider();
    }

    console.log("Generate button clicked");

    password = generatePassword();
    passwordDisplay.value = password; // Display the password
    console.log("Password generated");
    handleSlider(); // Update the slider
    strengthCalculator(); // Calculate the strength of the generated password
});
