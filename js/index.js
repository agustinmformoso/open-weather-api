import { API_KEY, URL } from './constants.js'

let city;
let units;
let data = JSON.parse(localStorage.getItem('data'))
let inputElement = document.getElementById('search')
let searchButton = document.getElementById('submit')

const getWeather = (city, units) => {
    fetch(`${URL}weather?q=${city}&appid=${API_KEY}&units=${units}`)
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

const getWeatherFromLocalStorage = () => {
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
    let { clouds, main, name, weather, wind } = data
    let { all } = clouds
    let { feels_like, humidity, pressure, temp, temp_max, temp_min } = main
    let { description, icon } = weather[0]
    let { speed } = wind

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

const setUnits = () => {
    let unitsElement = document.getElementById('units')
    let celsiusElement = document.createElement('span')
    let fahrenheitElement = document.createElement('span')

    celsiusElement.innerHTML = '°C'
    celsiusElement.className = 'disabled-unit'
    fahrenheitElement.innerHTML = '°F'
    celsiusElement.className = 'disabled-unit'

    unitsElement.appendChild(celsiusElement)
    unitsElement.insertAdjacentHTML('beforeend', ' | ')
    unitsElement.appendChild(fahrenheitElement)
}

inputElement.addEventListener('change', (e) => city = e.target.value)
inputElement.addEventListener('keyup', (e) => {
    
    e.key === 'Enter' && getWeather(city, units)

})

searchButton.addEventListener('click', () => {
    getWeather(city, units)
})

getWeatherFromLocalStorage()