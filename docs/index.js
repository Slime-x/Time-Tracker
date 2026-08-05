// Digital Clock //

function updateClock() {

    const now = new Date();
    let hours = now.getHours();
    const merdiem = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    hours = hours.toString().padStart(2, 0);
    const minutes = now.getMinutes().toString().padStart(2, 0);
    const seconds = now.getSeconds().toString().padStart(2, 0);
    const timeString = `${hours}:${minutes}:${seconds} ${merdiem}`;
    document.getElementById("clock").textContent = timeString;


    const date = now.toLocaleDateString("en-Us", {
        weekday: "long",
        month: "short",
        day: "numeric"
    });
    document.getElementById("date").textContent = date;

}


updateClock();
setInterval(updateClock, 1000);


// == Stopwatch ==

let swElapsed = 0;      // milliseconds accumulated before the current run
let swStartedAt = null; // timestamp when the current run started, or null if stopped
let swInterval = null;

function formatSW(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function renderSW() {
    const current = swElapsed + (swStartedAt ? Date.now() - swStartedAt : 0);
    document.getElementById("display").textContent = formatSW(current);
}

function start() {
    if (swStartedAt) return; // already running
    swStartedAt = Date.now();
    swInterval = setInterval(renderSW, 1000);
}

function stop() {
    if (!swStartedAt) return; // already stopped
    swElapsed += Date.now() - swStartedAt;
    swStartedAt = null;
    clearInterval(swInterval);
    renderSW();
}

function reset() {
    clearInterval(swInterval);
    swElapsed = 0;
    swStartedAt = null;
    renderSW();
}


// == Window Manager ==
// Handles opening/closing "app" windows, dragging by the titlebar,
// resizing from the corner handle, and click-to-front stacking —
// basically the bare minimum to feel like a desktop OS.

let topZ = 10;

function bringToFront(win) {
    topZ += 1;
    win.style.zIndex = topZ;
}

function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    // First time opening: give it a sane default position/size
    // roughly centered, only once, so re-opening keeps where you left it.
    if (!win.dataset.placed) {
        const w = 420;
        const h = 320;
        win.style.width = w + "px";
        win.style.height = h + "px";
        win.style.left = (window.innerWidth / 2 - w / 2) + "px";
        win.style.top = (window.innerHeight / 2 - h / 2) + "px";
        win.dataset.placed = "true";
    }

    win.classList.add("open");
    bringToFront(win);
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.classList.remove("open");
}

function initWindow(win) {
    const titlebar = win.querySelector(".window-titlebar");
    const resizeHandle = win.querySelector(".window-resize-handle");

    // Clicking anywhere on the window brings it to front.
    win.addEventListener("mousedown", () => bringToFront(win));

    // --- Dragging ---
    let dragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    titlebar.addEventListener("mousedown", (e) => {
        // Ignore drags that start on a titlebar button (e.g. close).
        if (e.target.closest(".window-btn")) return;

        dragging = true;
        const rect = win.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        bringToFront(win);
        e.preventDefault();
    });

    // --- Resizing ---
    let resizing = false;
    let resizeStartX = 0;
    let resizeStartY = 0;
    let resizeStartW = 0;
    let resizeStartH = 0;

    resizeHandle.addEventListener("mousedown", (e) => {
        resizing = true;
        resizeStartX = e.clientX;
        resizeStartY = e.clientY;
        resizeStartW = win.offsetWidth;
        resizeStartH = win.offsetHeight;
        bringToFront(win);
        e.preventDefault();
        e.stopPropagation();
    });

    document.addEventListener("mousemove", (e) => {
        if (dragging) {
            let newLeft = e.clientX - dragOffsetX;
            let newTop = e.clientY - dragOffsetY;

            // Keep the window from being dragged fully off-screen.
            newLeft = Math.max(-win.offsetWidth + 80, Math.min(newLeft, window.innerWidth - 80));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - 40));

            win.style.left = newLeft + "px";
            win.style.top = newTop + "px";
        }

        if (resizing) {
            const minW = 280;
            const minH = 220;
            const newW = Math.max(minW, resizeStartW + (e.clientX - resizeStartX));
            const newH = Math.max(minH, resizeStartH + (e.clientY - resizeStartY));
            win.style.width = newW + "px";
            win.style.height = newH + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        dragging = false;
        resizing = false;
    });
}

document.querySelectorAll(".os-window").forEach(initWindow);

// ======= Music =====

const musicLibrary = {
    lofi: [
        { title: "Title 1", src: "music/prom_queen.mp3", cover: "music/pic/1.jpg" },
        { title: "Title 1", src: "music/here_with_me.mp3", cover: "music/pic/1.jpg" },
        { title: "Title 1", src: "music/i_want.mp3", cover: "music/pic/1.jpg" },
    ],

    ambient: [
        { title: "Title 1", src: "music/idk-lofi.mp3", cover: "music/pic/1.jpg" },
        { title: "Title 1", src: "music/idk-lofi.mp3", cover: "music/pic/1.jpg" },
        { title: "Title 1", src: "music/idk-lofi.mp3", cover: "music/pic/1.jpg" },
    ],

    smth1: [
        { title: "Title 1", src: "music/idk-lofi.mp3", cover: "music/pic/1.jpg" },
        { title: "Title 1", src: "music/idk-lofi.mp3", cover: "music/pic/1.jpg" },
        { title: "Title 1", src: "music/idk-lofi.mp3", cover: "music/pic/1.jpg" },
    ],

    smth2: [
        { title: "Title 1", src: "music/idk-lofi.mp3", cover: "music/pic/1.jpg" },
        { title: "Title 1", src: "music/idk-lofi.mp3", cover: "music/pic/1.jpg" },
        { title: "Title 1", src: "music/idk-lofi.mp3", cover: "music/pic/1.jpg" },
    ]

    // If you wanna add more categories just add ',' of ] in smth2 i.e  ], at last then follow the same thing i did on top. and the last category doesnt need ','    
};

const musicAudio = document.getElementById("musicAudio");
let currentCategory = "lofi";

function renderTrackRow(category) {
    const row = document.getElementById("track-row");
    row.innerHTML = "";
    musicLibrary[category].forEach(track => {
        const card = document.createElement("div");
        card.className = "track-card";
        card.innerHTML = `<img src="${track.cover}" alt="${track.title}"><span>${track.title}</span>`;
        card.onclick = () => playTrack(track, card);
        row.appendChild(card);
    });

}

function switchCategory(category, btn) {
    currentCategory = category;
    document.querySelectorAll(".ctn-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderTrackRow(category);
}

function playTrack(track, cardEl) {
    musicAudio.src = track.src;
    musicAudio.play();
    document.querySelectorAll(".track-card").forEach(c => c.classList.remove("playing"));
    cardEl.classList.add("playing");
    document.getElementById("now-playing-label").textContent = track.title;
}

function stopMusic() {
    musicAudio.onpause();
    musicAudio.remnoveAttribute("src");
    musicAudio.onload();
    document.querySelectorAll(".track-card").forEach(c => c.classList.remove("playing"));
    document.getElementById("now-playing-label").textContent = "No Music Playing";
}

function toggleLock() {
    musicAudio.loop = !musicAudio.loop;
    const bth = document.getElementById("lockBtn");
    btn.textContent = musicAudio.loop ? "🔒 Repeat On" : "🔓 Repeat Off";
    btn.classList.toggle("locked", musicAudio.loop);
}

renderTrackRow(currentCategory);