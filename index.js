var exp = require('express');
var body_parser = require('body-parser');
var port = 3000;
var BASE_API_PATH = "/api/v1";

console.log("Starting api server... ");

var vehicles = [
    {
        "id":"1",
        "tipo":"bicicleta",
        "estado":"RESERVADO",
        "permiso":"NO_REQ",
        "localizacion":"av la palmera, sevilla"
    },
    {
        "id":"2",
        "tipo":"bicicleta",
        "estado":"RESERVADO",
        "permiso":"NO_REQ",
        "localizacion":"av la palmera, sevilla"
    },
    {
        "id":"3",
        "tipo":"coche",
        "estado":"DISPONIBLE",
        "permiso":"B",
        "localizacion":"giralda , sevilla"
    },
    {
        "id":"4",
        "tipo":"moto",
        "estado":"DISPONIBLE",
        "permiso":"AB",
        "localizacion":"sevilla"
    }
];

var app = exp();
app.use(body_parser.json());

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
    vehicles.push(veh);
    res.sendStatus(201);
});

app.listen(port);
console.log("Server ready!");
