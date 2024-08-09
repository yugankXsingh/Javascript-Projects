const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container")
const grantAccessContainer = document.querySelector(".grant-location-container")
const searchForm = document.querySelector("[data-searchForm]")
const loadingScreen = document.querySelector(".loading-container")
const userInfoContainer = document.querySelector(".user-info-container")

const API_KEY = "0506841897285681cc01b74acd27ee3b";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getLocation(); // why this is here? because we need to get the user location as soon as the page loads to show the user weather info by default 

// hide the error container initially
const errorContainer = document.querySelector(".error-container");
errorContainer.classList.remove("active");

userTab.addEventListener("click", () => {
    switchTab(userTab); //pass the tab that was clicked
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab); //pass the tab that was clicked
});

function switchTab(clickedTab) {
    if (clickedTab != currentTab) {

        // valid condition to switch tabs
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        // We must switch tabs cuz we entered inside this if statement 
        // and if the form is not active, it means we are on "Your weather" tab currently
        // so we are sure that we are going to switch to "Search weather" tab 
        // hence we need to hide the user info container & grant Access Container and show the search form
        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        } else {
            // We are on "Search weather" tab currently
            // so we are sure that we are going to switch to "Your weather" tab 
            // hence we need to hide the search form
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            // now we entered into "Your weather" tab
            // so we need to show the current location weather
            // so let's check local storage if we have the location data
            getFromSessionStorage();
        }
    }
}

// check if cordinates are available in local storage
function getFromSessionStorage() {
    const localCordinates = sessionStorage.getItem("user-cordinates");
    if (!localCordinates) {
        // if cordinates are not available in local storage
        // then we need to ask user for the location permission
        grantAccessContainer.classList.add("active"); // show the grant access container
    } else {
        // if cordinates are available in local storage
        // then we can directly fetch the weather data
        const cordinates = JSON.parse(localCordinates);
        fetchUserWeatherInfo(cordinates);
    }
}

async function fetchUserWeatherInfo(cordinates) {
    const { latitude, longitude } = cordinates;
    // make grant access container hidden
    grantAccessContainer.classList.remove("active");
    // make loading screen visible
    loadingScreen.classList.add("active");

    // API CALL

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        // remove loading screen because we recieved the data now
        loadingScreen.classList.remove("active");
        // show the user info container
        userInfoContainer.classList.add("active");
        // update the user info container with the recieved data
        renderWeatherInfo(data);
    } catch (err) {
        // remove loading screen
        loadingScreen.classList.remove("active");
        // remove user info container
        userInfoContainer.classList.remove("active");

        // show error container
        errorContainer.classList.add("active");
        // console.log(e);
    }
}

function renderWeatherInfo(weatherInfo) {
    // find the elements to update

    // hide error container if it is visible because 
    // we recieved the data and we are going to show the user info container
    errorContainer.classList.remove("active");

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const description = document.querySelector("[data-WeatherDescription]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temperature = document.querySelector("[data-temperature]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // update the elements with the recieved data
    cityName.innerText = weatherInfo?.name;
    const countryCode = (weatherInfo?.sys?.country).toLowerCase();
    countryIcon.src = `https://flagcdn.com/80x60/${countryCode}.png`;
    description.innerText = weatherInfo?.weather[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/wn/${weatherInfo?.weather[0]?.icon}.png`;
    temperature.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

// ask for location permission
const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click", getLocation);

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const cordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }
    // save the cordinates in local storage
    sessionStorage.setItem("user-cordinates", JSON.stringify(cordinates));
    fetchUserWeatherInfo(cordinates);
}

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (searchInput.value === "") return;
    fetchSearchWeatherInfo(searchInput.value);
});

async function fetchSearchWeatherInfo(cityName) {
    // make loading screen visible
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    // API CALL
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        // remove loading screen because we recieved the data now
        console.log(data);
        loadingScreen.classList.remove("active");
        // show the user info container
        userInfoContainer.classList.add("active");
        // update the user info container with the recieved data
        renderWeatherInfo(data);
    } catch (e) {
        // remove loading screen
        loadingScreen.classList.remove("active");
        // remove user info container
        userInfoContainer.classList.remove("active");

        // show error container
        errorContainer.classList.add("active");
        // console.log(e);
    }


}