var projectList;
var dropdownContainer = document.getElementById('dropdownContent');

getProjectList = () => {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('get', '/tracker/project_list', true);
        
        xhr.onload = function() {
            let projectItems = [];
            if (this.status === 200) {
                const response = JSON.parse(xhr.response);
                for (let res of response.projects)
                    projectItems.push({id: res.id, name: res.name});
                resolve(projectItems);
            }
            else {
                reject(new Error(`Response status: ${this.status}`));
            }
        }
        xhr.send();
    });
}

populateDropdown = () => {    
    for (i = 0; i < projectList.length; i++) {
        let element = document.createElement("a");
        element.setAttribute('href',"");
        element.setAttribute('data-id', projectList[i].id);
        element.innerHTML = projectList[i].name;

        element.addEventListener("click", function(e) {
            e.preventDefault();

            document.getElementById('projectDropdownToggle').innerHTML = this.innerText;
            document.getElementById('projectDropdownToggle').setAttribute('data-id', this.getAttribute('data-id'));
            
            hideDropdown();
        });

        dropdownContainer.appendChild(element);
    }
}

showDropdown = (e) => {
    e.preventDefault();
    dropdownContainer.style.display = 'block';
}

hideDropdown = () => {
    dropdownContainer.style.display = "none";
}

initDropdownList = async() => {
    try {
        projectList = await getProjectList();
        
        document.getElementById('projectDropdownToggle').innerHTML = projectList[0].name;
        document.getElementById('projectDropdownToggle').setAttribute('data-id', projectList[0].id);
        
        populateDropdown()
    }
    catch (ex) {
        console.log("Error getting Project List", ex);
    }
}

document.addEventListener("click", function (e) {
    var container = document.getElementsByClassName('project-name-container')[0];

    if (container !== e.target && !container.contains(e.target)) {
        hideDropdown();
    }
});

initDropdownList();