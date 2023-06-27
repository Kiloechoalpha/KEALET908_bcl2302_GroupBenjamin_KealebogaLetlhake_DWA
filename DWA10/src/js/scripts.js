const MAX_NUMBER = 15;
const MIN_NUMBER = -5;
const STEP_AMOUNT = 1;

const number = document.querySelector('[data-key="number"]')
const subtract = document.querySelector('[data-key="subtract"]')
const add = document.querySelector('[data-key="add"]')
const reset = document.querySelector('[data-key="reset"]');

const subtractHandler = () => {
    const newValue = parseInt(number.value) - STEP_AMOUNT;
   number.value = newValue;

   if (add.disabled === true) {
    add.disabled = false;
   }

   if (newValue <= MIN_NUMBER) {
    subtract.disabled = true;
   }
};

const addHandler = () => {
    const newValue = parseInt(number.value) + STEP_AMOUNT;
    number.value = newValue;

    if (subtract.disabled === true) {
        subtract.disabled = false;
    }

    if(newValue >=MAX_NUMBER) {
        add.disabled = true;
        }
       
};
//added a handleReset button to reset tally count to 0
const handleReset = () => {
    number.value = 0;
    subtract.disabled = false;
    add.disabled = false;
    //added alert message for when the reset button has been clicked
    window.alert("Counter is resetting back to 0")
};

subtract.addEventListener('click', subtractHandler);
add.addEventListener('click',  addHandler);
reset.addEventListener('click', handleReset);