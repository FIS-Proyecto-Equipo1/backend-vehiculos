var exp = require('express');
var body_parser = require('body-parser');
var cors = require('cors');
const Vehicle = require('./vehicle');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');


var BASE_API_PATH = "/api/v1";

const options = {
    definition:{
        openapi: '3.0.0',
        info: {
            title: 'Swagger Express API',
            version: '1.0.0'
        },
        basePath: "/api/v1",
        tags:
        {
            name: "Vehiculos",
            description: "Gestion de vehículos"
        }
    },
    apis:['./server.js']
}

const swaggerSpec = swaggerJSDoc(options);
var app = exp();
app.use(body_parser.urlencoded({ extended: false }))
app.use(body_parser.json());
app.use(cors());
 app.use('/api-documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res)  => {
    res.send("<html><body><h1>MY SERVER IS RUNNING</h1></body></html>");
});

/**
 * @swagger
 * 
 * 
 * /api/v1/vehicles:
 *   get:
 *    summary: Listado total de vehiculos
 *    description: Obtiene el listado de vehiculos, con el posible filtrado de las queries
 *    responses:
 *      201:
 *          description: user register successfull
 *      404:
 *          description: no va bro
 *                      
 *     
 */
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

/**
 * @swagger
 * 
 * 
 * /api/v1/vehicles/{matricula}:
 *   get:
 *    summary: Listado total de vehiculos
 *    description: Obtiene el listado de vehiculos, con el posible filtrado de las queries
 *    parameters:
 *      - in: path
 *        name: matricula
 *        description: Identificador del vehiculo
 *        required: true
 *        type: string
 *    responses:
 *      200:
 *          description: user register successfull
 *      404:
 *          description: no va bro
 *                      
 *     
 */
app.get(BASE_API_PATH + "/vehicles/:matricula", (req, res)  => {
    
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
                res.status(200).send(vehicle.cleanId());
            }
        }
    })
});
/**
 * @swagger
 * 
 * /api/v1/vehicles:
 *  post:
 *    summary: Crear una vehiculo
 *    description: 
 *    operationId: createVehiculo
 *    parameters:
 *      - in: header
 *        name: rol
 *        description: Rol del usuario
 *        required: true
 *        type: string
 *      - in: body
 *        name: body
 *        description: Adding a new vehicle to the sistem database
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          properties:
 *              matricula:
 *                  type: string
 *              estado:
 *                  type: string
 *              tipo:
 *                  type: string
 *              permiso:
 *                  type: string
 *              localizacion:
 *                  type: string
 *    consumes:
 *      application/json       
 *    responses:
 *      201:
 *          description: created
 *      500:
 *          description: error de validacion       
 *      
 * 
 */
app.post(BASE_API_PATH + "/vehicles", (req, res)  => {
    // rolCliente = req.header('rol')
    // if (rolCliente !== "ADMIN"){
    //     console.log(Date()+" - Try to post without priviledges");
    //     res.status(403 ).send()
    // }
    // else
    // { 
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
    // }
});

app.put(BASE_API_PATH + "/vehicles/:matricula", (req, res)  => {
    // rolCliente = req.header('rol')
    // if (rolCliente !== "ADMIN"){
    //     console.log(Date()+" - Try to post without priviledges");
    //     res.status(403 ).send()
    // }
    // else
    // { 
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
    // }    
});

 
app.patch(BASE_API_PATH + "/vehicles/:matricula", (req, res)  => {
    rolCliente = req.header('rol')
    if (rolCliente !== "ADMIN"){
        console.log(Date()+" - Try to post without priviledges");
        res.status(403 ).send()
    }
    else
    { 
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
    }    
}); 


app.delete(BASE_API_PATH + "/vehicles/:matricula", (req, res)  => {
    // rolCliente = req.header('rol')
    // if (rolCliente !== "ADMIN"){
    //     console.log(Date()+" - Try to post without priviledges");
    //     res.status(403 ).send()
    // }
    // else
    // { 
        let matricula = req.params.matricula;

        Vehicle.findOneAndDelete({"matricula": matricula}, (err, vehicle_to_delete) => {
            if(err == null && vehicle_to_delete == null)
            {    
                var auxErr = new Error("Vehicle not found " + matricula);
                console.log(Date()+" - "+auxErr);
                res.sendStatus(404);
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
    // }    
});

module.exports =app;