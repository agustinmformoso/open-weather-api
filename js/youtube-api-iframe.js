var player, firstScriptTag
tag = document.createElement('script');

let data = JSON.parse(localStorage.getItem('data')) || {}
let city = data.name || ''

var inputElement = document.getElementById('search')
var searchButton = document.getElementById('submit')

tag.src = 'https://www.youtube.com/iframe_api';
firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function setVideo(weather) {
    let video

    switch (weather) {
        case 'moderate rain':
            video = 'mPZkdNFkNps'
            return video
        case 'clear sky':
            video = 'joQ42CYhtZw'
            return video
        case 'overcast clouds':
            video = 'Ouf9K7I5vZ0'
            return video
        case 'light rain':
            video = 'x7SQaDTSrVg'
            return video
        default: {
            video = 'bkqQLpxwS9c'
            return video
        }
    }

}

function onYouTubeIframeAPIReady() {
    var options = {
        width: '100%',
        height: 440,
        videoId: setVideo(),
        playerVars: {
            autoplay: 1,
            mute: 1,
            loop: 1,
            controls: 0,
        },

        events: {
            'onReady': onPlayerReady,
        }
    };

    player = new YT.Player(
        'player',
        options
    );
}

function onPlayerReady(event) {
}

inputElement.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && city && e.target.value !== '') {
        setTimeout(() => {
            let weather = JSON.parse(localStorage.getItem('data')).weather[0].description;
            player.loadVideoById(setVideo(weather))
        }, 1000);
    }
})

searchButton.addEventListener('click', (e) => {
    setTimeout(() => {
        let weather = JSON.parse(localStorage.getItem('data')).weather[0].description;
        player.loadVideoById(setVideo(weather))
    }, 1000);
})