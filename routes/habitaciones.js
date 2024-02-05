const express = require('express');
const { autenticacion } = require('../utils/auth');
let habitacion = require(__dirname + '/../models/habitacion.js');
const upload = require(__dirname + '/../utils/uploads.js');
let router = express.Router();


router.get('/nueva', autenticacion, (req, res) => {
    res.render('habitaciones_nueva');
});

router.get('/editar/:id', (req, res) => {
    habitacion.findById(req.params['id']).then(resultado => {
        if (resultado) {
            res.render('habitaciones_editar', {habitacion: resultado});
        } else {
            res.render('error', {error: "habitacion no encontrada"});
        }
    }).catch(error => {
        res.render('error', {error: "habitacion no encontrada"});
    });
});

router.get('/',(req,res) => {
    habitacion.find().then(resultado => {
        res.render('habitaciones_listado', {habitaciones: resultado});
    }).catch (error => {
        res.status(500)
           .send({error: "Error obteniendo habitaciones"});
    }); 
});

router.get('/:id',(req,res) => {
    habitacion.findById(req.params.id).then(resultado => {
        if(resultado)
        res.render('habitaciones_ficha', {habitacion: resultado});
        else 
        res.render('habitacion no encontrada');
    }).catch(error => {
        res.render('habitacion no encontrada');
    });
});

router.post('/', autenticacion, upload.upload.single('imagen'),(req, res) => {

    const fechaActual = new Date();
    let nuevaHabitacion = new habitacion({
        numero: req.body.numero,
        descripcion: req.body.descripcion,
        ultimaLimpieza: fechaActual,
        precio: req.body.precio,
    });
    if(req.file){
        nuevaHabitacion.imagen = req.file.filename
    }
    nuevaHabitacion.save().then(() => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        let errores = Object.keys(error.errors);
        let mensaje = "";
        if(errores.length > 0)
        {
            errores.forEach(clave => {
                mensaje += '<p>' + error.errors[clave].message + '</p>';
            });
        }
        else
        {
            mensaje = 'Error añadiendo habitacion';
        }
        console.log();
        res.render('habitaciones_nueva', {error: mensaje});
    });
});

/*
{
    "numero": 6,
    "descripcion": "Habitacion con una cama matrimonial",
    "ultimaLimpieza": "2023-11-10T13:07:10.000Z",
    "precio": 120.3
}
*/

router.put('/:id',(req, res) => {

    habitacion.findByIdAndUpdate(req.params.id, {
        $set: {
            numero: req.body.numero,
            tipo: req.body.tipo,
            descripcion: req.body.descripcion,
            ultimaLimpieza: req.body.ultimaLimpieza,
            precio: req.body.precio,
        }
    }, {new: true}).then(resultado => {
        if (resultado)
            res.redirect(req.baseUrl);
        else
        res.render('error', {error: "Error modificando habitacion"});
    }).catch(error => {
        res.render('error', {error: "Error modificando habitacion"});
    });
});

router.delete('/:id',autenticacion, (req, res) => {
    habitacion.findByIdAndRemove(req.params.id).then(() => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('error', {error: "Error borrando habitacion"});
    });
});

router.post('/:id/incidencias',autenticacion,upload.upload.single('imagen'), (req, res) => {
    let descripcion = req.body.descripcion;
    console.log(descripcion);
    const fechaActual = new Date();
    const nuevaIncidencia = {
        descripcion: req.body.descripcion,
        fechaInicio: fechaActual,
    };
    if (req.file) {
        nuevaIncidencia.imagen = req.file.filename;
    }

    habitacion.findByIdAndUpdate(req.params.id, {
        $push: { incidencias: nuevaIncidencia }
    }, { new: true }).then(resultado => {
        if (resultado) {
            res.redirect(`/habitaciones/${req.params.id}`);
        } else {
            res.render('error', { error: "Habitación no encontrada" });
        }
    }).catch(error => {
        res.render('error', { error: "Error añadiendo la incidencia" });
    });
});

/*
router.put('/:id', (req, res) => {

    habitacion.findByIdAndUpdate(req.params.id, {
        $set: {
            numero: req.body.numero,
            tipo: req.body.tipo,
            descripcion: req.body.descripcion,
            ultimaLimpieza: req.body.ultimaLimpieza,
            precio: req.body.precio,
        }
    }, {new: true}).then(resultado => 
        
*/

router.post('/:idH/incidencias/:idI/', autenticacion,(req, res) => {
    const fechaFin = new Date();
    const actualizarFecha = {
        fechafin: fechaFin,
    };
    habitacion.findOneAndUpdate( {_id: req.params.idH, 'incidencias._id': req.params.idI },
        { $set:{
            'incidencias.$.fechafin': fechaFin}
        },
        {new:true}
    ).then(resultado => {
        if (resultado) {
            res.redirect(`/habitaciones/${req.params.idH}`);
        } else {
            res.render('error',{error: "Incidencia no encontrada" });
        }
    }).catch(error => {
        res.render('error',{error: "Error actualizando la incidencia" });
    });
});


module.exports = router;