
let curDate = moment().format("MMM Do YYYY"); 
let searHis = JSON.parse(localStorage.getItem("searHis")) || [];


createButtons();
$("#searchBtn").on("click", function(event){
    event.preventDefault();
   
    let city= $("#citySearch").val().trim();
    console.log(city);
    
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=119090b7f3bb3a2c44906450f645dd9a"; let fiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&APPID=119090b7f3bb3a2c44906450f645dd9a";
 
    if (!searHis.includes(city)) {
        searHis.unshift(city);
       
    }
    localStorage.setItem("searHis", JSON.stringify(searHis));
    createButtons();


    
$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
   
      let latitude = response.coord.lat;
      let longitude = response.coord.lon;
    let cityImg = $("<img>");
    cityImg.attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png");
    $("#city-pic").empty().append(cityImg);
    $("#city").empty().append(" " + response.name + " " + "(" + curDate + ") ");
    $("#temp").empty().append(" " + Math.floor(response.main.temp) + " F");
    $("#humidity").empty().append(" " + response.main.humidity + "%");
    $("#wind").empty().append(" " + response.wind.speed + " MPH");
    let uvIndex = "https://api.openweathermap.org/data/2.5/uvi?appid=119090b7f3bb3a2c44906450f645dd9a&" + "lat=" + latitude + "&lon=" + longitude ;
      
    $.ajax({
        url: uvIndex,
        method: "GET"
      }).then(function(uvResponse) {
        
          let uvText = $("<span>");
          uvText.text(uvResponse.value);
          $("#uv").empty().append(uvText);
          if (uvResponse.value > 9) {
          uvText.attr("class", "high")
          } else if (uvResponse.value < 4) {
            uvText.attr("class", "low")
        } else {
            uvText.attr("class", "medium")
        }
      })
  })
  $.ajax({
    url: fiveDay,
    method: "GET"
  }).then(function(data) {
  
        for (let i = 0; i < 5; i++ ) {
            $("#day" + i).empty();
            let dateForecast = $("<p>");
            dateForecast.text(moment().add(i + 1, 'days').format("MMM Do YYYY"));
            $("#day" + i).append(dateForecast);
            let newImg = $("<img>");
            newImg.attr("src", "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png");
            $("#day" + i).append(newImg);
            let newTemp = $("<p>");
            let tempForecast = data.list[i].main.temp;
            newTemp.text("Temp: " + Math.floor(tempForecast) + " F")
            $("#day" + i).append(newTemp);
            let newHumidity = $("<p>");
            let humidityForecast = data.list[i].main.humidity;
            newHumidity.text("Humidity: " + humidityForecast + "%")
            $("#day" + i).append(newHumidity);

        }

  })

})