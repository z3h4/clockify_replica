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