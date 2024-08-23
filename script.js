const apiKey = "1b19ddfdac6049a61d87c4d1ee8f58c6";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
let isCelsius = true;
let currentWeatherData = null; // Store the last fetched weather data
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

document.getElementById("toggle-temp-btn").addEventListener("click", () => {
  isCelsius = !isCelsius; // Toggle unit
  updateDisplayedTemperature(); // Update the display immediately

  //Update button text to show the opposite unit.
  document.getElementById("toggle-temp-btn").textContent = isCelsius
    ? "Switch to °F"
    : "Switch to °C";
});
document.getElementById("search-btn").addEventListener("click", () => {
  const city = document.getElementById("city-input").value;
  fetchWeatherData(city);
});

function fetchWeatherData(city) {
  const units = isCelsius ? "metric" : "imperial"; //Choose units based on toggle
  const currentWeatherUrl = `${apiUrl}?q=${city}&appid=${apiKey}&units=${units}`;
  const forecastWeatherUrl = `${forecastUrl}?q=${city}&appid=${apiKey}&units=${units}`;

  Promise.all([
    fetch(currentWeatherUrl).then((response) => response.json()),
    fetch(forecastWeatherUrl).then((response) => response.json()),
  ])
    .then(([currentData, forecastData]) => {
      currentWeatherData = currentData;
      updateDisplayedTemperature();
      displayForecast(forecastData);
    })
    .catch((error) => {
      console.error("Error fetching weather data: ", error);
      document.getElementById(
        "weather-result"
      ).innerHTML = `<p> Error fetching data</p>`;
    });
}

function displayWeatherData(data) {
  if (data.cod === "404") {
    document.getElementById(
      "weather-result"
    ).innerHTML = `<p>City not found</p>`;
    return;
  }

  const temperature = data.main.temp;
  const unitSymbol = isCelsius ? "°C" : "°F"; //Adjust sybol based on unit
  const description = data.weather[0].description;
  const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  document.getElementById("weather-result").innerHTML = `
        <h2>${data.name}</h2>
        <p>${temperature}${unitSymbol}</p>
        <p>${description}</p>
        <img src="${icon}" alt="Weather icon">
        `;
}

function updateDisplayedTemperature() {
  if (!currentWeatherData || currentWeatherData.cod === "404") {
    document.getElementById(
      "weather-result"
    ).innerHTML = `<p>City not found</p>`;
    return;
  }

  const temperature = isCelsius
    ? currentWeatherData.main.temp
    : (currentWeatherData.main.temp * 9) / 5 + 32;
  const unitSymbol = isCelsius ? "°C" : "°F";
  const description = currentWeatherData.weather[0].description;
  const icon = `http://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}.png`;

  document.getElementById("weather-result").innerHTML = `
        <h2>${currentWeatherData.name}</h2>
        <p>${temperature.toFixed(2)}${unitSymbol}</p>
        <p>${description}</p>
        <img src="${icon}" alt="Weather icon">
        `;
}

function displayForecast(data) {
  const forecastElement = document.getElementById("forecast-result");
  forecastElement.innerHTML = ""; // clears previous content

  // We will extrat one forecast per day at 12:00 (noon)
  const filteredData = data.list.filter((item) =>
    item.dt_txt.includes("12:00")
  );

  filteredData.forEach((day) => {
    const date = new Date(day.dt_txt).toLocaleDateString();
    const temp = isCelsius ? day.main.temp : (day.main.temp * 9) / 5 + 32;
    const unitSymbol = isCelsius ? "°C" : "°F";
    const description = day.weather[0].description;
    const icon = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

    forecastElement.innerHTML += `
        <div class="forecast-day">
                <h3>${date}</h3>
                <img src="${icon}" alt="Weather icon">
                <p>${temp.toFixed(2)}${unitSymbol}</p>
                <p>${description}</p>
            </div>
        `;
  });
}
