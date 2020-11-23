const createElement = document.createElement; /* A backup reference to the browser's original document.createElement */

const players = [];

document.createElement = function(tagName) {
    
    const element = createElement.call(document, tagName);
    
    if(tagName === 'video' || tagName === 'audio')
    {
        const player = element;

        players.push(player);

        player.addEventListener('loadeddata', () => {

            const wheel = document.querySelector('svg.wheel')

            if(wheel) {
                wheel.classList.add('spinning')
            }

            const url = new URL(player.src)
            if('audio-akp-quic-control-spotify-com.akamaized.net' == url.host) {
                console.log('PAUSE');
                player.pause()
            }
            else if(wheel) {
                wheel.classList.remove('spinning')
            }
        })

        player.addEventListener('canplaythrough', () => {
            const url = new URL(player.src)
            if('audio-akp-quic-control-spotify-com.akamaized.net' == url.host) {
                console.log('SKIP');
                player.currentTime = player.duration;
            }
        })
    }

    return element;
};

const checker = setInterval(() => {
    const buttonControl = document.querySelector('div.player-controls__buttons');

    if(!buttonControl) return;

    const buttonWrapper = document.createElement('div');

    buttonWrapper.setAttribute('class', 'control-button-wrapper wheel');

    const skipButton = document.createElement('button');
    skipButton.setAttribute('class', 'control-button');

    skipButton.innerHTML = `
        <svg class="wheel">
            <circle cx="12" cy="12" r="7.8"/>
            <circle cx="12" cy="12" r="2.3"/>
            <line x1="12" y1="9.7" x2="12" y2="1.4"/>
            <line x1="12" y1="14.3" x2="12" y2="22.6"/>
            <line x1="10.3" y1="10.3" x2="4.5" y2="4.5"/>
            <line x1="13.7" y1="13.7" x2="19.5" y2="19.5"/>
            <line x1="9.7" y1="12" x2="1.4" y2="12"/>
            <line x1="14.3" y1="12" x2="22.6" y2="12"/>
            <line x1="10.3" y1="13.7" x2="4.5" y2="19.5"/>
            <line x1="13.7" y1="10.3" x2="19.5" y2="4.5"/>
        </svg>
    `;

    skipButton.addEventListener('click', () => {
        if(!players[0]) return;
        players[0].currentTime = players[0].duration;
    }) 

    buttonWrapper.appendChild(skipButton);

    buttonControl.appendChild(buttonWrapper);

    clearInterval(checker);
}, 10)