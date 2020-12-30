const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);


const MATRICULA_REG_EX=new RegExp('[0-9]{4}[A-Z]{3}'); //SIN VOCALES Y MAYUS?
const tipoVehiculo = ['Coche', 'Moto', 'Bici', 'Patin'];
const valoresEstado = ['DISPONIBLE', 'RESERVADO', 'TRAYECTO', 'NODISPONIBLE'];
const permisosCirculacion = ['AB', 'B', 'NO']

const vehicleSchema = new mongoose.Schema(
    {
        matricula: {type: String, unique: true, required: true, match: MATRICULA_REG_EX },
        tipo: {type: String, required: true, enum : tipoVehiculo },
        estado: {type: String, required: true, enum : valoresEstado},
        permiso: {type: String, required: true, enum : permisosCirculacion},
        localizacion: {type: String, required: true }
    });

vehicleSchema.methods.cleanId = function() {
    return {matricula: this.matricula, tipo: this.tipo, estado: this.estado, permiso: this.permiso, localizacion :this.localizacion};
}

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;

