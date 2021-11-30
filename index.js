const http = require('http');
const fs = require('fs');
const requests = require('requests');
const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=udhampur&appid=6e9705c3732e540417ff2b4657c45096")
            .on('data', function (chunk) {
                const objData = JSON.parse(chunk);
                const arrayData = [objData];
                // console.log(arrayData[0].main.temp);
                const realTimeData = arrayData.map((val) => replaceVal(homeFile, val))
                .join("");
                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);

                // console.log('end');
            });
    }
});

server.listen(7000, "127.0.0.1");