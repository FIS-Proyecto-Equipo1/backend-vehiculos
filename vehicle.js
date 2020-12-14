const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
    {
        id: Number,
        tipo: String,
        estado: String,
        permiso: String,
        localizacion :String
    });

vehicleSchema.methods.cleanId = function() {
    return {id: this.id, tipo: this.tipo, estado: this.estado, permiso: this.permiso, localizacion :this.localizacion};
}

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
