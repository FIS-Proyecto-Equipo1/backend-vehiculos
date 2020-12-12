var exp = require('express');
var body_parser = require('body-parser');


const dbConnect = require('./db');
const Vehicle = require('./vehicle');

var port = (process.env.PORT || 3000);
var BASE_API_PATH = "/api/v1";
var DB_FILE_NAME = __dirname + '/vehicles.json';

console.log("Starting api server... ");



var app = exp();
app.use(body_parser.json());
//var db = new DataStore({
//    filename : DB_FILE_NAME,
//    autoload : true
//});

dbConnect().then(
    () => {
        app.listen(port);
        console.log("Server ready!");
    }, err => {
        console.log("Connection error "+ err);
    }
)

app.get("/", (req, res)  => {
    res.send("<html><body><h1>MY SERVER IS RUNNING</h1></body></html>");
});

app.get(BASE_API_PATH + "/vehicles", (req, res)  => {
    console.log(Date() + " GET /vehicles")
    Vehicle.find({}, (err, vehicles) => {
        if(err){
            console.log(Date()+" - "+ err);
            res.sendStatus(500);
        }else{
            res.send(vehicles.map((vehicle) => {
                return vehicle.cleanId();}));
        }
    })
});

app.post(BASE_API_PATH + "/vehicles", (req, res)  => {
    console.log(Date() + " POST /vehicles")
    var veh = req.body;
    Vehicle.create(veh, (err) => {
        if(err)
        {
            console.log(Date()+" - "+ err);
            res.sendStatus(500);
        }else{
            res.sendStatus(201);
        }
    });
});

module.exports =app;
