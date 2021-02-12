const Vehicle = require('../vehicle.js');
const mongoose = require('mongoose');
const dbConnect = require('../db.js');

describe('Vehicle db connection', ()=>{

    beforeAll(()=>{
        return dbConnect(); 
    })

    beforeEach((done)=>{
        Vehicle.deleteMany({}, (err)=>{
            done();
        });
    });

    it('writes a contact in the DB', (done)=>{
        const vehicle = new Vehicle({"matricula":"2345TGF", "tipo": "Moto", "estado":"RESERVADO", "permiso":"AB", "localizacion" : "Malaga" })
        vehicle.save((err, vehicle) => {
            expect(err).toBeNull();
            Vehicle.find({}, (err, vehicles) => {
                expect(vehicles).toBeArrayOfSize(1);
                done();
            });
        });
    })

    afterAll((done) => {
        mongoose.connection.db.DropDatabase(() => {
            mongoose.connection.close(done);
            done();
        })
    })
})