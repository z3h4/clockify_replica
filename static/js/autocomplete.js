var taskList = [];
var autocomplete_results;
const input = document.getElementById('taskName').querySelectorAll("input")[0];

getTaskList = () => {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('get', '/tracker/task_list', true);
    
        xhr.onload = function() {
            if (this.status === 200) {
                let taskItems = [];
                const response = JSON.parse(xhr.response);
                for (let res of response.tasks)
                    taskItems.push({id: res.id, name: res.name});
                resolve(taskItems);
            }
            else {
                reject(new Error(`Response status: ${this.status}`));
            }
        }
        xhr.send();
    });
}
 
popupClearAndHide = () => {
    autocomplete_result.innerHTML = "";
    autocomplete_result.style.display = "none";
}

autocomplete = (val) => {
    let item_return = [];
    if (val.length === 0) 
        return taskList;
  
    for (i = 0; i < taskList.length; i++) {
      if (val.toLowerCase() === taskList[i].name.slice(0, val.length).toLowerCase()) {
        item_return.push(taskList[i]);
      }
    }
  
    return item_return;
}
  
filterData = (input_val) => {
    autocomplete_results = document.getElementById("autocomplete_result");
    autocomplete_results.innerHTML = '';
    
    let items_to_show = autocomplete(input_val);
    
    for (i = 0; i < items_to_show.length; i++) {
        let element = document.createElement("p");
        element.setAttribute('data-id', items_to_show[i].id);
        element.innerHTML = items_to_show[i].name;

        element.addEventListener("click", function(e) {
            input.value = this.innerText;
            popupClearAndHide();

            input.setAttribute('data-id', this.getAttribute('data-id'));
            // Start the timer
            startButton.click();
        });

        autocomplete_results.appendChild(element);
    }
    autocomplete_results.style.display = 'block';
}

onKeyUp = function(e) {
    let input_val = this.value; 
    filterData(input_val);
}

initAutocompleteList = async() => {
    try {
        taskList = await getTaskList();        
    }
    catch (ex) {
        console.log("Error getting Project List", ex);
    }
}

input.addEventListener("keyup", onKeyUp);

input.addEventListener('click', function() {
    let input_val = this.value; 
    filterData(input_val);
});

document.addEventListener("click", function (e) {
    if (autocomplete_results !== e.target && input !== e.target) {    
        popupClearAndHide();
    }
});

initAutocompleteList();