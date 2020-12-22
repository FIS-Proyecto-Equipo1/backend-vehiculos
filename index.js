var exp = require('express');
var body_parser = require('body-parser');
var cors = require('cors');


const dbConnect = require('./db');
const Vehicle = require('./vehicle');

var port = (process.env.PORT || 3000);
var BASE_API_PATH = "/api/v1";

console.log("Starting api server... ");



var app = exp();
app.use(body_parser.json());
app.use(cors());
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
);

app.get("/", (req, res)  => {
    res.send("<html><body><h1>MY SERVER IS RUNNING</h1></body></html>");
});

app.get(BASE_API_PATH + "/vehicles", (req, res)  => {
    Vehicle.find({}, (err, vehicles) => {
        if(err){
            console.log(Date()+" - "+ err);
            res.sendStatus(500);
        }else{
            console.log(Date() + " GET /vehicles")
            res.send(vehicles.map((vehicle) => {
                return vehicle.cleanId();}));
        }
    })
});

app.get(BASE_API_PATH + "/vehicles/:matricula", (req, res)  => {
    Vehicle.findOne({"matricula": req.params.matricula}, (err, vehicle) => {
        if(err){
            console.log(Date()+" - "+ err);
            res.sendStatus(500);
        }else{
            if(vehicle == null){
                console.log(Date() + " GET /vehicles/"+req.params.matricula +" - Invalid");
                res.sendStatus(404);
            }
            else    
            {
                console.log(Date() + " GET /vehicles/"+req.params.matricula);
                res.send(vehicle.cleanId());
            }
        }
    })
});

app.post(BASE_API_PATH + "/vehicles", (req, res)  => {
    var veh = req.body;
    Vehicle.create(veh, (err) => {
        if(err)
        {
            console.log(Date()+" - "+ err);
            res.sendStatus(500);
        }else{
            console.log(Date() + " POST /vehicles")
            res.sendStatus(201);
        }
    });
});

app.put(BASE_API_PATH + "/vehicles/:matricula", (req, res)  => {
    let matricula = req.params.matricula;
    let update_info = req.body;

    Vehicle.findOneAndUpdate({"matricula": matricula}, update_info, (err, vehicle_update) => {
        if(err)
        {    
            console.log(err);
            res.sendStatus(500)
        }else
        {
            console.log(Date() + " PUT /vehicles/" + matricula)
            res.status(200).send({vehicle : vehicle_update}); //envia la informacion del viejo no del nuevo
        }
    });
});

app.delete(BASE_API_PATH + "/vehicles/:matricula", (req, res)  => {
    let matricula = req.params.matricula;

    Vehicle.findOneAndDelete({"matricula": matricula}, (err) => {
        if(err)
        {    
            console.log(err);
            res.sendStatus(500)
        }else
        {
            console.log(Date() + " DELETE /vehicles/" + matricula)
            res.status(200).send({message : "Vehicle " + matricula+ " removed"}); 
        }
    });
});

module.exports =app;
