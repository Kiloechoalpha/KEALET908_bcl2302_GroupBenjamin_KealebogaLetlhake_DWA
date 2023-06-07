const form = document.querySelector("[data-form]");
const result = document.querySelector("[data-result]");

// Starting program state
result.innerText = "NO calculation performed";

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const entries = new FormData(event.target);
  const { dividend, divider } = Object.fromEntries(entries);

  // Validation when values are missing
  if (!dividend || !divider) {
    result.innerText = "Division not performed. Both values are required in inputs. Try again";
    return;
  }

  // Providing anything that is not a number should crash the program
  if (isNaN(dividend) || isNaN(divider)) {
    console.error("Critical error: Non-numeric input provided");
    document.body.innerHTML = "<h1>Something critical went wrong. Please reload the page</h1>";
    return;
  }

  // An invalid division should log an error in the console
  if (divider < 0) {
    console.error("Invalid input provided");
    console.trace();
    result.innerText = "Division not performed. Invalid number provided. Try again";
    return;
  }

  // Dividing numbers result in a whole number
  const divisionResult = dividend / divider;
  const wholeNumber = Math.floor(divisionResult);
  result.innerText = wholeNumber;

  // Dividing numbers result in a decimal number
  if (divisionResult % 1 !== 0) {
    result.innerText = divisionResult;
  }
});