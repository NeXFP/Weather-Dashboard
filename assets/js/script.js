//Declare a variable to store the searched city
var city="";
//Variables declaration
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidity= $("#humidity");
var currentWSpeed=$("#wind-speed");
var currentUvindex= $("#uv-index");
var sCity=[];
var cityName = '';

//Searches the city to see if it exists in the entries from the storage
function find(c){
    for (var i=0; i<sCity.length; i++){
        if(c.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}
//Set up the API key
var APIKey="7353173e558858e5d89681b39470b2f6";

function currentWeather(city) {
    var queryUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=7353173e558858e5d89681b39470b2f6'
    $.ajax({
        url:queryUrl,
        method:"GET",
    }).then(function(response) {
        var weathericon= response.weather[0].icon;
        var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        var date=new Date(response.dt*1000).toLocaleDateString();
        //Parse the response for the city name and the date and icon.
        $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">");
        //Variable for converting from kelvin to fahrenheit 
        var tempF = (response.main.temp - 273.15) * 1.8 + 32;
        $(currentTemperature).html((tempF).toFixed(2)+"&#8457");

        //Humidity display
        $(currentHumidity).html(response.main.humidity+"%");

        //Calculation for wind and converting to MPH
        var windSpeed = response.wind.speed;
        var windsMph = (windSpeed*2.237).toFixed(1);
        $(currentWSpeed).html(windsMph + "mph");

        //UV Index display using APPID and coordinates for pulling from local Storage
        UVIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);
        if(response.cod==200){
            sCity=JSON.parse(localStorage.getItem("cityname"));
            if (sCity==null){
                sCity=[];
                sCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(sCity));
                addToList(city);
            }
            else {
                if(find(city)>0){
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }

    });
}
//Displays the curent and future weather to the user after grabbing the city name from the input text box.
function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
        $(searchCity).val("");
    }
};
//Ajax call to pull data from server side api

//Function for returning UV index response.
function UVIndex(ln,lt) {
    var uvURL ="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln
    $.ajax({
        url: uvURL,
        method:"GET"
    }).then(function(response){
        $(currentUvindex).html(response.value);

        $("#uv-index").each(function() {
            if (response.value > 6) {
                $(this).addClass('severe');
                $(this).removeClass('moderate');
                $(this).removeClass('favorable');
            } else if (response.value <= 6 && response.value > 3) {
                $(this).addClass('moderate');
                $(this).removeClass('severe');
                $(this).removeClass('favorable');
            } else {
                $(this).addClass('favorable');
                $(this).removeClass('moderate');
                $(this).removeClass('severe');
            }
        });

    });
}

//Function for displaying 5 day forecast for the user's input city name
function forecast(cityID){
    var forecastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityID+"&appid="+APIKey;
    $.ajax({
        url: forecastURL,
        method:"GET"
    }).then(function(response){
        for (i=0;i<5; i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconcodex= response.list[((i+1)*8)-1].weather[0].icon;
            var iconurl="https://openweathermap.org/img/wn/"+iconcodex+".png";
            var kelvin= response.list[((i+1)*8)-1].main.temp;
            var tempF=(((kelvin-273.5)*1.80)+32).toFixed(2);
            var humidity= response.list[((i+1)*8)-1].main.humidity;
            $("#fDate"+i).html(date);
            $("#fImg"+i).html("<img src="+iconurl+">");
            $("#fTemp"+i).html(tempF+"&#8457");
            $("#fHumidity"+i).html(humidity+"%");
        }
    });
}

function addToList(c){
    var listE1= $("<li>"+c.toUpperCase()+"</li>");
    $(listE1).attr("class", "list-group-item");
    $(listE1).attr("data-value", c.toUpperCase());
    $(".list-group").append(listE1);
}

function invokePast(event){
    var listItem=event.target;
    if (event.target.matches("li")){
        city=listItem.textContent.trim();
        currentWeather(city);
    }
}

function loadlastCity(){
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if(sCity!==null){
        sCity=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<sCity.length;i++){
            addToList(sCity[i]);
        }
        city=sCity[i-1];
        currentWeather(city);
    }

    $("li").each(function() {
        $(this).on("click", function(event) {
            city = $(this)[0].innerHTML;
            if (city) {
                event.preventDefault();
                currentWeather(city);
            }
        });
    });
}

function clearHistory(event){
    event.preventDefault();
    sCity=[];
    localStorage.removeItem("cityname");
    document.location.reload();
}

//Click events
$("#search-button").on("click", displayWeather);
$(document).on("click", invokePast);
$(window).on("load", loadlastCity);
$("#clear-history").on("click", clearHistory);
