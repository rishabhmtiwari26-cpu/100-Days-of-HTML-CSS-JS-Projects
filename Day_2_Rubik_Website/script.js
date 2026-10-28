const cube = document.getElementById('cube');
const scrambleEl = document.getElementById('scramble');
const timerEl = document.getElementById('timer');
const shuffleBtn = document.getElementById('shuffleBtn');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

// Cube Drag Rotation
let isDragging = false, startX, startY, currentX = -20, currentY = -30;
cube.addEventListener('mousedown', e => { isDragging = true; startX = e.clientX; startY = e.clientY; });
window.addEventListener('mouseup', () => isDragging = false);
window.addEventListener('mousemove', e => {
    if(!isDragging) return;
    currentY += (e.clientX - startX) * 0.5;
    currentX -= (e.clientY - startY) * 0.5;
    cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
    startX = e.clientX; startY = e.clientY;
});

// Scramble Generator
const moves = ["R", "L", "U", "D", "F", "B", "R'", "L'", "U'", "D'", "F'", "B'", "R2", "L2", "U2", "D2", "F2", "B2"];
function generateScramble(){
    let scramble = [];
    for(let i=0; i<20; i++){
        scramble.push(moves[Math.floor(Math.random()*moves.length)]);
    }
    return scramble.join(" ");
}
shuffleBtn.addEventListener('click', ()=>{
    scrambleEl.textContent = generateScramble();
    cube.style.transform = `rotateX(${Math.random()*360}deg) rotateY(${Math.random()*360}deg)`;
    setTimeout(()=>{ cube.style.transform = `rotateX(-20deg) rotateY(-30deg)` }, 500);
});

// Timer Logic
let timer, ms = 0, isRunning = false;
function formatTime(ms){
    let minutes = Math.floor(ms/60000);
    let seconds = Math.floor((ms%60000)/1000);
    let centi = Math.floor((ms%1000)/10);
    return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}.${String(centi).padStart(2,'0')}`;
}
startBtn.addEventListener('click', ()=>{
    if(!isRunning){
        isRunning = true;
        startBtn.textContent = "Stop";
        startBtn.style.background = "#e74c3c";
        timer = setInterval(()=>{ ms+=10; timerEl.textContent = formatTime(ms); }, 10);
    } else {
        isRunning = false;
        startBtn.textContent = "Start Timer";
        startBtn.style.background = "#2ecc71";
        clearInterval(timer);
    }
});
resetBtn.addEventListener('click', ()=>{
    clearInterval(timer);
    isRunning = false;
    ms = 0;
    timerEl.textContent = "00:00.00";
    startBtn.textContent = "Start Timer";
    startBtn.style.background = "#2ecc71";
    scrambleEl.textContent = "Click Shuffle for new scramble";
});

scrambleEl.textContent = generateScramble();