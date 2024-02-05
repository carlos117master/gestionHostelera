const mongoose = require('mongoose');

let incidenciasSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        required: [true, 'la descripcion es obligatoria']
    },
    fechaInicio:{
        type: Date,
        required: [true, 'la fecha de inicio es obligatoria'],
        default: Date.now()
    },
    fechafin:{
        type: Date,
    },
    imagen:{
        type: String,
        required:false
    }
});

let habitacionSchema = new mongoose.Schema({
    numero: {
        type: Number,
        required: [true, 'El número de habitación es obligatorio'],
        min: [1, 'El número de habitación debe ser mayor o igual a 1'],
        max:[100, 'El número de habitación debe ser menor o igual a 100']
    },
    tipo: {
        enum: ['individual','doble', 'familiar', 'suite']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción de la habitación es obligatoria']
    },
    ultimaLimpieza:{
        type: Date,
        required: [true, 'La fecha de última limpieza es obligatoria']
    },
    precio:{
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser menor a 0'],
        max: [250, 'El precio no puede ser mayor a 250']
    },
    imagen:{
        type:String,
        required: false
    },
    incidencias: [incidenciasSchema]
});

let habitacion = mongoose.model('habitacion', habitacionSchema);
module.exports = habitacion;