const apiKey = "2411f19b6ce180efb8130bafb927e307"; // OpenWeatherMap API Key
const apiKey2 = "AIzaSyCgZPnzWzrrbToTL8l8az8YNFUXTOD8Buc"; // Google Maps API Key

// Elementos DOM
const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");
const cityElement = document.querySelector("#city");
const countryElement = document.querySelector("#country");
const descElement = document.querySelector("#description");
const WeatherIconElement = document.querySelector("#weather-icon");
const tempElement = document.querySelector("#temperature span");
const humidityElement = document.querySelector("#humidity span");
const windElement = document.querySelector("#wind span");
const weatherContainer = document.querySelector("#weather-data");

let map; // Variável global para armazenar o mapa
let marker; // Variável para o marcador

// Pegar dados meteorológicos da OpenWeatherMap
const getWeatherData = async (city) => {
    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;
    const res = await fetch(apiWeatherURL);
    const data = await res.json();
    return data;
};

// Exibir dados meteorológicos e inicializar o mapa
const showWeatherData = async (city) => {
    const data = await getWeatherData(city);

    if (!data) return;

    const weatherIconURL = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    cityElement.innerText = data.name;
    tempElement.innerText = parseInt(data.main.temp);
    descElement.innerText = data.weather[0].description;
    WeatherIconElement.setAttribute("src", weatherIconURL); // Usando o ícone retornado pela API
    countryElement.setAttribute("src", `https://flagsapi.com/${data.sys.country}/shiny/64.png`);
    humidityElement.innerText = `${data.main.humidity}%`;
    windElement.innerText = `${data.wind.speed} m/s`;

    // Atualizar mapa com a localização da cidade pesquisada
    updateMap(data.coord.lat, data.coord.lon, weatherIconURL);

    weatherContainer.classList.remove("hide");
};

// Inicializar mapa com a camada de nuvens da OpenWeatherMap
function initMap(lat = -23.55052, lng = -46.633308) { // Localização padrão: São Paulo
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat, lng },
        zoom: 10, // Zoom padrão ajustado
    });

    // Adicionar camada de nuvens da OpenWeatherMap
    const cloudLayer = new google.maps.ImageMapType({
        getTileUrl: function(coord, zoom) {
            return `https://tile.openweathermap.org/map/clouds_new/${zoom}/${coord.x}/${coord.y}.png?appid=${apiKey}`;
        },
        tileSize: new google.maps.Size(256, 256),
        name: 'Nuvens',
        maxZoom: 10
    });

    // Inserir a camada de nuvens no mapa
    map.overlayMapTypes.insertAt(0, cloudLayer);
}

// Atualizar o mapa com base nas coordenadas da cidade pesquisada e adicionar marcador
const updateMap = (lat, lng, weatherIconURL) => {
    // Centraliza o mapa na nova localização
    map.setCenter({ lat, lng });

    // Define o zoom
    map.setZoom(10);

    // Remove o marcador anterior, se houver
    if (marker) {
        marker.setMap(null);
    }

    // Adicionar marcador personalizado na nova localização
    marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        icon: {
            url: weatherIconURL, // Usando o ícone de clima retornado pela API
            scaledSize: new google.maps.Size(50, 50) // Ajuste o tamanho conforme necessário
        }
    });
};

// Eventos
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const city = cityInput.value;
    showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
    if (e.code === "Enter") {
        const city = e.target.value;
        showWeatherData(city);
    }
});
