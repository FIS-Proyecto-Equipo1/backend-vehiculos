const app = require('../server.js');
const request = require('supertest');
const Vehicle = require('../vehicle.js');

jest.setTimeout(30000);

describe("hello world tests", () => {

    it("should do a mock test", () => {
        var a = 3;
        var b = 5;
        const sum = a +b;

        expect(sum).toBe(8);
    })

})

describe("VEhicles API", () => {


    describe("GET /", () => {
        it("should return html", () => {
            return request(app).get("/").then((response) => {
                expect(response.status).toBe(200);
                expect(response.type).toEqual(expect.stringContaining("html"));
                expect(response.text).toEqual(expect.stringContaining("h1"));
            });
        });
    });

    describe("GET /vehicles", () => {
        let dbFind;
        let dbFindOne;
        let vehicleOK;

        beforeAll( () => {
            const vehicles = [
                new Vehicle({"matricula":"2345TGF", "tipo": "Bici", "estado":"DISPONIBLE", "permiso":"No", "localizacion" : "Sevilla" }),
                new Vehicle({"matricula":"2345TGM", "tipo": "Coche", "estado":"TRAYECTO", "permiso":"B", "localizacion" : "Cadiz" }),
                new Vehicle({"matricula":"2345TFF", "tipo": "Moto", "estado":"RESERVADO", "permiso":"AB", "localizacion" : "Malaga" })
            ];

            dbFind = jest.spyOn(Vehicle, "find");
            dbFind.mockImplementation(({}, callback) => {
                callback(null, vehicles);
            });

            vehicleOK = vehicles[0];

            dbFindOne = jest.spyOn(Vehicle, "findOne");
            dbFindOne.mockImplementation((filter, callback) => {
                callback(null, vehicleOK);
            });

        });

        it("should return all vehicles", () => {
            return request(app).get('/api/v1/vehicles').then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(3);
                expect(dbFind).toBeCalledWith({}, expect.any(Function));
            });            
        })

        it("should return one vehicle", () => {
            return request(app).get('/api/v1/vehicles/'+vehicleOK.matricula).then((response) => {
                expect(response.statusCode).toBe(200);
                expect(String(response.body)).toMatch(String(vehicleOK.cleanId()));
                expect(dbFindOne).toBeCalledWith({"matricula":vehicleOK.matricula}, expect.any(Function));
            });
        })

        it("should not return any vehicle", () => {
            dbFindOne.mockImplementation((filter, callback) => {
                callback(null, null);
            })
            return request(app).get('/api/v1/vehicles/5645TGF').then((response) => {
                expect(response.statusCode).toBe(404);
                expect(dbFindOne).toBeCalledWith({"matricula":"5645TGF"}, expect.any(Function));
            });
        })
    });

    describe("POST /vehicles", () => {
        const vehicle = {"matricula":"2345TGF", "tipo": "Moto", "estado":"RESERVADO", "permiso":"AB", "localizacion" : "Malaga" }
        let dbInsert;
         
        beforeEach(() => {
            dbInsert = jest.spyOn(Vehicle, "create");
        })


        it ("should add a new vehicle", () => {
           dbInsert.mockImplementation((c, callback) => {
               callback(false);
           });

           return request(app).post('/api/v1/vehicles').send(vehicle).then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbInsert).toBeCalledWith(vehicle, expect.any(Function));
           });

        });

        it('should return 500 if any error occurred', ()=>{
            dbInsert.mockImplementation((c, callback) => {
                callback(true);
            });

            return request(app).post('/api/v1/vehicles').send(vehicle).then((response) => {
                expect(response.statusCode).toBe(500);
           });
        });
    });

    describe("DELETE /vehicles/:id", () => {
        let dbDelete;
        let vehicleOK;

        beforeAll( () => {
            const vehicles = [
                new Vehicle({"matricula":"2345TGF", "tipo": "Bici", "estado":"DISPONIBLE", "permiso":"No", "localizacion" : "Sevilla" }),
                new Vehicle({"matricula":"2345TGM", "tipo": "Coche", "estado":"TRAYECTO", "permiso":"B", "localizacion" : "Cadiz" }),
                new Vehicle({"matricula":"2345TFF", "tipo": "Moto", "estado":"RESERVADO", "permiso":"AB", "localizacion" : "Malaga" })
            ];
            
            vehicleOK = vehicles[0];

            dbDelete = jest.spyOn(Vehicle, "findOneAndDelete");
            dbDelete.mockImplementation(({}, callback) => {
                callback(null, vehicleOK);
            });
        });

        it('should delete and return one vehicle', ()=>{
            return request(app).delete('/api/v1/vehicles/'+vehicleOK.matricula).then((response) => {
                expect(response.statusCode).toBe(204);
                expect(String(response.body)).toMatch(String(vehicleOK.cleanId()));
                expect(dbDelete).toBeCalledWith({"matricula":vehicleOK.matricula}, expect.any(Function));
           });
        });

        it('should not delete any vehicle', ()=>{
            dbDelete.mockImplementation(({}, callback) => {
                callback(null, null);
            });
            return request(app).delete('/api/v1/vehicles/5642KIL').then((response) => {
                expect(response.statusCode).toBe(404);
                expect(String(response.body)).toMatch(String({}));
                expect(dbDelete).toBeCalledWith({"matricula":"5642KIL"}, expect.any(Function));
           });
        });
    });

    describe("PUT /vehicles/:id", () => {
        let dbPut;
        let vehicleOK;
        let vehicleUp;
        
        beforeAll( () => {
            const vehicles = [
                new Vehicle({"matricula":"2345TGF", "tipo": "Bici", "estado":"DISPONIBLE", "permiso":"No", "localizacion" : "Sevilla" }),
                new Vehicle({"matricula":"2345TGM", "tipo": "Coche", "estado":"TRAYECTO", "permiso":"B", "localizacion" : "Cadiz" }),
                new Vehicle({"matricula":"2345TFF", "tipo": "Moto", "estado":"RESERVADO", "permiso":"AB", "localizacion" : "Malaga" })
            ];
            
            vehicleOK = vehicles[0];
            vehicleUp =  new Vehicle({"matricula":"2345TGF", "tipo": "Moto", "estado":"RESERVADO", "permiso":"AB", "localizacion" : "Malaga" });
            
            dbPut = jest.spyOn(Vehicle, "findOneAndUpdate");
            dbPut.mockImplementation((filter, update_vehicle, validators, callback) => {
                callback(null, vehicleUp);
            });
        });

        it('should modify and return one vehicle', ()=>{
            return request(app).put('/api/v1/vehicles/'+vehicleOK.matricula).send(vehicleUp).then((response) => {
                expect(response.statusCode).toBe(200);
                expect(String(response.body)).toMatch(String(vehicleOK.cleanId()));
                expect(dbPut).toBeCalledWith({"matricula":vehicleOK.matricula}, expect.any(Object), {"runValidators": true} ,expect.any(Function));
           });
        });

        it('should not modify any vehicle', ()=>{
            dbPut.mockImplementation((filter, update_vehicle, validators, callback) => {
                callback(null, null);
            });

            return request(app).put('/api/v1/vehicles/'+vehicleOK.matricula+"2").send(vehicleUp).then((response) => {
                expect(response.statusCode).toBe(404);
                expect(dbPut).toBeCalledWith({"matricula":vehicleOK.matricula}, expect.any(Object), {"runValidators": true} ,expect.any(Function));
           });
        });

    });

    describe("PATCH /vehicles/:id", () => {
        let dbPatch;
        let vehicleOK;
        let vehicleUp;

        beforeAll( () => {
            const vehicles = [
                new Vehicle({"matricula":"2345TGF", "tipo": "Bici", "estado":"DISPONIBLE", "permiso":"No", "localizacion" : "Sevilla" }),
                new Vehicle({"matricula":"2345TGM", "tipo": "Coche", "estado":"TRAYECTO", "permiso":"B", "localizacion" : "Cadiz" }),
                new Vehicle({"matricula":"2345TFF", "tipo": "Moto", "estado":"RESERVADO", "permiso":"AB", "localizacion" : "Malaga" })
            ];
            
            vehicleOK = vehicles[0];
            vehicleUp =  {"estado":"RESERVADO", "localizacion" : "Ginebra" };
            
            dbPatch = jest.spyOn(Vehicle, "findOneAndUpdate");
            dbPatch.mockImplementation((filter, update_vehicle, validators, callback) => {
                callback(null, vehicleOK);
            });
        });

        it('should be forbidden without rol admin', ()=>{
            return request(app).patch('/api/v1/vehicles/'+vehicleOK.matricula).send(vehicleUp).then((response) => {
                expect(response.statusCode).toBe(403);
            });
        });
        
        it('should modify some info and return one vehicle', ()=>{
            return request(app).patch('/api/v1/vehicles/'+vehicleOK.matricula).set({rol:"ADMIN"}).send(vehicleUp).then((response) => {
                expect(response.statusCode).toBe(200);
                expect(String(response.body)).toMatch(String(vehicleOK.cleanId()));
                expect(dbPatch).toBeCalledWith({"matricula":vehicleOK.matricula}, expect.any(Object), {"runValidators": true} ,expect.any(Function));
           });
        });

        it('should not modify anything', ()=>{
            dbPatch.mockImplementation((filter, update_vehicle, validators, callback) => {
                callback(null, null);
            });
            return request(app).patch('/api/v1/vehicles/'+vehicleOK.matricula+"2").set({rol:"ADMIN"}).send(vehicleUp).then((response) => {
                expect(response.statusCode).toBe(404);
            });
        });

    });
});

