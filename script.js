// define variables
let cities = [];
let citySearchEl = document.querySelector("#searchForm");
let cityInputEl = document.querySelector("#cityInput");
let currentWeatherEl = document.querySelector("#currentWeather");
let searchedCityEl = document.querySelector("#searchedCity");
let forecastEl = document.querySelector("#forecast");
let fiveDayEl = document.querySelector("#fiveDay");
let searchHistoryEl = document.querySelector("#citySearchHistory");

// prevent refresh, trim spare spaces and alert with no input
let formSumbitHandler = function (event) {
  event.preventDefault();
  let city = cityInputEl.value.trim();
  if (city) {
    getCityWeather(city);
    get5Day(city);
    cities.unshift({ city });
    cityInputEl.value = "";
  } else {
    alert("Please try your city search again.");
  }
  saveSearch();
  pastSearch(city);
};

// save to local storage
let saveSearch = function () {
  localStorage.setItem("cities", JSON.stringify(cities));
};

let getCityWeather = function (city) {
  let apiKey = "844421298d794574c100e3409cee0499";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      displayWeather(data, city);
    });
  });
};

let displayWeather = function (weather, searchCity) {
  currentWeatherEl.textContent = "";
  searchedCityEl.textContent = searchCity;

  let currentDate = document.createElement("span");
  currentDate.textContent =
    " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
  searchedCityEl.appendChild(currentDate);

  let weatherIcon = document.createElement("img");
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  );
  searchedCityEl.appendChild(weatherIcon);

  let temperatureEl = document.createElement("span");
  temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
  temperatureEl.classList = "createLi";

  let humidityEl = document.createElement("span");
  humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
  humidityEl.classList = "createLi";

  let windSpeedEl = document.createElement("span");
  windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
  windSpeedEl.classList = "createLi";

  currentWeatherEl.appendChild(temperatureEl);

  currentWeatherEl.appendChild(humidityEl);

  currentWeatherEl.appendChild(windSpeedEl);

  let lat = weather.coord.lat;
  let lon = weather.coord.lon;
  getUvIndex(lat, lon);
};

let getUvIndex = function (lat, lon) {
  let apiKey = "c1d196b649e9f56e18848ab3da312045";
  let apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;

  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      displayUvIndex(data);
    });
  });
};

let displayUvIndex = function (index) {
  let uvIndexEl = document.createElement("div");
  uvIndexEl.textContent = "UV Index: ";
  uvIndexEl.classList = "createLi";

  uvIndexValue = document.createElement("span");
  uvIndexValue.textContent = index.value;

  if (index.value <= 2) {
    uvIndexValue.classList = "favorable";
  } else if (index.value > 2 && index.value <= 8) {
    uvIndexValue.classList = "moderate ";
  } else if (index.value > 8) {
    uvIndexValue.classList = "severe";
  }

  uvIndexEl.appendChild(uvIndexValue);

  currentWeatherEl.appendChild(uvIndexEl);
};

let get5Day = function (city) {
  let apiKey = "c1d196b649e9f56e18848ab3da312045";
  let apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      display5Day(data);
    });
  });
};

let display5Day = function (weather) {
  fiveDayEl.textContent = "";
  forecastEl.textContent = "5-Day Forecast:";

  let forecast = weather.list;
  for (let i = 5; i < forecast.length; i = i + 8) {
    let dailyForecast = forecast[i];
    let forecastEl = document.createElement("div");
    forecastEl.classList = "card bg-primary text-light m-2";
    let forecastDate = document.createElement("h5");
    forecastDate.textContent = moment
      .unix(dailyForecast.dt)
      .format("MMM D, YYYY");
    forecastDate.classList = "card-header text-center";
    forecastEl.appendChild(forecastDate);
    let weatherIcon = document.createElement("img");
    weatherIcon.classList = "card-body text-center";
    weatherIcon.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
    );

    forecastEl.appendChild(weatherIcon);
    let forecastTempEl = document.createElement("span");
    forecastTempEl.classList = "card-body text-center";
    forecastTempEl.textContent = dailyForecast.main.temp + " °F";
    forecastEl.appendChild(forecastTempEl);
    let forecastHumEl = document.createElement("span");
    forecastHumEl.classList = "card-body text-center";
    forecastHumEl.textContent = dailyForecast.main.humidity + "  %";
    forecastEl.appendChild(forecastHumEl);
    fiveDayEl.appendChild(forecastEl);
  }
};

let pastSearch = function (pastSearch) {
  pastSearchEl = document.createElement("button");
  pastSearchEl.textContent = pastSearch;
  pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
  pastSearchEl.setAttribute("dataCity", pastSearch);
  pastSearchEl.setAttribute("type", "submit");
  searchHistoryEl.prepend(pastSearchEl);
};

let pastSearchHandler = function (event) {
  let city = event.target.getAttribute("dataCity");
  if (city) {
    getCityWeather(city);
    get5Day(city);
  }
};

citySearchEl.addEventListener("submit", formSumbitHandler);
searchHistoryEl.addEventListener("click", pastSearchHandler);
