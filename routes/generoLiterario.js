const express = require('express');
const router = express.Router();
const generoLiterario = require('../services/generoLiterario');
router.get('/', async function (req, res, next) {
    try {
        res.json(await generoLiterario.getMultiple(req.query.page));
    }catch(err){
        console.log("Error en el controlador de Generos Literarios: " + err);
        next(err);
    }
});
router.post('/', async function (req, res, next) {
    try{
        res.json(await generoLiterario.create(req.body));
    } catch(err) {
        console.error("Error al crear un género literario: " + err.message);
        next(err)
    }

});
router.put("/:id",async function(req,res,next){
    try{
        res.json(await generoLiterario.update(req.params.id,req.body));
    }catch(err){
        console.error('Error al actualizar el género literario: ' + err.message);
        next(err);
    }
});
//Borra un género literario y todos los libros que tenga asociados
router.delete('/:id', async function(req,res,next){
    try{
        res.json(await generoLiterario.remove(req.params.id));
    }catch(err){
        console.error('Error eliminando el género literario: '+err.message);
        next(err);
    }
    });
module.exports = router;