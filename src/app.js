const express = require("express");
const path = require("path");

const port = process.env.PORT || 3000;
const app = express();
const staticPath = path.join(__dirname, "../public");

app.use(express.static(staticPath));
app.set("view engine", "hbs");

const getTime = (time) => {
  const getTime = new Date(time);
  let hours = getTime.getHours();
  let min = getTime.getMinutes();

  if (hours > 12) {
    hours = hours - 12;
  }

  if (min < 10) {
    min = "0" + min;
  }

  return `${hours}:${min}`;
};

const getSrc = (status) => {
  const getTime = new Date();
  let hours = getTime.getHours();
  let iconSrc = "images/clear-day.svg";
  if (status == "Thunderstorm") {
    iconSrc = "/images/thunderstorms.svg";
  } else if (status == "Clouds") {
    iconSrc = "images/cloudy.svg";
  } else if (status == "Clear") {
    if (hours >= 6 && hours <= 18) iconSrc = "/images/clear-day.svg";
    else iconSrc = "/images/clear-night.svg";
  } else if (status == "Rain") {
    iconSrc = "/images/rain.svg";
  } else if (status == "Drizzle") {
    iconSrc = "/images/drizzle.svg";
  } else if (status == "Snow") {
    iconSrc = "/images/snow.svg";
  } else if (status == "Haze") {
    iconSrc = "/images/haze.svg";
  } else if (status == "Fog") {
    iconSrc = "/images/fog.svg";
  } else if (status == "Mist") {
    iconSrc = "/images/mist.svg";
  } else if (status == "Smoke") {
    iconSrc = "/images/smoke.svg";
  } else if (status == "Dust") {
    iconSrc = "/images/dust.svg";
  } else if (status == "Tornado") {
    iconSrc = "/images/tornado.svg";
  }
  return iconSrc;
};

app.get("/", async (req, res) => {
  try {
    let city = req.query.city;
    if (!city) city = "Bhopal";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=9365c6659d7bc66a213dd8657029639d`;
    const data = await fetch(url);
    const objdata = await data.json(data);
    res.render("index", {
      tempstatus: objdata.weather[0].main,
      src: getSrc(objdata.weather[0].main),
      city: objdata.name,
      country: objdata.sys.country,
      temp: objdata.main.temp,
      tempmax: objdata.main.temp_max,
      tempmin: objdata.main.temp_min,
      riseTime: getTime(objdata.sys.sunrise),
      setTime: getTime(objdata.sys.sunset),
      humidity: objdata.main.humidity,
      pressure: objdata.main.pressure,
      speed: objdata.wind.speed,
    });
  } catch (error) {
    res.render("error");
  }
});

app.get("*", (req, res) => {
  res.render("error");
});

app.listen(port, () => {
  console.log(`listening to the server at ${port}`);
});
