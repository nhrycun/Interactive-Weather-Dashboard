const apiKey = '1b19ddfdac6049a61d87c4d1ee8f58c6';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
let isCelsius = true;
let currentWeatherData = null; // Store the last fetched weather data

document.getElementById('toggle-temp-btn').addEventListener('click', () =>{
        isCelsius = !isCelsius; // Toggle unit
        updateDisplayedTemperature(); // Update the display immediately

        //Update button text to show the opposite unit.
        document.getElementById('toggle-temp-btn').textContent = isCelsius ? 'Switch to °F' : 'Switch to °C';
});
document.getElementById('search-btn').addEventListener('click', () => {
        const city = document.getElementById('city-input').value;
        fetchWeatherData(city);
});

function fetchWeatherData(city){
    const units = isCelsius ? 'metric' : 'imperial'; //Choose units based on toggle
    const url = `${apiUrl}?q=${city}&appid=${apiKey}&units=${units}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            currentWeatherData = data; // Store the weather data
            updateDisplayedTemperature();// Display the weather data
        })
        .catch(error => {
            console.error('Error fetching weather data: ', error);
            document.getElementById('weather-result').innerHTML = `<p>Error fetching data</p>`;
        });
}

function displayWeatherData(data){
    if(data.cod === '404'){
        document.getElementById('weather-result').innerHTML = `<p>City not found</p>`;
        return;
    }

    const temperature = data.main.temp;
    const unitSymbol = isCelsius ? '°C' : '°F'; //Adjust sybol based on unit
    const description = data.weather[0].description;
    const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    document.getElementById('weather-result').innerHTML = `
        <h2>${data.name}</h2>
        <p>${temperature}${unitSymbol}</p>
        <p>${description}</p>
        <img src="${icon}" alt="Weather icon">
        `;
}

function updateDisplayedTemperature(){
    if(!currentWeatherData || currentWeatherData.cod === '404'){
        document.getElementById('weather-result').innerHTML = `<p>City not found</p>`
        return;
    }

    const temperature = isCelsius ? currentWeatherData.main.temp : (currentWeatherData.main.temp * 9/5)+32;
    const unitSymbol = isCelsius ? '°C' : '°F';
    const description = currentWeatherData.weather[0].description;
    const icon = `http://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}.png`;


    document.getElementById('weather-result').innerHTML = `
        <h2>${currentWeatherData.name}</h2>
        <p>${temperature.toFixed(2)}${unitSymbol}</p>
        <p>${description}</p>
        <img src="${icon}" alt="Weather icon">
        `
}