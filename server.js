var exp = require('express');
var body_parser = require('body-parser');
var cors = require('cors');
const Vehicle = require('./vehicle');

var BASE_API_PATH = "/api/v1";



var app = exp();
app.use(body_parser.urlencoded({ extended: false }))
app.use(body_parser.json());
app.use(cors());

app.get("/", (req, res)  => {
    res.send("<html><body><h1>MY SERVER IS RUNNING</h1></body></html>");
});

app.get(BASE_API_PATH + "/vehicles", (req, res)  => {
    Vehicle.find(req.query, (err, vehicles) => {
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
    /*
    idCliente = req.header('x-user')
    if (idCliente){
        toda la peticion
   }else{
       res.status(400).send()
   }*/

    Vehicle.findOne({"matricula": req.params.matricula}, (err, vehicle) => {
        if(err){
            console.log(Date()+" - "+ err);
            res.sendStatus(500);
        }else{
            if(vehicle == null){
                console.log(Date() + " GET /vehicles/ "+req.params.matricula +" - Invalid");
                res.sendStatus(404);
            }
            else    
            {
                console.log(Date() + " GET /vehicles/ "+req.params.matricula);
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
    let update_vehicle = req.body;
    Vehicle.findOneAndUpdate({"matricula": matricula}, update_vehicle, { runValidators: true }, (err, vehicle_update) => {
        if(err == null && vehicle_update == null)
        {    
            var auxErr = new Error("Vehicle not found " + matricula);
            console.log(Date()+" - "+auxErr);
            res.sendStatus(404)
        }
        else if(err)
        {    
            console.log(Date()+" - "+err);
            res.sendStatus(500);
        }else
        {
            console.log(Date() + " PUT /vehicles/" + matricula);
            res.status(200).send({vehicle : vehicle_update, body: req.body});
        }                                                                     
                                                                              
    });
});

 
app.patch(BASE_API_PATH + "/vehicles/:matricula", (req, res)  => {
    let matricula = req.params.matricula;
    Vehicle.findOneAndUpdate({"matricula": matricula}, req.body, { runValidators: true }, (err, vehicle_update) => {
        if(err == null && vehicle_update == null)
        {    
            var auxErr = new Error("Vehicle not found " + matricula);
            console.log(Date()+" - "+auxErr);
            res.sendStatus(404)
        }
        else if(err)
        {    
            console.log(Date()+" - "+err);
            res.sendStatus(500)
        }else
        {
            console.log(Date() + " PATCH /vehicles/" + matricula);
            res.status(200).send({vehicle : vehicle_update}); //envia la informacion del viejo no del nuevo
        }
    });
}); 


app.delete(BASE_API_PATH + "/vehicles/:matricula", (req, res)  => {
    let matricula = req.params.matricula;

    Vehicle.findOneAndDelete({"matricula": matricula}, (err, vehicle_to_delete) => {
        if(err == null && vehicle_to_delete == null)
        {    
            var auxErr = new Error("Vehicle not found " + matricula);
            console.log(Date()+" - "+auxErr);
            res.sendStatus(404)
        }
        else if(err)
        {    
            console.log(err);
            res.sendStatus(500)
        }else
        {
            console.log(Date() + " DELETE /vehicles/" + matricula)
            res.status(204).send({message : "Vehicle " + matricula+ " removed"});
        }
    });
});

module.exports =app;