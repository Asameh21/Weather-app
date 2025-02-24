// DOM Elements
let flagImg = document.querySelector(".country-name img");
let backgroundImages = Array.from(document.querySelectorAll(".background-images img"));
let loadingPage = document.querySelector(".loading-page");
let home = document.getElementById("home-page");
let input = document.querySelector("form input");
let placeHolder = document.querySelector(".place-h");
let Dayscards = Array.from(document.querySelectorAll(".d-cards"));
let daysNames = Array.from(document.querySelectorAll(".day-name"));
let icons = Array.from(document.querySelectorAll(".day-cards img"));
let maxTemp = Array.from(document.querySelectorAll(".day-temp .max-temp"));
let minTemp = Array.from(document.querySelectorAll(".day-temp .min-temp"));
let country = document.querySelector("header .country-name p");
let cityName = document.querySelector("header .country-name span");
let dayTime = document.querySelector(".day-time");
let sunrise = document.querySelector(".s-rise span");
let sunset = document.querySelector(".s-set span");
let pressure = document.querySelector(".press span");
let humidity = document.querySelector(".humidity span");
var ctx = document.getElementById("chanceOfRainChart").getContext("2d");
let progressCircle = document.querySelector(".progress-circle");
let progressText = document.querySelector(".progress-text");
let progressCircleTwo = document.querySelector(".progress-circle-two");
let progressTextTwo = document.querySelector(".progress-text-two");
let button = document.querySelector("button");

