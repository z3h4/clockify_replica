ontrackerNavBarClick = (e) => {
    e.preventDefault();
    window.history.pushState("", "", '/tracker');
    showTrackerView();
}

ondashBoardNavBarClick = (e) => {
    e.preventDefault();
    window.history.pushState("", "", '/dashboard');

    // Get data and plot with new data
    getDataToDisplay()

    showDashBoard();
}

showTrackerView = () => {
    document.getElementById('trackerContainer').style.display = 'block';
    document.getElementById('svgContainer').style.display = 'none';

    document.getElementById('trackerNavBar').className = 'active';
    document.getElementById('dashBoardNavBar').classList.remove('active');

}

showDashBoard = (e) => {
    document.getElementById('trackerContainer').style.display = 'none';
    document.getElementById('svgContainer').style.display = 'block';

    document.getElementById('trackerNavBar').classList.remove('active');
    document.getElementById('dashBoardNavBar').className = 'active';
}

document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.match(/dashboard/))       
        showDashBoard();
});