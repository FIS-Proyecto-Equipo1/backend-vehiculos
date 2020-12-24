const Vehicle = require('../vehicle.js');
const mongoose = require('mongoose');
const dbConect = require('../db.js');
const dbConnect = require('../db.js');

describe('Vehicles DB connection', () => {
    beforeAll(() => {
        return dbConnect();
    })

    beforeEach((done) => {
        Vehicle.deleteMany({}, (err) => {
            done();
        });
    });

    it('writes a contact in the DB', (done) => {
        const vehicle = new Vehicle({
            "matricula": "x",
            "tipo": "x",
            "estado": "x",
            "permiso": "x",
            "localizacion": "x"
        });
        vehicle.save((err, vehicle) => {
            expect(err).toBeNull();
            Vehicle.find({}, (err, vehicles) => {
                expect(vehicles).toBeArrayOfSize(1);
                done();
            });
        });

        afterAll((done) => {
            mongoose.connection.db.dropDatabase(() => {
                mongoose.connection.close(done);
            });
        });
    });
})