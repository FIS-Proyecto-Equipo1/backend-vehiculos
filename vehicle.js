const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
    {
        matricula: String,
        tipo: String,
        estado: String,
        permiso: String,
        localizacion :String
    });

vehicleSchema.methods.cleanId = function() {
    return {matricula: this.matricula, tipo: this.tipo, estado: this.estado, permiso: this.permiso, localizacion :this.localizacion};
}

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;

