
/* +--------------------------------+ */
/* |           CONSTANTS            | */
/* +--------------------------------+ */

// Main div
const mainDiv = document.getElementById('main');

// My name
const myName = document.getElementById('myName');

// Canvas
const canvas = document.querySelector('canvas');

// Drawing context
const ctx = canvas.getContext('2d');

// Background/Sky opacity
const opacity = 0.7;

// Mountain colors
const mountainColors = [
    `rgba(40,56,67,${1})`,
    `rgba(38,51,62,${1})`,
    `rgba(39,41,50,${1})`,
    `rgba(37,37,37,${1})`,
];

// Mountain softener
const mountainSoftener = 175;

// Sky gradient
const skyGradients = {

    '8PM-5AM': [
        `rgba(33 ,33 ,33 , ${opacity}`,
        `rgba(8  ,36 ,56 , ${opacity}`,
        `rgba(50 ,138,148, ${opacity}`,
    ],

    '6AM-10AM': [
        `rgba(63 ,138,216, ${opacity}`,
        `rgba(138,183,235, ${opacity}`,
        `rgba(155,188,242, ${opacity}`,
        `rgba(218,213,253, ${opacity}`,
    ],

    '11AM-2PM': [
        `rgba(31 ,77 ,140, ${opacity}`,
        `rgba(73 ,122,189, ${opacity}`,
        `rgba(116,167,220, ${opacity}`,
        `rgba(141,184,224, ${opacity}`,
        `rgba(188,215,237, ${opacity}`,
    ],

    '3PM-4PM': [
        `rgba(111,110,180, ${opacity})`,
        `rgba(122,121,191, ${opacity})`,
        `rgba(133,127,197, ${opacity})`,
        `rgba(152,138,203, ${opacity})`,
        `rgba(158,136,200, ${opacity})`,
        `rgba(154,118,180, ${opacity})`,
        `rgba(98 ,93 ,160, ${opacity})`,
        `rgba(73 ,88 ,145, ${opacity})`,
    ],

    '5PM-7PM': [
        `rgba(57 ,47 ,56 , ${opacity})`,
        `rgba(118,68 ,71 , ${opacity})`,
        `rgba(203,92 ,65 , ${opacity})`,
        `rgba(255,113,47 , ${opacity})`,
        `rgba(252,223,83 , ${opacity})`,
    ],

};

// Ground: color and height
const groundColor = 'rgb(7,9,13)';
const groundHeight = 50;


// Meteor sizes
const meteorSizes = [
    8, 16, 16, 24, 24, 24, 24, 24, 24, 32
]

// Meteor color
const backgroundMeteorColor = 'rgba(232, 240, 255, 0.1)';
const backgroundMeteorShadow = 'rgba(247, 250, 255, 0.5)';

// Number of background meteors
const numberOfBackgroundMeteors = 10;

// Gravity and fricction
const gravity = 0.75;
const fricction = 0.8;

/* +----------------------- END OF CONSTANS --------------------------+ */

/* +--------------------------------------------+ */
/* |            FUNCTIONS / UTIL                | */
/* +--------------------------------------------+ */

// Get the time to define if it's day, evening, or night
const getTimeOfTheDay = () => {
    // return '8PM-5AM'; // <- padrao XD
    const hours = new Date().getHours();
    if((hours >= 20 && hours <= 24) || (hours >= 0 && hours <= 5)) {
        return '8PM-5AM';
    }
    if(hours >= 6 && hours <= 10) {
        return '6AM-10AM';
    }
    if(hours >= 11 && hours <= 16) {
        return '11AM-2PM';
    }
    if(hours >= 15 && hours <= 16) {
        return '3PM-4PM';
    }
    if(hours >= 17 && hours <= 19) {
        return '5PM-7PM';
    }
}

let skyGradient;

// Hiding the body on 'myName' double click
myName.ondblclick = () => {
    // Necesary cause the default opacity is null
    if(!mainDiv.style.opacity) {
        mainDiv.style.opacity = 1;
    }

    let op;
    let interval = setInterval(() => {
        op = parseFloat(mainDiv.style.opacity);
        if(op > 0) {
            op -= 0.1;
            mainDiv.style.opacity = op;
        } else {
            clearInterval(interval);
            mainDiv.style.display = 'none';
        }
    }, 15);
}

// Revealing the body on 'myCanvas' double click
canvas.ondblclick = () => {
    let op;
    let interval = setInterval(() => {
        op = parseFloat(mainDiv.style.opacity);
        mainDiv.style.display = 'block';
        if(op < 1) {
            op += 1;
            mainDiv.style.opacity = op;
        } else {
            clearInterval(interval);
        }
    }, 5);
}

// HYPER SECRET O_O; changes bg type
let index = 0;
canvas.onclick = (e) => {
    if(!e.ctrlKey || !e.shiftKey) {
        return;
    }
    const times = Object.keys(skyGradients);
    index = (index+1) % times.length;
    skyGradient = skyGradients[times[index]];
}

