const express = require('express');
let habitacion = require(__dirname + '/../models/habitacion.js');
const limpieza = require(__dirname + '/../models/limpieza.js');
const { autenticacion } = require('../utils/auth');


let router = express.Router();

router.get('/nueva/:id', (req, res) => {
    const habitacionId = req.params.id;
    res.render('limpiezas_nueva', { habitacion:habitacionId});
});

/*router.get('/',(req,res) => {
      limpieza.find().then(resultado => {
          res.render({limpiezas:resultado});
      }).catch (error => {
          res.render({error: "Error obteniendo Limepiezas"});
      }); 
  });*/
  router.get('/', (req, res) => {
    limpieza.find().then(resultado => {
        res.render('limpiezas_listado', { limpiezas: resultado });
    }).catch(error => {
        res.render('limpiezas_listado', { error: "Error obteniendo Limpiezas" });
    });
});

  router.get('/:id',(req,res) => {
    limpieza.find({idHabitacion: req.params.id}).sort({fechaHora: "desc"}).then((resultado) => {
        const habitacionId = req.params.id;
        res.render('limpiezas_listado', {limpiezas:resultado, idHabitacion:habitacionId}); 
      }).catch(er => {
        return res.status(500).render('limpiezas_listado', {error: "Error al obtener limpiezas para esa habitación"})
       });
 });

/*router.get('/:id',(req,res) => {
   limpieza.find({idHabitacion: req.params.id}).sort({fechaHora: "desc"}).then((resultado) => {
        const habitacionId = req.params.id;
       res.render('limpiezas_listado', {limpiezas:resultado, idHabitacion:habitacionId}); 
     }).catch(er => {
        res.render('limpiezas_listado', {error: "No hay limpiezas registradas para esa habitación"})
      });
});*/

  router.post('/:id',autenticacion, async (req, res) => {
    try {
        
        let nuevaLimpieza = new limpieza({ 
            idHabitacion: req.params.id,
            fechaHora: req.body.fechaLimpieza
        });
  
        if (req.body.observaciones) {
            nuevaLimpieza.observaciones = req.body.observaciones;
        }
        console.log(req.body);
        console.log(req.body.fechaLimpieza);
        nuevaLimpieza.save().then(()=>{
            habitacion.findById(req.params.id).then((habitacion)=>{
                limpieza.find({idHabitacion: habitacion.id}).sort({fechaHora:-1}).then((limpieza)=>{
                    habitacion.ultimaLimpieza = limpieza[0].fechaHora;
                    habitacion.save().then(()=>{
                        res.render('limpiezas_listado',{limpiezas: limpieza, idHabitacion: habitacion.id});
                    })
                })
            })
        })
    
    } catch (error) {    
        // Maneja el error y redirige a la página de error con el mensaje correspondiente
        res.render('error', { error: 'Error al agregar limpieza' });
    }
});

module.exports = router;