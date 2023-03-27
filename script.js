const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copymsg = document.querySelector("[data-copymsg]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const copyBtn = document.querySelector("[data-copy]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initially
let password = "";
let passwordLength = 15; 
let checkcount = 0;
setIndicator("#ccc");
handleSlider();

// just to reflect passwordlength and slider on UI
function handleSlider() 
{  
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength; 
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max-min)) + "%100%"
}

function setIndicator(color) 
{
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max) 
{
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber() 
{
    return getRndInteger(0,9);
}

function generateLowerCase() 
{
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase() 
{
    return String.fromCharCode(getRndInteger(65,90));
}

function generateSymbol() 
{
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() 
{
    let hasUpper = false;
    let hasLower= false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8)
    {
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6)
    {
        setIndicator("#ff0");
    }
    else
    {
        setIndicator("#f00");
    } 
}

async function copyContent() 
{
    try
    {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copymsg.innerText = "Coppied";
    }
    catch(e)
    {
        copymsg.innerText = "Failed";
    }
    copymsg.classList.add("active");

    setTimeout( () => {
        copymsg.classList.remove("active");
    },2000);
}

function shufflePassword(array) 
{
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        //for swapping
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange()
{
    checkcount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
        {
            checkcount++;
        }
    });

    // special condition
    if(passwordLength < checkcount)
    {
        passwordLength = checkcount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})
 
copyBtn.addEventListener('click' , () => {
    if(passwordDisplay.value)
    {
        copyContent();
    }
})

generateBtn.addEventListener('click' , () => {
    // none of the checkboxes are selected
    if(checkcount == 0)
    {
        return;
    }

    //special condition
    if(passwordLength < checkcount)
    {
        passwordLength = checkcount;
        handleSlider();
    }

    // remove the old password
    password = "";

    // lets put the stuff as mentioned by checkboxes

    

    let funcarr = [];

    if(uppercaseCheck.checked)
    {
        funcarr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked)
    {
        funcarr.push(generateLowerCase);
    }
    if(numbersCheck.checked)
    {
        funcarr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked)
    {
        funcarr.push(generateSymbol);
    }

    //compulsory addition in password (checked checkboxes)
    for(let i=0;i<funcarr.length;i++)
    {
        password += funcarr[i]();
    }

    //remaining addition:
    //example - it means if password length has value 10 and there 
    //are only 2 checkcboxes checked then we have to add any random numbers from those checked boxes;
    for(let i=0;i<passwordLength - funcarr.length;i++)
    {
        let randindex = getRndInteger(0 , funcarr.length);
        password += funcarr[randindex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;

    //calculate strength
    calcStrength();
});