// Create a mountain range
const createMountainRange = (amount, size, color) => {
    const mountainWidth = canvas.width / amount;
    const ground = canvas.height - groundHeight;
    ctx.save();
    for(let i = 0; i < amount; i++) {
        ctx.beginPath();

        ctx.moveTo(i * mountainWidth - mountainSoftener, ground);
        ctx.lineTo(i * mountainWidth + mountainWidth / 2, ground - size);
        ctx.lineTo(i * mountainWidth + mountainWidth + mountainSoftener, ground);
        ctx.lineTo(i * mountainWidth - mountainSoftener, ground);

        ctx.fillStyle = color;
        ctx.fill();

        ctx.closePath(); 
    }
    ctx.restore();
}

// Create mountains
const createMountains = () => {
    createMountainRange(1, 320, mountainColors[0]);
    createMountainRange(2, 250, mountainColors[1]);
    createMountainRange(3, 150, mountainColors[2]);
    createMountainRange(4, 100, mountainColors[3]);
}

// Spawn/create moon
const spawnMoon = () => {
    const x = randomNumFromRange(55, canvas.width-55);
    const y = randomNumFromRange(canvas.height/5, canvas.height/2.5);
    const radius = randomNumFromRange(30, 45);
    return new Moon(x, y, radius);
}

// Spawn/create meteor
const spawnNewMeteor = () => {
    const x = randomNumFromRange(meteorSizes[meteorSizes.length-1], canvas.width - meteorSizes[meteorSizes.length-1]);
    const y = randomNumFromRange(-10, -300);
    const radius = getRandomElement(meteorSizes);
    const dx = randomNumFromRange(-10, 10);
    const dy = 0.01;

    return new Meteor(x, y, radius, dx, dy, 'rgb(232, 240, 255)', 'rgb(247, 250, 255)', 20);
}

const spawnBackgroundMeteors = () => {
    let backgroundMeteors = [];
    for(let i = 0; i < numberOfBackgroundMeteors; i++) {
        const x = randomNumFromRange(meteorSizes[meteorSizes.length-1], canvas.width - meteorSizes[meteorSizes.length-1]);
        const y = randomNumFromRange(canvas.height/4, canvas.height / 2);
        const radius = randomNumFromRange(2, 10);
        let dx;
        const randomNumber = randomNumFromRange(-1, 1);
        const dy = randomNumFromRange(-1, 1);
        if(randomNumber < 0) {
            dx = randomNumFromRange(1, 3);
        } else {
            dx = randomNumFromRange(-3, -1);
        }
        backgroundMeteors.push(new Meteor(x, y, radius, dx, dy, backgroundMeteorColor, backgroundMeteorShadow, 20));
    }
    return backgroundMeteors;
}

// Random number from range
const randomNumFromRange = (min, max) => {
    return Math.random() * (max - min) + min;
}

// Random array element
const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

// Resize canvas and restart (moon / stars / mountains, etc)
window.onresize = (e) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
}

// Initial Canvas resizing
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* +----------------------- END OF FUNCTIONS / UTIL --------------------------+ */

// Arrays
let backgroundMeteors;
let meteors;
let fragments;

// Moon variable
let moon;

// Ticker
let ticker;

/* +------------------------------------------------------+ */
/* |                        CLASSES                       | */
/* +------------------------------------------------------+ */

// Moon class
class Moon {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.draw = () => {
            ctx.save();
            ctx.beginPath();

            ctx.fillStyle = '#FEFEFE';
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 80;

            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.closePath();
            ctx.restore();
        }
    }
}

// Fragment class
class Fragment {
    constructor(x, y, radius, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.ttl = randomNumFromRange(80, 200);
        this.opacity = 1;

        this.draw = () => {
            ctx.save();
            ctx.beginPath();

            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

            ctx.fillStyle = `rgba(232, 240, 255, ${this.opacity})`;
            ctx.shadowColor = `rgba(247, 250, 255, ${this.opacity})`;
            ctx.shadowBlur = 20;

            ctx.fill();

            ctx.closePath();
            ctx.restore();
        }

        this.update = () => {
            this.draw();
            if(this.x + this.radius + this.dx > canvas.width || this.x - this.radius + this.dx < 0) {
                this.dx = -this.dx;
            }
            
            if(this.y + this.radius + this.dy > canvas.height - groundHeight) {
                this.dy = -this.dy * fricction;
            } else {
                this.dy += gravity;
            }

            this.x += this.dx;
            this.y += this.dy;
            this.opacity = this.ttl / 100;
            this.ttl--;
        }
    }
}

// Meteor class
class Meteor {
    constructor(x, y, radius, dx, dy, color, shadowColor, shadowBlur) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
        this.shadowColor = shadowColor;
        this.shadowBlur = shadowBlur;

        this.draw = () => {
            ctx.save();
            ctx.beginPath();

            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

            ctx.fillStyle = this.color;
            ctx.shadowColor = this.shadowColor;
            ctx.shadowBlur = this.shadowBlur;

            ctx.fill();

            ctx.closePath();
            ctx.restore();
        }

