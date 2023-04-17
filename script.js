const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay = document.querySelector("[data-length-number]");
const indicator = document.querySelector("[data-indicator]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copy-msg]");
const passwordDisplay = document.querySelector("[data-password-display]");
const uppercaseCheck = document.querySelector("#upperCheck");
const lowercaseCheck = document.querySelector("#lowerCheck");
const numbersCheck = document.querySelector("#numberCheck");
const symbolsCheck = document.querySelector("#symbolCheck");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const generateBtn = document.querySelector(".generate-button");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
// =================================================================================
// set default value
let password = "";
let passwordLength = 10;
uppercaseCheck.checked = true;
let checkCount = 1;
handleSlider();

// It will set the value of inputslider and lengthdisplay
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;

  // slider effect
  const min  = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ((passwordLength)*5) + "% 100%";
}

// It will set the value of inputslider and lengthdisplay by scrolling left right input
inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

//It will change the color of indicator
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// ===========================================================================
// It will provide randomValue
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// fIt will generate randomNumber
function generateNumber() {
  return getRndInteger(0, 9);
}

// fIt will generate randomLowerCase Value
function generateLowerCase() {
  return String.fromCharCode(getRndInteger(98, 123));
}

// fIt will generate randomUpperCase Value
function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

// fIt will generate randomSymbol Value
function generateSymbol() {
  const rndNum = getRndInteger(0, symbols.length);
  return symbols.charAt(rndNum);
}

// It will define which password is strong or not
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

// copy function
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  //to make copy wala span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
    copyMsg.innerHTML = "";
  }, 2000);
}

// it will shuffle the password
function shufflePassword(array) {
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

// It will count how many checkboxes are checked
function handleCheckBoxChange() {
   checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  //special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

// it will fire handleCheckBoxChange if any change happend
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});
// it will fire copy function
copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});
// =============================================================================
// generate password btn
generateBtn.addEventListener("click", () => {

  //none of the checkbox are selected
  if (checkCount == 0) {
    return;
  }

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  //remove old password
  password = "";
  
  // store first four password function
  let funcArr = [];

  if (uppercaseCheck.checked) funcArr.push(generateUpperCase);

  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);

  if (numbersCheck.checked) funcArr.push(generateNumber);

  if (symbolsCheck.checked) funcArr.push(generateSymbol);

  //compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  //remaining adddition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }
  //shuffle the password
  password = shufflePassword(Array.from(password));
  //show in UI
  passwordDisplay.value = password;
  //calculate strength
  calcStrength();
});
