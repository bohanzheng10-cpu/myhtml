/* ==========================================
   1. 首页大标题文字拆分
========================================== */
const titleEl = document.getElementById('wave-title');
const text = titleEl.innerText;
titleEl.innerHTML = ''; 

for (let char of text) {
    if (char === ' ') {
        titleEl.innerHTML += '&nbsp;'; 
    } else {
        const span = document.createElement('span');
        span.className = 'wave-letter';
        span.innerText = char;
        titleEl.appendChild(span);
    }
}

/* ==========================================
   2. 目录页平滑过渡逻辑 (移除了动态标题修改)
========================================== */
const worksOverlay = document.getElementById('works-overlay');
const closeWorksBtn = document.getElementById('close-works-btn');
const allWorks = document.querySelectorAll('.portfolio-item');

function openWorksOverlay() {
    allWorks.forEach(work => work.classList.add('show'));
    if (!worksOverlay) return;
    worksOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeWorksOverlay() {
    if (!worksOverlay) return;
    worksOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

const openWorksNav = document.getElementById('open-works-nav');
const openWorksHero = document.getElementById('open-works-hero');

if (openWorksNav) {
    openWorksNav.addEventListener('click', (e) => {
        e.preventDefault();
        openWorksOverlay();
    });
}

if (openWorksHero) {
    openWorksHero.addEventListener('click', (e) => {
        e.preventDefault();
        openWorksOverlay();
    });
}

if (closeWorksBtn) {
    closeWorksBtn.addEventListener('click', closeWorksOverlay);
}

/* ==========================================
   3. 黑白作品详情弹窗逻辑
========================================== */
const modal = document.getElementById("project-modal");
const closeBtn = document.getElementById("close-modal-btn");

allWorks.forEach(item => {
    item.addEventListener("click", () => {
        document.getElementById("modal-title").textContent = item.getAttribute("data-title");
        document.getElementById("modal-desc").textContent = item.getAttribute("data-desc");
        document.getElementById("modal-img").src = item.getAttribute("data-img");
        document.getElementById("modal-category").textContent = item.getAttribute("data-category");
        document.getElementById("modal-date").textContent = item.getAttribute("data-date");
        document.getElementById("modal-specs").textContent = item.getAttribute("data-specs");
        document.getElementById("modal-creator").textContent = item.getAttribute("data-creator");

        modal.classList.add("show");
    });
});

closeBtn.addEventListener("click", () => { modal.classList.remove("show"); });
window.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("show"); });

/* ==========================================
   4. 粒子背景连线引擎
========================================== */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', (event) => { mouse.x = event.x; mouse.y = event.y; });
window.addEventListener('mouseout', () => { mouse.x = undefined; mouse.y = undefined; });

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY;
        this.size = size; this.color = color;
        this.baseX = this.x; this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
    }
    draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color; ctx.fill();
    }
    update() {
        let dx = mouse.x - this.x; let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance; let forceDirectionY = dy / distance;
        let force = (mouse.radius - distance) / mouse.radius;
        let directionX = forceDirectionX * force * this.density; let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX; this.y -= directionY;
        } else {
            if (this.x !== this.baseX) { this.x -= (this.x - this.baseX) / 15; }
            if (this.y !== this.baseY) { this.y -= (this.y - this.baseY) / 15; }
        }
        this.draw();
    }
}

function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 12000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.5) - 0.25; let directionY = (Math.random() * 0.5) - 0.25;
        particlesArray.push(new Particle(x, y, directionX, directionY, size, 'rgba(255, 255, 255, 0.3)'));
    }
}

function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 8) * (canvas.height / 8)) {
                let opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(255, 255, 255,' + opacityValue + ')';
                ctx.lineWidth = 1; ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) { particlesArray[i].update(); }
    connectParticles();
}

window.addEventListener('resize', () => { canvas.width = innerWidth; canvas.height = innerHeight; initParticles(); });
initParticles(); animateParticles();
