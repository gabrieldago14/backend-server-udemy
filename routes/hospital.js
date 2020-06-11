var express = require('express');


var mdAutenticacion = require('../middlewares/autentificacion');

var app = express();


var Hospital = require('../models/hospital');

//===========================================
// Obtener nuevo Hospitales
//===========================================


//Rutas
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(


            (err, Hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospitales',
                        errors: err

                    });
                }

                Hospital.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        usuarios: Hospitales,
                        total: conteo
                    });
                });


            });

});






//===========================================
// Actualizar   hospital
//===========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err

            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'EL hospital con el id ' + id + 'no existe',
                errors: { message: 'No existe un hospital con ese ID' }

            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err

                });
            }

            res.status(200).json({
                ok: true,
                usuario: hospitalGuardado
            });
        });
    });



});


//===========================================
// Crear un  nuevo hospital
//===========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err

            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });


});

//===========================================
// borrar un  hospital por el id
//===========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err

            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id ',
                errors: { message: 'No existe un hospital con ese id' }

            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
});

module.exports = app;