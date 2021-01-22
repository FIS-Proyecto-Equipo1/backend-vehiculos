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
 *      200:
 *          description: user register successfull
 *      500:
 *          description: error interno
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
 *          description: no encontrado
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



app.post(BASE_API_PATH + "/vehicles", (req, res)  => {
/**
 * @swagger
 * 
 * /api/v1/vehicles:
 *  post:
 *    summary: Crear una vehiculo
 *    consumes: 
 *      - application/json
 *    parameters: 
 *      - in: "header"
 *        name: "rol"
 *        description: "Rol del usuario"
 *        required: true
 *        type: string
 *    requestBody:
 *      content:
 *            application/json:
 *               schema:
 *                  type: object
 *                  properties:
 *                     matricula:
 *                       type: string
 *                       required: true
 *                     estado:
 *                       type: string
 *                     tipo:
 *                       type: string
 *                     permiso:
 *                       type: string
 *                     localizacion:
 *                       type: string       
 *    responses:
 *      201:
 *          description: created
 *      500:
 *          description: error de validacion       
 */
    // rolCliente = req.header('rol')
    // if (rolCliente !== "ADMIN"){
    //     console.log(Date()+" - Try to post without priviledges");
    //     res.status(403 ).send()
    // }
    // else
    // { 
        var veh = req.body;  
        console.log(req.body);      
        Vehicle.create(veh, (err) => {
            if(err)
            {
                console.log(Date()+" - "+ err);
                res.sendStatus(500);
            }else{
                console.log(Date() + " POST /vehicles")
                res.status(201).send({"vehicle":veh});
            }
        });
    // }
});

/**
 * @swagger
 * 
 * 
 * /api/v1/vehicles/{matricula}:
 *  put:
 *    summary: "Modifica todos los campos un vehiculo"
 *    description: "Modifica toda la informacion del vehiculo indicado en el path"
 *    operationId: "ModificarTodoVehiculo"
 *    parameters:
 *      - in: "path"
 *        name: "matricula"
 *        description: "Identificador del vehiculo"
 *        required: true
 *        type: string
 *      - in: "header"
 *        name: "rol"
 *        description: "Rol del usuario"
 *        required: true
 *        type: string  
 *    requestBody:
 *      content:
 *            application/json:
 *              name: "body"
 *              description: "Nuevos valores del vehiculo"
 *              required: true
 *              schema:
 *                  type: object
 *                  properties:
 *                      matricula:
 *                          type: string
 *                      estado:
 *                          type: string
 *                      tipo:
 *                          type: string
 *                      permiso:
 *                          type: string
 *                      localizacion:
 *                          type: string
 *    consumes:
 *      "application/json"
 *    produces:
 *      "application/json"
 *    responses:
 *      "200":
 *        description: "Operación satisfactoria"
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
 *      "404":
 *        description: "No encontrada"
 *        
 */
app.put(BASE_API_PATH + "/vehicles/:matricula", (req, res)  => {
    // rolCliente = req.header('rol')
    // if (rolCliente !== "ADMIN"){
    //     console.log(Date()+" - Try to put without priviledges");
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

/**
 * @swagger
 * 
 * 
 * /api/v1/vehicles/{matricula}:
 *  patch:
 *    summary: "Modifica uno o mas campos un vehiculo"
 *    description: "Modifica uno o mas campos del vehiculo indicado en el path"
 *    operationId: "ModificarAlgoVehiculo"
 *    parameters:
 *      - in: "path"
 *        name: "matricula"
 *        description: "Identificador del vehiculo"
 *        required: true
 *        type: string
 *      - in: "header"
 *        name: "rol"
 *        description: "Rol del usuario"
 *        required: true
 *        type: string  
 *    requestBody:
 *      content:
 *            application/json:
 *              name: "body"
 *              description: "Nuevos valores del vehiculo"
 *              required: true
 *              schema:
 *                  type: object
 *                  properties:
 *                      matricula:
 *                          type: string
 *                      estado:
 *                          type: string
 *                      tipo:
 *                          type: string
 *                      permiso:
 *                          type: string
 *                      localizacion:
 *                          type: string
 *    consumes:
 *      "application/json"
 *    produces:
 *      "application/json"
 *    responses:
 *      "200":
 *        description: "Operación satisfactoria"
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
 *      "404":
 *        description: "No encontrada"
 *        
 */ 
app.patch(BASE_API_PATH + "/vehicles/:matricula", (req, res)  => {
    rolCliente = req.header('rol')
    if (rolCliente !== "ADMIN"){
        console.log(Date()+" - Try to patch without priviledges");
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

/**
 * @swagger
 * 
 * /api/v1/vehicles/{matricula}:
 *  delete:
 *    summary: "Eliminar un vehiculo del sistema"
 *    description: "Eliminar un vehiculo del sistema"
 *    operationId: "deleteVehiculo"
 *    parameters:
 *      - in: "path"
 *        name: "matricula"
 *        description: "Identificador del vehiculo"
 *        required: true
 *        type: string
 *      - in: "header"
 *        name: "rol"
 *        description: "Rol del usuario"
 *        required: true
 *        type: string
 *    consumes:
 *      "application/json"
 *    produces:
 *      "application/json"
 *    responses:
 *      "200":
 *        description: "Operación satisfactoria"
 *        schema:
 *          $ref: "#/definitions/Vehiculo"
 *      "404":
 *        description: "No encontrada"
*/
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