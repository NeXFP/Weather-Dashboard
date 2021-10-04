
//Declare a variable to store the searched city
var city="";
// variable declaration
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty= $("#humidity");
var currentWSpeed=$("#wind-speed");
var currentUvindex= $("#uv-index");
var sCity=[];
// searches the city to see if it exists in the entries from the storage
function find(c){
    for (var i=0; i<sCity.length; i++){
        if(c.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}
//Set up the API key
var APIKey="a0aca8a89948154a4182dcecc780b513";
// Display the curent and future weather to the user after grabbing the city form the input text box.
function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}
//Clear the search history from the page
function clearHistory(event){
    event.preventDefault();
    sCity=[];
    localStorage.removeItem("cityname");
    document.location.reload();

}
//Click Handlers
$("#search-button").on("click",displayWeather);
$(document).on("click",invokePastSearch);
$(window).on("load",loadlastCity);
$("#clear-history").on("click",clearHistory);