const createElement = document.createElement; /* A backup reference to the browser's original document.createElement */

const skipSeconds = 15;
const players = [];
let playbackRate = 1

const shipHosts = ['audio-ak-spotify-com.akamaized.net']

document.createElement = function(tagName) {
    
    const element = createElement.call(document, tagName);
    
    if(tagName === 'video' || tagName === 'audio')
    {
        const player = element;

        players.push(player);

        player.addEventListener('loadeddata', () => {
            
            const url = new URL(player.src)
            if(shipHosts.includes(url.host)) {
                player.muted = true
                document.querySelector('svg.wheel')?.classList.add('spinning')
            }
            else {
                player.muted = false
                player.playbackRate = playbackRate
                document.querySelector('svg.wheel')?.classList.remove('spinning')
            }
        })

        player.addEventListener('canplaythrough', () => {
            const url = new URL(player.src)
            if(shipHosts.includes(url.host)) {
                player.currentTime = player.duration;
            }
        })
    }

    return element;
};

const checker = setInterval(() => {
    const playerControls = document.querySelector('div.player-controls__buttons');
    const extraControls = document.querySelector('div.mwpJrmCgLlVkJVtWjlI1');

    if(!playerControls) return;

    const skipButton = createButton('wheel', `
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
    `, () => {
        const player = players[0];
        if(!player) return;
        player.currentTime = player.duration;
    })

    if(!!extraControls)
        extraControls.prepend(skipButton);

    const playbackSpeedAction = (playbackSpeed, button) => {
        const player = players[0];
        if(!player) return;
        
        if(playbackSpeed.speed !== 1) {
            button.parentNode.classList.add('ebfd411a126f1e7bea6133f21b4ef88e-scss')
            button.parentNode.classList.add('_46e671f2323a45b17a6f4a3d15c2961f-scss')
        } else {
            button.parentNode.classList.remove('ebfd411a126f1e7bea6133f21b4ef88e-scss')
            button.parentNode.classList.remove('_46e671f2323a45b17a6f4a3d15c2961f-scss')
        }

        button.innerHTML = `x${playbackSpeed.speed}`
        playbackRate = playbackSpeed.speed
        player.playbackRate = playbackSpeed.speed
    }

    const playbackSpeeds = [
        {
            label: '0.25',
            speed: 0.25,
            action: playbackSpeedAction
        },
        {
            label: '0.5',
            speed: 0.5,
            action: playbackSpeedAction
        },
        {
            label: '0.75',
            speed: 0.75,
            action: playbackSpeedAction
        },
        {
            label: 'Normal',
            speed: 1,
            action: playbackSpeedAction
        },
        {
            label: '1.25',
            speed: 1.25,
            action: playbackSpeedAction
        },
        {
            label: '1.5',
            speed: 1.5,
            action: playbackSpeedAction
        },
        {
            label: '1.75',
            speed: 1.75,
            action: playbackSpeedAction
        },
        {
            label: '2',
            speed: 2,
            action: playbackSpeedAction
        },
    ]

    const playbackSpeedButton = createButton('playback-speed', 'x1', (event) => {
        const contextMenuPosition = {
            x: event.target.parentNode.offsetLeft,
            y: event.target.parentNode.offsetTop - 328
        }

        const contextMenu = createContextMenu(playbackSpeeds, contextMenuPosition, event.target)

        document.body.appendChild(contextMenu)
    })

    playerControls.prepend(playbackSpeedButton);

    clearInterval(checker);
}, 10)

document.addEventListener('keyup', event => keyboard(event.key));

const keyboard = (key) => {
    const player = players[0];

    if(document.activeElement.tagName === 'INPUT') return;

    if(isNumericKey(key))
    {
        skipTo(player, parseInt(key));
    }
    else if(key == 'ArrowLeft')
    {
        if(!player) return;
        player.currentTime = player.currentTime - skipSeconds;
    }
    else if(key == 'ArrowRight')
    {
        if(!player) return;
        player.currentTime = player.currentTime + skipSeconds;
    }
}

const isNumericKey = (key) => {
    return Number.isInteger(parseInt(key));
}

const skipTo = (player, percent) => {
    const chuck = player.duration / 10;
    player.currentTime = chuck * percent;
}

const createContextMenu = (items, position, target) => {
    const contextMenu = document.createElement('div')
    const wrapperInner = document.createElement('div')
    
    contextMenu.id = 'tippy-1'
    contextMenu.style.position = 'absolute'
    contextMenu.style.zIndex = 9999
    contextMenu.style.transform = `translate(${position.x}px, ${position.y}px)`

    const ul = document.createElement('ul')
    ul.classList.add('SboKmDrCTZng7t4EgNoM')

    wrapperInner.appendChild(ul);
    contextMenu.appendChild(wrapperInner)

    items.forEach(item => {
        const li = document.createElement('li')
        li.classList.add('DuEPSADpSwCcO880xjUG')

        const button = document.createElement('button')

        button.innerText = item.label

        button.classList.add('wC9sIed7pfp47wZbmU6m')

        button.addEventListener('click', () => {
            item.action(item, target)
        })

        li.appendChild(button)

        ul.appendChild(li)
    });

    return contextMenu
}

const createButton = (className, innerHTML, onClick) => {
    const buttonWrapper = document.createElement('div');
    
    buttonWrapper.classList.add('control-button-wrapper')
    buttonWrapper.classList.add(className)

    const button = document.createElement('button');
    button.classList.add('control-button')

    button.innerHTML = innerHTML
    button.addEventListener('click', onClick)

    buttonWrapper.appendChild(button);

    return buttonWrapper
}

const removeContextMenu = (event) => {
    if(event.target.parentNode.className.includes('control-button-wrapper playback-speed')) return

    const contextMenu = document.getElementById('tippy-1')
    if(!contextMenu) return

    document.body.removeChild(contextMenu)
}

document.body.addEventListener('contextmenu', removeContextMenu)
document.body.addEventListener('click', removeContextMenu)