// Chart Initialization
var chanceOfRainChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Chance Of Rain",
        data: [],
        backgroundColor: "transparent",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ],
  },
  options: {
    scales: {
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 1)",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        title: {
          display: true,
          text: "Days",
          color: "rgba(54, 162, 235, 1)",
          font: {
            size: 16,
            weight: "bold",
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "rgba(75, 192, 192, 1)",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        title: {
          display: true,
          text: "Chance Of Rain (%)",
          color: "rgba(75, 192, 192, 1)",
          font: {
            size: 16,
            weight: "bold",
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "rgba(75, 192, 192, 1)",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
  },
});

// Fetch Weather Data
async function getWeather(city) {
  try {
    let firstResult = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=90a31f2dc638433db7a111805241106&q=${city}&days=7`
    );
    let secondResult = await firstResult.json();
    finalResult = secondResult;
    console.log(finalResult);
    displayBackGrounds();
    clear(finalResult);
    display();
    // Fetch country flag after weather data is fetched
    getCountryFlag(finalResult.location.country);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Fetch Country Flag
async function getCountryFlag(countryName) {
  try {
    let response = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );
    let countryData = await response.json();
    let flag = countryData[0].flags.png;
    flagImg.src = flag;
  } catch (error) {
    console.error("Error fetching country data:", error);
  }
}

// Clear Chart Data
function clear(finalResult) {
  chanceOfRainChart.data.datasets[0].data = [];
  chanceOfRainChart.data.labels = [];

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let date = new Date();

  for (let i = 0; i < finalResult.forecast.forecastday.length; i++) {
    let dayIndex = (date.getDay() + i) % 7;
    chanceOfRainChart.data.labels.push(weekday[dayIndex].slice(0, 3));
    chanceOfRainChart.data.datasets[0].data.push(
      finalResult.forecast.forecastday[i].day.daily_chance_of_rain
    );
  }

  chanceOfRainChart.update();
}

// Handle Input Changes
input.addEventListener("input", () => {
  if (input.value.length !== 0) {
    placeHolder.classList.add("d-none");
    placeHolder.classList.remove("d-block");
  } else {
    placeHolder.classList.remove("d-none");
    placeHolder.classList.add("d-block");
  }
  if (/^[a-zA-Z\s]+$/.test(input.value) && input.value.length >= 3) {
    getWeather(input.value);
  }
});

// Display Weather Data
function display() {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let date = new Date();

  for (let i = 0; i < daysNames.length; i++) {
    let dayIndex = (date.getDay() + i) % 7;
    daysNames[i].innerHTML = weekday[dayIndex].slice(0, 3);
    icons[i].setAttribute(
      "src",
      `https:${finalResult.forecast.forecastday[i].day.condition.icon}`
    );
    maxTemp[i].innerHTML = `${finalResult.forecast.forecastday[i].day.maxtemp_c}&deg;`;
    minTemp[i].innerHTML = `${finalResult.forecast.forecastday[i].day.mintemp_c}&deg;`;
  }

  country.innerHTML = finalResult.location.country;
  if (finalResult.location.region) {
    cityName.innerHTML = `, ${finalResult.location.region}`;
  } else {
    cityName.innerHTML = "";
  }

  let hours = date.getHours();
  let minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  let meridiem = hours >= 12 ? "PM" : "AM";
  const progress = finalResult.forecast.forecastday[0].hour[0].humidity;

  const radius = progressCircle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  if (progress > 50 && progress < 90) {
    progressCircle.style.cssText = "stroke: #afac4c;";
  } else if (progress >= 90) {
    progressCircle.style.cssText = "stroke: #c51010;";
  } else {
    progressCircle.style.cssText = "stroke: #4caf50;";
  }

  progressCircle.style.strokeDasharray = `${circumference}`;
  progressCircle.style.strokeDashoffset = `${offset}`;
  progressText.innerHTML = `${progress}%`;

  const progressTow = finalResult.forecast.forecastday[0].hour[0].cloud;
  if (progressTow > 50 && progressTow < 90) {
    progressCircleTwo.style.cssText = "stroke: #afac4c;";
  } else if (progressTow >= 90) {
    progressCircleTwo.style.cssText = "stroke: #c51010;";
  } else {
    progressCircleTwo.style.cssText = "stroke: #4caf50;";
  }

  const radiusTwo = progressCircleTwo.r.baseVal.value;
  const circumferenceTwo = 2 * Math.PI * radiusTwo;
  const offsetTwo = circumferenceTwo * (1 - progressTow / 100);
  progressCircleTwo.style.strokeDasharray = `${circumferenceTwo}`;
  progressCircleTwo.style.strokeDashoffset = `${offsetTwo}`;
  progressTextTwo.innerHTML = `${progressTow}%`;

  hours = hours % 12;
  hours = hours ? hours : 12;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  dayTime.innerHTML = `${date.getDate()} ${monthNames[date.getMonth()].slice(0, 3)}`;
  sunrise.innerHTML = finalResult.forecast.forecastday[0].astro.sunrise;
  sunset.innerHTML = finalResult.forecast.forecastday[0].astro.sunset;
  pressure.innerHTML = finalResult.forecast.forecastday[0].hour[0].pressure_mb;
  humidity.innerHTML = finalResult.forecast.forecastday[0].hour[0].humidity;
  loadingPage.style.cssText = "opacity : 0;  visibility: hidden;";
}

// Current Location Button
button.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    fetch(url, {
      headers: {
        'Accept-Language': 'en', // Request data in English
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const city = data.address.city || data.address.town || data.address.village || data.address.hamlet;
        console.log(data)
        getWeather(city);
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
      });
  });
});

// Background Images Mapping
const backgrounds = {
  Clear: 0,
  Cloudy: 1,
  Sunny: 2,
  "Partly Cloudy": 3,
  "Patchy rain nearby": 4,
  Mist: 5,
  Fog: 6,
  "Light drizzle": 7,
  "Light rain": 8,
  "Thundery outbreaks in nearby": 9,
  "Light rain shower": 10,
};

let New = new Map(Object.entries(backgrounds));

// Display Background Images
function displayBackGrounds() {
  for (let x of New) {
    let text = finalResult.forecast.forecastday[0].hour[1].condition.text;
    let lastImage = document.querySelector(".showing");
    if (text.trim() === x[0]) {
      lastImage.classList.remove("showing");
      lastImage.classList.add("hidden");
      backgroundImages[x[1]].classList.remove("hidden");
      backgroundImages[x[1]].classList.add("showing");
    }
  }
}

// Initial Load
getWeather("russia");
