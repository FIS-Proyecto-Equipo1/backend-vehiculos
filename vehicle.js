const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
    {
        matricula: {type: String, unique: true, required: true },
        tipo: {type: String, required: true },
        estado: {type: String, required: true },
        permiso: {type: String, required: true },
        localizacion: {type: String, required: true }
    });

vehicleSchema.methods.cleanId = function() {
    return {matricula: this.matricula, tipo: this.tipo, estado: this.estado, permiso: this.permiso, localizacion :this.localizacion};
}

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;

