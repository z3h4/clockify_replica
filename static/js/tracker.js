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
            await updateEndTimeAndAppendToTaskList(input.getAttribute('data-time-entry-id'), document.getElementById('taskTimer').innerHTML);
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
                input.setAttribute('data-time-entry-id', time_entry.id);
                resolve("SUCCESS");
            }
            else {
                reject(new Error(`Response status: ${this.status}`));
            }
        }
        const taskId = input.getAttribute('data-id');
        console.log(taskId);
        const projectId = projectDropdownToggle.getAttribute('data-id');

        // xhr.send(JSON.stringify({ projectId: projectId, task_id: taskId, name: input.value}));
    });

}

updateEndTimeAndAppendToTaskList = (timeEntryId, newTime) => {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('post', '/tracker/time_entry/' + timeEntryId +'/update', true);
        xhr.setRequestHeader("X-CSRFToken", document.querySelector("input[name=csrfmiddlewaretoken]").value);
    
        xhr.onload = function() {        
            if (this.status === 200) {
                const response = JSON.parse(xhr.response);
                const time_entry = response.time_entry;
                const new_entries = response.new_entries;
                console.log(response);

                let element = document.createElement("div");
                element.setAttribute('class', 'time-tracker-card');
                element.setAttribute('data-card-id', time_entry.id);
                element.innerHTML = '<div class="time-tracker-card-header"><div class="task-date" style="display: inline-block; width: 20%;"><span>' + new_entries.date + '</span></div></div><div class="time-tracker-card-body"><form class="update-task-name-form" method="post"><div class="task-name-col"><input type="text" value="' + new_entries.task_name + '" data-id=' + time_entry.task_id + 'onfocusout="taskNameChanged(this)" /></div></form><div class="project-name-col"><span>' + new_entries.project_name + '</span></div><div class="task-start-end-time-col"><div class="task-start-time-col"><input type="text" class="task-start-time-input" value="' + new_entries.start_time + '" data-task-start-id=' + time_entry.id + ' /></div><span>-</span><div class="task-end-time-col"><input type="text" class="task-end-time-input" value="' + new_entries.end_time + '" data-task-end-id=' + time_entry.id + ' /></div></div><div class="task-time-col"><input type="text" value="' + new_entries.time_spent + '" readonly data-task-id=' + time_entry.id + ' /></div><div class="task-remove-row"><button class="btn" onclick="onTaskDelete(this)" data-id=' + time_entry.id + '><i class="fa fa-trash"></i></button></div></div>'

                document.getElementById('timeTrackerList').appendChild(element);

                document.getElementById('taskName').querySelectorAll("input")[0].value = '';

                resolve("SUCCESS");
            }
            else {
                reject(new Error(this.status));
            }
        }
        xhr.send(JSON.stringify({ end_time: newTime }));
    });
}

updateStartTime = (timeEntryId, newTime) => {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('post', '/tracker/time_entry/' + timeEntryId +'/update', true);
        xhr.setRequestHeader("X-CSRFToken", document.querySelector("input[name=csrfmiddlewaretoken]").value);
    
        xhr.onload = function() {        
            if (this.status === 200) {
                const response = JSON.parse(xhr.response);
                const time_spent = response.time_spent;
                resolve(time_spent);
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
                const response = JSON.parse(xhr.response);
                const time_spent = response.time_spent;
                resolve(time_spent);
            }
            else {
                reject(new Error(this.status));
            }
        }
        xhr.send(JSON.stringify({ end_time: newTime }));
    });
};

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
                const task_time = await updateStartTime(dataId, newTime);
                this.defaultValue = newTime;
                document.querySelector('[data-task-id="' + dataId + '"]').value = task_time;
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
                const task_time = await updateEndTime(dataId, newTime);
                this.defaultValue = newTime;
                
                document.querySelector('[data-task-id="' + dataId + '"]').value = task_time;
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