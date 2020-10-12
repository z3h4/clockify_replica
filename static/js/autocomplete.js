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
                    taskItems.push(res.name);
                resolve(taskItems);
            }
            else {
                reject(new Error(this.status));
            }
        }
        xhr.send();
    });
}

 
function popupClearAndHide() {
    autocomplete_result.innerHTML = "";
    autocomplete_result.style.display = "none";
}

function autocomplete(val) {
    let item_return = [];
  
    for (i = 0; i < taskList.length; i++) {
      if (val.toLowerCase() === taskList[i].slice(0, val.length).toLowerCase()) {
        item_return.push(taskList[i]);
      }
    }
  
    return item_return;
}
  
filterData = (input_val) => {
    if (input_val.length > 0) {
        autocomplete_results = document.getElementById("autocomplete_result");
        autocomplete_results.innerHTML = '';
        
        let items_to_show = autocomplete(input_val);
        
        for (i = 0; i < items_to_show.length; i++) {
            let element = document.createElement("P");
            element.innerHTML = items_to_show[i];

            element.addEventListener("click", function(e) {
                e.stopPropagation();
                
                input.value = this.innerText;
                popupClearAndHide();

                // Start the timer
                startButton.click();
            });

            autocomplete_results.appendChild(element);
    
        }
        autocomplete_results.style.display = 'block';
    } 
    else {
        popupClearAndHide();
    }
}

onKeyUp = function(e) {
    input_val = this.value; 
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

document.addEventListener("click", function (e) {
    if (autocomplete_results !== e.target) {    
        popupClearAndHide();
    }
});

initAutocompleteList();