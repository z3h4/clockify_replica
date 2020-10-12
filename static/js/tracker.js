const startButton = document.querySelector("#startButton");

startButton.addEventListener("click", async(e) => {
    if (startButton.innerHTML === "Start") {
        startButton.innerHTML = "Stop";
        startTimer();
        
        try{
            await createTimeEntry();
        }
        catch (ex) {
            console.log(ex);
        }
    } else {
        startButton.innerHTML = "Start";
        stopTimer();

        try{
            await updateEndTime(input.getAttribute('data-id'), document.getElementById('taskTimer').innerHTML);
        }
        catch (ex) {
            console.log(ex);
        }
    }
});

createTimeEntry = () => {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('post', '/tracker/time_entry_created', true);
        xhr.setRequestHeader("X-CSRFToken", document.querySelector("input[name=csrfmiddlewaretoken]").value);
    
        xhr.onload = function() {        
            if (this.status === 200) {
                const response = JSON.parse(xhr.response);
                const time_entry = response.time_entry;
                input.setAttribute('data-id', time_entry.id);
                resolve("SUCCESS");
            }
            else {
                reject(new Error(`Response status: ${this.status}`));
            }
        }
        xhr.send(JSON.stringify({ projectId: 1, name: input.value}));
    });

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
    console.log(newTime);
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


formatTaskTime = (diff, dataId) => {
    const minutes = diff % 60;
    const hours = Math.floor(diff / 60);
    const seconds = document.querySelector('[data-task-id="' + dataId + '"]').value.split(":")[2];
    
    formattedTime = (hours === 0 ? '00' : hours > 9 ? hours : ('0' + hours)) + ':';
    formattedTime += (minutes === 0 ? '00' : minutes > 9 ? minutes : ('0' + minutes)) + ':';
    formattedTime += seconds;
    return formattedTime;
}

var taskStartTimeInputs = document.getElementsByClassName('task-start-time-input');

for(var i = 0; i < taskStartTimeInputs.length; i++) {
    taskStartTimeInputs[i].addEventListener('change', async function() {
        let newTime = this.value.replace(/\s/g, '')
        var result = newTime.match(/(((0[1-9])|(1[0-2])):([0-5])([0-9])(A|P|)(M))/);
        
        if (!result)
            this.value = this.defaultValue;
        else {
            // valid time, update entry
            try {
                let dataId = this.getAttribute('data-task-start-id');
                await updateStartTime(dataId, newTime);
                this.defaultValue = newTime;

                const diff = calculateTaskTime(newTime, document.querySelector('[data-task-start-id="' + dataId + '"]').value);
                const formattedTime = formatTaskTime(diff, dataId);
                
                document.querySelector('[data-task-id="' + dataId + '"]').value = formattedTime;
            }
            catch (ex) {
                console.log("Error updating start time", ex);
            }
        }
    })
}

var taskEndTimeInputs = document.getElementsByClassName('task-end-time-input');

for(var i = 0; i < taskEndTimeInputs.length; i++) {
    taskEndTimeInputs[i].addEventListener('change', async function() {
        let newTime = this.value.replace(/\s/g, '')
        var result = newTime.match(/(((0[1-9])|(1[0-2])):([0-5])([0-9])(A|P|)(M))/);
        
        if (!result)
            this.value = this.defaultValue;
        else {
            // valid time, update entry
            try {
                let dataId = this.getAttribute('data-task-end-id');
                await updateEndTime(dataId, newTime);
                this.defaultValue = newTime;

                const diff = calculateTaskTime(document.querySelector('[data-task-start-id="' + dataId + '"]').value, newTime);
                const formattedTime = formatTaskTime(diff, dataId);
                
                document.querySelector('[data-task-id="' + dataId + '"]').value = formattedTime;
            }
            catch (ex) {
                console.log("Error updating start time", ex);
            }
        }
    })
}



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

    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('post', '/tracker/' + dataId + '/time_entry_deleted', true);
        xhr.setRequestHeader("X-CSRFToken", document.querySelector("input[name=csrfmiddlewaretoken]").value);
    
        xhr.onload = function() {        
            if (this.status === 200) {
                document.querySelector('[data-card-id="' + dataId + '"]').remove();
            }
            else {
                reject(new Error(`Response status: ${this.status}`));
            }
        }
        xhr.send();
    });
}