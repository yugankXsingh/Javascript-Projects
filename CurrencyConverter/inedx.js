const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1";

const dropdowns = document.querySelectorAll(".dropdown select");
const button = document.querySelector("#submit-btn");
const displayConvertedAmount = document.querySelector("#converted-amount");
const displayExchangeRate = document.querySelector("#exchange-rate");

for (select of dropdowns) { // for of loop iterates over the values of an iterable object
    for (currCode in countryList) { // for in loop iterates over the keys of an object
        const newOption = document.createElement("option");
        newOption.value = currCode;
        newOption.innerText = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }

        select.append(newOption);
    }

    select.addEventListener("change", (event) => {
        updateCountryFlag(event.target);
    });
}

// update country flag
function updateCountryFlag(element) {
    // console.log(element);
    // console.log(element.value);
    // console.log(element.parentElement);
    // console.log(element.id);

    const currCode = element.value;
    const countryCode = countryList[currCode];
    console.log(countryCode);

    let countryFlag;;

    if (element.id === "selectBox1") {
        countryFlag = document.querySelector(".countryFlag1");
    } else if (element.id === "selectBox2") {
        countryFlag = document.querySelector(".countryFlag2");
    }

    countryFlag.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

button.addEventListener("click", async (event) => {
    event.preventDefault();
    updateExchangeRate();
});

const updateExchangeRate = async () => {
    let input = document.querySelector(".amount input");
    let amount = input.value;

    if (amount === "" || amount < 0) {
        amount = 1;
        input.value = 1;
    }
    // console.log(amount);

    let fromCurrency = document.querySelector("#selectBox1");
    let toCurrency = document.querySelector("#selectBox2");

    // console.log(fromCurrency.value);
    // console.log(toCurrency.value);

    const URL = `${BASE_URL}/currencies/${fromCurrency.value.toLowerCase()}.json`;
    let response = (await fetch(URL));
    let data = (await response.json());
    // console.log(data);
    let exchangeRate = data[fromCurrency.value.toLowerCase()][toCurrency.value.toLowerCase()];
    // console.log(exchangeRate.toFixed(2));

    displayExchangeRate.innerText = `1 ${fromCurrency.value} = ${exchangeRate.toFixed(3)} ${toCurrency.value}`;
    displayConvertedAmount.innerText = (amount * exchangeRate).toFixed(2) + " " + toCurrency.value;
}


window.addEventListener("load", () => {
    updateExchangeRate();
});