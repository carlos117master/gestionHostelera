const mongoose = require('mongoose');



let incidencias = mongoose.model('incidencias', incidenciasSchema);
module.exports = incidencias;