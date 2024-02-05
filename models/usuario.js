const mongoose = require('mongoose');


let usuarioSchema = new mongoose.Schema({
    login:{
        type:String,
        require: true,
        minlength: 4
    },
    password:{
        type:String,
        require: true,
        minlength:7
    }
});

let usuarios = mongoose.model('usuarios',usuarioSchema);
module.exports = usuarios;