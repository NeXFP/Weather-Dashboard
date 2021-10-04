
//Declare a variable to store the searched city
var city="";
//Variables declaration
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty= $("#humidity");
var currentWSpeed=$("#wind-speed");
var currentUvindex= $("#uv-index");
var sCity=[];


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
//Displays the curent and future weather to the user after grabbing the city name from the input text box.
function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}
//Ajax call to pull data from server side api
function generateCoordinates() {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=7353173e558858e5d89681b39470b2f6'
    $.ajax({
        url:apiUrl,
        method:"GET",
    }).then(function(response) {

        console.log(response);
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
        currentUvindex(response.coord.long,respond.coord.lati);
        forecast(response.id);
        UVIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);
        if(response.cod==200){
            sCity=JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
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