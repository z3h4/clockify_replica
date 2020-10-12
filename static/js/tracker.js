const startButton = document.querySelector("#startButton");

startButton.addEventListener("click", (e) => {
    if (startButton.innerHTML === "Start") {
        startTimer();
        createTimeEntry();
        startButton.innerHTML = "Stop";
    } else {
        stopTimer();
        startButton.innerHTML = "Start";
    }
});

createTimeEntry = () => {
    let xhr = new XMLHttpRequest();
    xhr.open('post', '/tracker/time_entry_created', true);
    xhr.setRequestHeader("X-CSRFToken", document.querySelector("input[name=csrfmiddlewaretoken]").value);

    xhr.onload = function() {        
        if (this.status === 200) {
            console.log("SUCCESS");
            console.log(xhr.response);
            console.log(typeof xhr.response);
            const response = JSON.parse(xhr.response);
            const time_entry = response.time_entry;
        }
    }
    // console.log(input.value);
    xhr.send(JSON.stringify({ projectId: 1, name: input.value}));
}

/////////////////////////////////////////////////////////////////////////////////////
var currentTimeElement;

timeUpdate = () => {
    //
}

// editTaskTime = (e) => {
//     if (currentTimeElement === e)
//         return;
//     currentTimeElement = e;

//     let currentTime = e.value;

//     let hour = currentTime.substring(0, 2);
//     let minute = currentTime.substring(3, 5);

//     let editedTime = currentTime.substring(0, currentTime.length - 2);
//     console.log(hour + " " + minute);
// }

updateStartTime = (timeEntryId, newTime) => {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('post', '/tracker/time_entry/' + timeEntryId +'/update', true);
        xhr.setRequestHeader("X-CSRFToken", document.querySelector("input[name=csrfmiddlewaretoken]").value);
    
        xhr.onload = function() {        
            if (this.status === 200) {
                resolve("SUCCESS");
            }
            else {
                reject(new Error(this.status));
            }
        }
        xhr.send(JSON.stringify({ start_time: newTime }));
    });
};

updateEndTime = (timeEntryId, newTime) => {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('post', '/tracker/time_entry/' + timeEntryId +'/update', true);
        xhr.setRequestHeader("X-CSRFToken", document.querySelector("input[name=csrfmiddlewaretoken]").value);
    
        xhr.onload = function() {        
            if (this.status === 200) {
                resolve("SUCCESS");
            }
            else {
                reject(new Error(this.status));
            }
        }
        xhr.send(JSON.stringify({ end_time: newTime }));
    });
};

calculateTaskTime = (startTime, endTime) => {
    const startTimeArr = startTime.split(":");
    const endTimeArr = endTime.split(":");
    const startTimeinSeconds = parseInt(startTimeArr[0]) * 60 + parseInt(startTimeArr[1]);
    const endTimeinSeconds = parseInt(endTimeArr[0]) * 60 + parseInt(endTimeArr[1]);

    return endTimeinSeconds - startTimeinSeconds;
}


formatTaskTime = (diff) => {
    const minutes = diff % 60;
    const hours = Math.floor(diff / 60);
    const seconds = document.getElementById('taskTimeInput').value.split(":")[2];
    
    formattedTime = (hours === 0 ? '00' : hours > 9 ? hours : ('0' + hours)) + ':';
    formattedTime += (minutes === 0 ? '00' : minutes > 9 ? minutes : ('0' + minutes)) + ':';
    formattedTime += seconds;
    return formattedTime;
}



document.getElementById('taskStartTimeInput').addEventListener('change', async function (e) {
    let newTime = this.value.replace(/\s/g, '')
    var result = newTime.match(/(((0[1-9])|(1[0-2])):([0-5])([0-9])(A|P|)(M))/);
    
    if (!result)
        this.value = this.defaultValue;
    else {
        // valid time, update entry
        try {
            await updateStartTime(this.getAttribute('data-id'), newTime);
            this.defaultValue = newTime;

            const diff = calculateTaskTime(newTime, document.getElementById('taskEndTimeInput').value);
            const formattedTime = formatTaskTime(diff);
            
            document.getElementById('taskTimeInput').value = formattedTime;
        }
        catch (ex) {
            console.log("Error updating start time", ex);
        }
    }
});

document.getElementById('taskEndTimeInput').addEventListener('change', async function (e) {
    let newTime = this.value.replace(/\s/g, '')
    var result = newTime.match(/(((0[1-9])|(1[0-2])):([0-5])([0-9])(A|P|)(M))/);
    
    if (!result)
        this.value = this.defaultValue;
    else {
        // valid time, update entry
        try {
            await updateEndTime(this.getAttribute('data-id'), newTime);
            this.defaultValue = newTime;

            const diff = calculateTaskTime(document.getElementById('taskStartTimeInput').value, newTime);
            const formattedTime = formatTaskTime(diff);
            
            document.getElementById('taskTimeInput').value = formattedTime;
        }
        catch (ex) {
            console.log("Error updating start time", ex);
        }
    }
})

// document.addEventListener("click", function (e) {
//     // var container = document.getElementsByClassName('project-name-container')[0];

//     if (currentTimeElement !== e)
//         currentTimeElement = null;
// });



/////////////////////////////////////////////////////////////////////////////////////



taskNameChanged = (e) => {
    const dataId = e.getAttribute("data-id");
    
    let xhr = new XMLHttpRequest();
    xhr.open('post', '/tracker/' + dataId + '/task_updated', true);
    xhr.setRequestHeader("X-CSRFToken", document.querySelector("input[name=csrfmiddlewaretoken]").value);
    
    xhr.onload = function() {
        // TODO: Do I need this?
        
        if (this.status === 200) {
            // console.log("SUCCESS");
        }
    }

    xhr.send(JSON.stringify({ name: e.value }));
}

onTaskDelete = (e) => {
    const dataId = e.getAttribute("data-id");
    console.log(dataId);
}