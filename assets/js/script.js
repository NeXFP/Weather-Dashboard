// Display date in local format
var date = moment().format("l")

// Display daily weather information
function displayWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=81481b28398acfb07db612f9d04e7e45"
    // AJAX call to OpenWeather
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        $("#name").html("<h2>" + response.name + " " + date + "</h2>")
        $("#temp").html("<p> Temperature: " + response.main.temp + "°F")
        $("#humidity").html("<p> Humidity: " + response.main.humidity + "%</p>")
        $("#wind").html("<p> Wind Speed: " + response.wind.speed + " MPH</p>")

        // Conditional statements that determine what icons are shown
        var main = response.weather[0].main
        if (main === "Rain") {
            var icon = $("<img>").attr("src", "http://openweathermap.org/img/wn/09d.png")
            $("#img").html(icon)
        }
        else if (main === "Clear") {
            var icon = $("<img>").attr("src", "http://openweathermap.org/img/wn/01d.png")
            $("#img").html(icon)
        }
        else if (main === "Mist") {
            var icon = $("<img>").attr("src", "http://openweathermap.org/img/wn/50d.png")
            $("#img").html(icon)
        }
        else if (main === "Clouds") {
            var icon = $("<img>").attr("src", "http://openweathermap.org/img/wn/03d.png")
            $("#img").html(icon)
        }
        else if (main === "Snow") {
            var icon = $("<img>").attr("src", "http://openweathermap.org/img/wn/13d.png")
            $("#img").html(icon)
        }
        else if (main === "Drizzle") {
            var icon = $("<img>").attr("src", "http://openweathermap.org/img/wn/10d.png")
            $("#img").html(icon)
        }

        var lat = response.coord.lat
        var lon = response.coord.lon

        var uvURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=81481b28398acfb07db612f9d04e7e45&lat=" + lat + "&lon=" + lon

}