        this.shatter = () => {
            this.radius -= 8;
            for(let i = 0; i < 5; i++) {
                const x = this.x;
                const y = this.y;
                const radius = randomNumFromRange(2, this.radius/1.5);
                let dx;
                if(this.dx > 0) {
                    dx = randomNumFromRange(-1, this.dx);
                } else {
                    dx = randomNumFromRange(this.dx, 1);
                }
                const dy = randomNumFromRange(-this.dy/2, -this.dy/1.8);
                fragments.push(new Fragment(x, y, radius, dx, dy));
            }
        }

        this.update = () => {
            this.draw();

            if(this.x + this.radius + this.dx > canvas.width || this.x - this.radius + this.dx < 0) {
                this.dx = -this.dx;
            }

            
            if(this.y + this.radius + this.dy > canvas.height - groundHeight) {
                this.shatter();
                this.dy = -this.dy * fricction;
            } else {
                this.dy += gravity;
            }

            this.x += this.dx;

            this.dy += gravity;
            this.y += this.dy;
        }

        this.motion = () => {
            this.draw();

            this.x += this.dx;
            this.y += this.dy;
        }
    }
}

// init function
const init = () => {
    // Getting the time of the day(day, afternoon, night) and assigning it's specific sky background to skyGradient
    skyGradient = skyGradients[getTimeOfTheDay()];

    // Empty all arrays
    backgroundMeteors = [];
    meteors = [];
    fragments = [];

    // Background/Sky drawing
    ctx.save();

    const grd = ctx.createLinearGradient(0, 0, 0, canvas.height);

    skyGradient.forEach((color, i) => {
        grd.addColorStop(i / (skyGradient.length - 1), color);
    });
    
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = groundColor;
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

    ctx.restore();
    
    // Filling the backgroundMeteors array
    backgroundMeteors = spawnBackgroundMeteors();
    
    // Spawning a new moon
    moon = spawnMoon();

    // Background meteors drawing
    backgroundMeteors.forEach(backgroundMeteor => {
        backgroundMeteor.draw();
    });

    // Creating/drawing mountains
    createMountains();

    // Initializing the ticker
    ticker = randomNumFromRange(240, 400);

}

// Main animation function
const animate = () => {
    requestAnimationFrame(animate);

    // Background/Sky drawing
    ctx.save();

    const grd = ctx.createLinearGradient(0, 0, 0, canvas.height);

    skyGradient.forEach((color, i) => {
        grd.addColorStop(i / (skyGradient.length - 1), color);
    });
    
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();
    
    // Background meteors drawing
    backgroundMeteors.forEach((backgroundMeteor, i) => {
        backgroundMeteor.motion();
        if(backgroundMeteor.x - backgroundMeteor.radius + backgroundMeteor.dx > canvas.width ||
            backgroundMeteor.x + backgroundMeteor.radius + backgroundMeteor.dx < 0
            ) {
            backgroundMeteors.splice(i, 1);
            const randomNumber = randomNumFromRange(-1, 1);
            let x, dx;
            const y = randomNumFromRange(canvas.height/4, canvas.height/2);
            const radius = randomNumFromRange(2, 10);
            const dy = randomNumFromRange(-1, 1);
            if(randomNumber < 0) {
                x = -10;
                dx = randomNumFromRange(1, 3);
            } else {
                x = canvas.width + 10;
                dx = randomNumFromRange(-3, -1);
            }
            backgroundMeteors.push(new Meteor(x, y, radius, dx, dy, backgroundMeteorColor, backgroundMeteorShadow, 20));
        }
    });

    // Drawing the moon;
    moon.draw();

    // Drawing the mountains
    createMountains();

    // Falling meteors
    meteors.forEach((meteor, i) => {
        meteor.update();
        if(meteor.radius <= 0) {
            meteors.splice(i, 1);
        }
    });

    // Fragments
    fragments.forEach((fragment, i) => {
        fragment.update();
        if(fragment.ttl <= 0) {
            fragments.splice(i, 1);
        }
    });

    // Ground drawing
    ctx.save();
    ctx.fillStyle = groundColor;
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
    ctx.restore();

    // Ticker
    if(ticker < 0) {
        meteors.push(spawnNewMeteor());
        ticker = randomNumFromRange(40, 400);
    } else {
        ticker--;
    }
}

/* +---------------------------------------+ */
/* |              MAIN CALLS               | */
/* +---------------------------------------+ */

setInterval(() => {
    skyGradient = skyGradients[getTimeOfTheDay()];
}, 10000);

init();

animate();

// Topics scrolls
const topics = ['endereco', 'formacaoAcademica', 'atividadeProfissional', 'sitesPreferidos',];
topics.forEach(topic => {
    document.getElementById(`${topic}Scroll`).onclick = () => {
        document.getElementById(`${topic}`).scrollIntoView({behavior: 'smooth', block: 'start'});
    }
})

// Voltar scroll
document.getElementById('voltarScroll').onclick = () => {
    document.querySelector('body').scrollIntoView({behavior: 'smooth', block: 'start'});
}
