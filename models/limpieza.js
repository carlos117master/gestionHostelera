const mongoose = require('mongoose');

let LimpiezaSchema = new mongoose.Schema({
    idHabitacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'habitacion'
    },
    fechaHora:{
        type: Date,
        require:true,
        default: Date.now()
    },
    observaciones:{
        type: String
    }
});

let limpieza = mongoose.model('limpiezas', LimpiezaSchema);
module.exports = limpieza;