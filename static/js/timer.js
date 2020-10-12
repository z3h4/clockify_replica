let seconds = 0;
let minutes = 0;
let hours = 0;
let interval;

startTimer = () => {
    interval = window.setInterval(() =>{
        handleTimeIncrement();
        displayTime();
    }, 1000);
}

stopTimer= () => {
    window.clearInterval(interval);
    seconds = 0;
    minutes = 0;
    hours = 0;
    document.getElementById("taskTimer").innerHTML = "00:00:00";
}

handleTimeIncrement = () => {
    seconds++;
    if (seconds % 60 === 0) {
        seconds = 0;
        minutes++;
        if (minutes % 60 === 0) {
            minutes = 0;
            hours++;
        }
    }
}

formatTimes = () => {
    formattedTime = (hours === 0 ? '00' : hours > 9 ? hours : ('0' + hours)) + ':';
    formattedTime += (minutes === 0 ? '00' : minutes > 9 ? minutes : ('0' + minutes)) + ':';
    formattedTime += seconds > 9 ? seconds : ('0' + seconds);
    return formattedTime;
}

displayTime = () => {
    document.getElementById('taskTimer').innerHTML = formatTimes();
}