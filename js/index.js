import { API_KEY, URL } from './constants.js'

let city = 'Buenos Aires'
let units = 'metric'
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
            data => printValues(data)
        )
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
    console.log(data)

    let { clouds, main, name, weather, wind } = data
    let { all } = clouds
    let { feels_like, humidity, temp } = main
    let { description, icon } = weather[0]
    let { speed } = wind

    let iconElement = document.getElementById('icon')
    let temperatureElement = document.getElementById('temperature')
    let humidityElement = document.getElementById('humidity')
    let cloudinessElement = document.getElementById('cloudiness')
    let windElement = document.getElementById('wind')

    let cityElement = document.getElementById('city')
    let timeElement = document.getElementById('time')
    let weatherElement = document.getElementById('weather')

    iconElement.src = `http://openweathermap.org/img/wn/${icon}@2x.png`
    iconElement.alt = description

    humidityElement.innerHTML = `Humidity: ${humidity} %`
    cloudinessElement.innerHTML = `Cloudiness: ${all} %`
    windElement.innerHTML = `Wind Speed: ${speed} m/s`


    cityElement.innerHTML = name
    timeElement.innerHTML = getActualDate()
    weatherElement.innerHTML = capitalize(description)

    temperatureElement.innerHTML = temp
}

inputElement.addEventListener('change', (e) => city = e.target.value)

searchButton.addEventListener('click', () => {
    getWeather(city, units)
})

getWeather(city, units)