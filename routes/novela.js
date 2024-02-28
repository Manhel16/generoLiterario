const express = require('express');
const router = express.Router();
const novelaService = require('../services/novela');
const multer = require('multer');

// Configurar Multer para manejar la subida de archivos
const upload = multer({ dest: 'uploads/' });

// Obtener todas las novelas de un género literario específico
router.get('/', async (req, res, next) => {
    try {
        const novelas = await novelaService.getAllNovelas();
        res.json(novelas);
    } catch (error) {
        next(error);
    }
});

router.get('/genero/:id', async (req, res, next) => {
    try {
        const novelas = await novelaService.getNovelasByGeneroLiterarioId(req.params.id);
        res.json(novelas);
    } catch (error) {
        next(error);
    }
});

// Crear una nueva novela
router.post('/', upload.fields([{ name: 'imagenLocal', maxCount: 1 }, { name: 'imagenBlob', maxCount: 1 }]), async (req, res, next) => {
    try {
        if (!req.files || !req.files['imagenLocal'] || !req.files['imagenBlob'] || !req.body) {
            return res.status(400).json({ message: 'No se proporcionaron datos suficientes.' });
        }
        
        const imageLocal = req.files['imagenLocal'][0];
        const imageBlob = req.files['imagenBlob'][0];
        
        if (!imageLocal || !imageBlob) {
            return res.status(400).json({ message: 'No se proporcionaron datos suficientes.' });
        }
        
        // Llamar a la función para crear la novela con los datos y las imágenes
        const novelaId = await novelaService.createNovela(req.body, imageLocal, imageBlob);
        res.status(201).json({ id: novelaId, message: 'Novela creada correctamente' });
    } catch (error) {
        next(error);
    }
});

// Actualizar una novela existente
router.put('/:id', upload.fields([{ name: 'imagenLocal', maxCount: 1 }, { name: 'imagenBlob', maxCount: 1 }]), async (req, res, next) => {
    try {
        // Obtener los datos de la solicitud
        const novelaData = req.body;
        const novelaId = req.params.id;

        // Verificar si se proporcionaron nuevas imágenes
        const imageLocal = req.files['imagenLocal'] ? req.files['imagenLocal'][0] : null;
        const imageBlob = req.files['imagenBlob'] ? req.files['imagenBlob'][0] : null;

        // Actualizar la novela en la base de datos
        const success = await novelaService.updateNovela(novelaId, novelaData, imageLocal, imageBlob);

        // Responder al cliente
        if (success) {
            res.json({ success: true, message: `La novela con ID ${novelaId} ha sido actualizada con éxito.` });
        } else {
            res.status(500).json({ success: false, message: `No se pudo actualizar la novela con ID ${novelaId}.` });
        }
    } catch (error) {
        next(error);
    }
});

// Eliminar una novela existente
router.delete('/:id', async (req, res, next) => {
    try {
        const success = await novelaService.deleteNovela(req.params.id);
        res.json({ success });
    } catch (error) {
        next(error);
    }
});

module.exports = router;