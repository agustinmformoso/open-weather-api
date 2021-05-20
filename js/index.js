import { OPENWEATHER_API_KEY, OPENWEATHER_API_URL } from './constants.js'

let value
let units = localStorage.getItem('units') || 'metric'
let data = JSON.parse(localStorage.getItem('data')) || {}
let city = data.name || ''
let inputElement = document.getElementById('search')
let searchButton = document.getElementById('submit')

const layout = `
    <div class="col-12 col-sm-4 col-md-3 col-lg-3 d-flex justify-content-center align-items-center">
        <div class="d-flex flex-column align-items-center px-2">
            <p id="temperature" class="font-weight-bold h1"></p>
            <p id="feels_like" class="font-weight-bold h1 text-nowrap"></p>
        </div>
    </div>

    <div class="col-6 col-sm-4 col-md-3 col-lg-3 d-flex flex-column justify-content-center align-items-end">
        <p id="city" class="m-0 mb-2 h3 font-weight-bold text-end"></p>
        <span id="time" class="small mb-1 text-nowrap"></span>
        <span id="weather" class="small"></span>
    </div>

    <div class="col-6 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-start">
        <div class="d-flex align-items-center justify-content-center flex-wrap">
            <img id="icon" />
            <p id="units" class="h5 align-self-center px-2 font-weight-bold text-nowrap"></p>
        </div>
    </div>

        
    <div class="col-12 col-sm-12 col-md-3 col-lg-4 mt-4 d-flex justify-content-around justify-content-md-start justify-content-lg-around  align-items-center  flex-wrap">
        <div class="d-flex flex-column mb-md-3">
            <p id="humidity" class="my-1 small"></p>
            <p id="cloudiness" class="my-1 small"></p>
            <p id="wind" class="my-1 small"></p>
        </div>
        <div class="d-flex flex-column mb-md-3">
            <p id="min_temp" class="my-1 small"></p>
            <p id="max_temp" class="my-1 small"></p>
            <p id="pressure" class="my-1 small"></p>
        </div>
    </div>
`

const getWeather = (city, units) => {
    fetch(`${OPENWEATHER_API_URL}weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=${units}`)
        .then(
            res => {
                return res.json()
            }
        )
        .then(
            res => {
                data = res
                localStorage.setItem('data', JSON.stringify(data))
                
                printValues(data)
            }
        )

}

const getWeatherFromLS = () => {
    data && printValues(data)
}

const capitalize = (string) => {
    if (typeof string !== 'string') return ''
    return string.charAt(0).toUpperCase() + string.slice(1)
}

const getActualDate = () => {
    let today = new Date()
    let weekday = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ]
    let dd = weekday[today.getDay()]
    let hh = today.getHours()
    let mm = today.getMinutes()

    if (mm < 10) {
        mm = `0${mm}`
    }

    today = `${dd}, ${hh}:${mm} `

    return today
}

const printValues = (data) => {
    let card = document.getElementById('card')

    if (!city) {
        card.innerHTML = '<p class="text-center h1">Search some city</p>'
    } else {
        card.innerHTML = layout

        let { clouds, main, name, weather = [], wind } = data || {}
        let { all } = clouds || {}
        let { feels_like, humidity, pressure, temp, temp_max, temp_min } = main || {}
        let { description, icon } = weather[0] || []
        let { speed } = wind || {}

        let iconElement = document.getElementById('icon')
        let temperatureElement = document.getElementById('temperature')
        let feelsLikeElement = document.getElementById('feels_like')
        let humidityElement = document.getElementById('humidity')
        let cloudinessElement = document.getElementById('cloudiness')
        let windElement = document.getElementById('wind')

        let minTempElement = document.getElementById('min_temp')
        let maxTempElement = document.getElementById('max_temp')
        let pressureElement = document.getElementById('pressure')

        let cityElement = document.getElementById('city')
        let timeElement = document.getElementById('time')
        let weatherElement = document.getElementById('weather')

        iconElement.src = `http://openweathermap.org/img/wn/${icon}@2x.png`
        iconElement.alt = description

        temperatureElement.innerHTML = `${temp}°`
        feelsLikeElement.innerHTML = `RF: ${feels_like}°`

        humidityElement.innerHTML = `Humidity: ${humidity} %`
        cloudinessElement.innerHTML = `Cloudiness: ${all} %`
        windElement.innerHTML = `Wind Speed: ${speed} m/s`

        minTempElement.innerHTML = `Min. Temp: ${temp_min} %`
        maxTempElement.innerHTML = `Max. Temp: ${temp_max} %`
        pressureElement.innerHTML = `Pressure: ${pressure} m/s`

        cityElement.innerHTML = name
        timeElement.innerHTML = getActualDate()
        weatherElement.innerHTML = capitalize(description)

        setUnits()
    }
}

const setUnits = () => {
    let unitsElement = document.getElementById('units')
    let celsiusElement = document.createElement('span')
    let fahrenheitElement = document.createElement('span')

    celsiusElement.innerHTML = '°C'
    fahrenheitElement.innerHTML = '°F'

    if (unitsElement.innerHTML === '') {
        unitsElement.appendChild(celsiusElement)
        unitsElement.insertAdjacentHTML('beforeend', ' | ')
        unitsElement.appendChild(fahrenheitElement)
    }

    celsiusElement.addEventListener('click', () => {
        units = 'metric';
        localStorage.setItem('units', units);
        setClassName();
        (city && city.trim()) && getWeather(city, units);
    })

    fahrenheitElement.addEventListener('click', () => {
        units = 'imperial';
        localStorage.setItem('units', units);
        setClassName();
        (city && city.trim()) && getWeather(city, units);
    })

    const setClassName = () => {
        if (units === 'metric') {
            celsiusElement.className = 'active-unit';
            fahrenheitElement.className = 'disabled-unit';
        } else {
            fahrenheitElement.className = 'active-unit';
            celsiusElement.className = 'disabled-unit';
        }
    }

    setClassName()
}

inputElement.addEventListener('change', (e) => value = e.target.value)
inputElement.addEventListener('keyup', (e) => {
    city = value;
    (e.key === 'Enter' && city && city.trim()) && getWeather(city, units)
})

searchButton.addEventListener('click', () => {
    city = value;
    (city && city.trim()) && getWeather(city, units);
})

getWeatherFromLS()