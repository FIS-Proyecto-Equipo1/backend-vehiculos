const app = require('../index.js');
const Vehiculo = require('../vehicle.js');
const request = require('supertest');


describe("Hello world tests", () => {

    it("Should do an stupid test", () => {
        const a = 5;
        const b = 3;
        
        const sum = a + b;
        expect(sum).toBe(8);
    });
});

describe("Contacts API", () => {
    describe("GET /", () => {
        it("Should return an HTML document", () => {
            return request(app).get("/").then((response) => {
                expect(response.status).toBe(200);
                expect(response.type).toEqual(expect.stringContaining("html"));
            });
        });
    });
    describe("GET /vehicles", () => {
        beforeAll(() => {

            const vehiculos = [
                new Vehiculo({
                    "matricula": "x",
                    "tipo": "x",
                    "estado": "x",
                    "permiso": "x",
                    "localizacion": "x"
                })
            ];

            dbFind = jest.spyOn(Vehiculo, "find");
            dbFind.mockImplementation((query, callback) => {
                callback(null, contacts);
            });
        });

        it("Should return all vehicles", () => {
            return request(app).get('/api/v1/vehicles').then((response) => {
                // expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(1);
                expect(dbFind).toBeCalledWith({}, expect.any(Function));
            });
        });
    });

    describe('POST /vehicles', () => {
        const vehicle = {
            "matricula": "n",
            "tipo": "n",
            "estado": "n",
            "permiso": "n",
            "localizacion": "n"
        };
        let dbInsert;
        
        beforeEach(() => {
            dbInsert = jest.spyOn(Vehiculo, "create");
        });

        it('Should add a new Vehicle if everything is fine', () => {
            dbInsert.mockImplementation((c, callback) => {
                callback(false);
            });

            return request(app).post('/api/v1/vehicles').send(vehicle).then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbInsert).toBeCalledWith(vehicle, expect.any(Function));
            });
        });
    it('Should return 500 if there is a problem with the DB', () => {
        dbInsert.mockImplementation((c, callback) => {
            callback(true);
        });

        return request(app).post('/api/v1/vehicles').send(vehicle).then((response) => {
            expect(response.statusCode).toBe(500);
        });
    });
    });
})