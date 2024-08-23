document.getElementById('search-btn').addEventListener('click', () => 
    {const city = document.getElementById('city-input').value;
        fetchWeatherData(city);
});

function fetchWeatherData(city){
    const url = `${apiUrl}?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
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
    const description = data.weather[0].description;
    const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    document.getElementById('weather-result').innerHTML = `
        <h2>${data.name}</h2>
        <p>${temperature}°C</p>
        <p>${description}</p>
        <img src="${icon}" alt="Weather icon">
        `;
}