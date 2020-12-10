var exp = require('express');
var body_parser = require('body-parser');
var DataStore = require('nedb');

var port = 3000;
var BASE_API_PATH = "/api/v1";
var DB_FILE_NAME = __dirname + '/vehicles.json';

console.log("Starting api server... ");

var app = exp();
app.use(body_parser.json());
var db = new DataStore({
    filename : DB_FILE_NAME,
    autoload : true
});

app.get("/", (req, res)  => {
    res.send("<html><body><h1>MY SERVER IS RUNNING</h1></body></html>");
});

app.get(BASE_API_PATH + "/vehicles", (req, res)  => {
    console.log(Date() + "GET/vehicles")
    res.send(vehicles);
});

app.post(BASE_API_PATH + "/vehicles", (req, res)  => {
    console.log(Date() + "POST /vehicles")
    var veh = req.body;
    db.insert(veh, (err) => {
        if(err)
        {
            console.log(Date()+" - "+ err);
            res.send(500);
        }else{
            res.sendStatus(201);
        }
    });
});

app.listen(port);
console.log("Server ready!");
