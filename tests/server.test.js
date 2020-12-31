const app = require('../index.js');
const request = require('supertest');
const Vehicle = require('../vehicle.js');


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

        beforeAll( () => {
            const vehicles = [
                new Vehicle({"matricula":"2345TGF", "tipo": "Bici", "estado":"DISPONIBLE", "permiso":"No", "localizacion" : "Sevilla" }),
                new Vehicle({"matricula":"2345TGM", "tipo": "Coche", "estado":"TRAYECTO", "permiso":"B", "localizacion" : "Cadiz" }),
                new Vehicle({"matricula":"2345TFF", "tipo": "Moto", "estado":"RESERVADO", "permiso":"AB", "localizacion" : "Malaga" })
            ];

            dbFind = jest.spyOn(Vehicle, "find");
            dbFind.mockImplementation(({}, callback) => {
                callback(null, vehicles);
            })
        })

        it("should return all vehicles", () => {
            return request(app).get('/api/v1/vehicles').then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(3);
                expect(dbFind).toBeCalledWith({}, expect.any(Function));
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
});

