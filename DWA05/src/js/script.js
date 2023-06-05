

const form = document.querySelector("[data-form]");
const result = document.querySelector("[data-result]");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const entries = new FormData(event.target);
  const { dividend, divider } = Object.fromEntries(entries);
  result.innerText = dividend / divider;
});



//Scenario: Validation when values are missing

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const entries = new FormData(event.target);
  const { dividend, divider } = Object.fromEntries(entries);

  if (!dividend || !divider) {
    result.innerText = "Division not performed. Both values are required in inputs. Try again";
    return;
  }

  const divisionResult = dividend / divider;
  const wholeNumber = Math.floor(divisionResult);
  result.innerText = wholeNumber;
});

//Scenario: An invalid division should log an error in the console


form.addEventListener("submit", (event) => {
  event.preventDefault();
  const entries = new FormData(event.target);
  const { dividend, divider } = Object.fromEntries(entries);

  if (!dividend || !divider) {
    result.innerText = "Division not performed. Both values are required in inputs. Try again";
    return;
  }

  if ( divider < 0) {
    result.innerText = "Something critical went wrong. Please reload the page";
    console.error("Invalid input provided");
    console.trace();
    document.body.innerHTML = "<h1>Division not performed. Invalid number provided. Try again</h1>";
    return;
  }

  const divisionResult = dividend / divider;
  const wholeNumber = Math.floor(divisionResult);
  result.innerText = wholeNumber;
});

//Scenario: Providing anything that is not a number should crash the program

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const entries = new FormData(event.target);
  const { dividend, divider } = Object.fromEntries(entries);

  if (isNaN(dividend) || isNaN(divider)) {
    console.error("Critical error: Non-numeric input provided");
    document.body.innerHTML = "<h1>Something critical went wrong. Please reload the page</h1>";
    return;
  }

  const divisionResult = dividend / divider;
  const wholeNumber = Math.floor(divisionResult);
  const result = document.querySelector("[data-result]");
  result.innerText = wholeNumber;
});