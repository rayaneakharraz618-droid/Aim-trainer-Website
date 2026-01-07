const target = document.getElementById("target");
const camera = document.getElementById("camera");
const popSFX = document.getElementById("pop");
console.log("hello")

// ------------------------
// Helpers
// ------------------------
// Makes the target Move when clicked
function moveTarget() {
    const maxX = window.innerWidth - target.offsetWidth;
    const maxY = window.innerHeight - target.offsetHeight;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    target.style.left = x + "px";
    target.style.top = y + "px";
}

function playAnimation(target, name, speed) {
    target.classList.remove(name);
    target.style.setProperty("--animationSpeed", speed);
    void target.offsetWidth;
    target.classList.add(name);
}

function showComboText(combo) {
    if (combo <= 1) return;

    const popup = document.createElement("div");
    popup.className = "combo-popup";
    popup.textContent = "x" + combo;

    const rect = target.getBoundingClientRect();

    popup.style.left = rect.right + 10 + "px";
    popup.style.top = rect.top + rect.height / 2 + "px";

    document.body.appendChild(popup);

    popup.classList.add(
        combo >= 10 ? "combo-extreme":
        combo >= 5 ? "combo-high" :
        combo >= 3 ? "combo-mid" :
        "combo-low"
    );


    popup.addEventListener("animationend", () => {
        popup.remove();
    });
}

function round(number) {
    return Math.round(number * 10) / 10
}

function screenShake(intensity = 1) {
    camera.classList.remove("shake");
    camera.style.setProperty("--shake", intensity);
    void camera.offsetWidth;
    camera.classList.add("shake");
}

function playSFX(sfx, volume = 0.4) {
    sfx.currentTime = 0;
    sfx.volume = volume;
    sfx.play();
}

// Missing System
let misses = 0;

document.body.addEventListener("click", (e) => {
    if (e.target !== target) {
        misses++;
        console.log("miss", misses);
    }
});


// Score system
let score = 0;
let time;
let lastHitTime = 0;
let combo = 1;
let comboResetTime = 800;

target.addEventListener("click", (e) => {
    e.stopPropagation();
    score += combo;
    playSFX(popSFX, 0.5);

    const rand = round(Math.random());
    if (rand < 0.1) {
        playAnimation(target, "easterEgg", 0.5);
    }

    
    time = Date.now();
    
    if (lastHitTime && time - lastHitTime < comboResetTime) {
        combo += 1;
        showComboText(round(combo));
        screenShake(Math.min(combo, 10));
    } else {
        combo = 1;
    }

    if (lastHitTime) {
        const delta = time - lastHitTime
        document.getElementById("avg-time").textContent = "Average Time between hits: " + Math.round(delta) + "ms";
    }
    document.getElementById("score").textContent = "Score: " + round(score);
    moveTarget();
    lastHitTime = time
});



moveTarget();
