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