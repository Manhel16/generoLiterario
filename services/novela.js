const db = require('./db');
const fs = require('fs');
const path = require('path');

async function getAllNovelas() {
    const rows = await db.query('SELECT * FROM novela');
    return rows;
}

async function getNovelasByGeneroLiterarioId(generoLiterarioId) {
    const rows = await db.query(
        `SELECT * FROM novela WHERE generoLiterarioId = ?`,
        [generoLiterarioId]
    );
    return rows;
}

async function saveImage(file) {
    try {
        const imgFolder = path.resolve(__dirname, '../img'); // Ruta de la carpeta de imágenes
        const filename = file.originalname; // Nombre del archivo original

        // Generar la ruta completa del archivo en la carpeta img
        const filePath = path.join(imgFolder, filename);

        // Mover el archivo al directorio de imágenes
        await fs.promises.rename(file.path, filePath);

        // Devolver la ruta relativa del archivo
        return path.join('/img', filename);
    } catch (error) {
        console.error('Error al guardar la imagen:', error);
        throw error;
    }
}

async function createNovela(novelaData, imageLocal, imageBlob) {
    const { nombre, autor, generoLiterarioId, paginas, anoLanzamiento } = novelaData;

    if (!nombre || !autor || !generoLiterarioId || !paginas || !anoLanzamiento || !imageLocal || !imageBlob) {
        throw new Error('Faltan datos obligatorios para crear la novela.');
    }

    try {
        const imagePath = await saveImage(imageLocal);

        // Convertir el archivo de imagen Blob en un buffer de datos
        const imageBlobData = await fs.promises.readFile(imageBlob.path);

        const result = await db.query(
            'INSERT INTO novela (nombre, autor, generoLiterarioId, paginas, anoLanzamiento, imagen_local, imagen_blob) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nombre, autor, generoLiterarioId, paginas, anoLanzamiento, imagePath, imageBlobData]
        );

        if (result.affectedRows > 0) {
            return result.insertId;
        } else {
            throw new Error('Error al crear la novela.');
        }
    } catch (error) {
        console.error('Error al crear la novela:', error);
        throw new Error('Error al crear la novela.');
    }
}
async function updateNovela(id, novelaData, imageLocal, imageBlob) {
    try {
        let imagePath = null;
        if (imageLocal) {
            imagePath = await saveImage(imageLocal);
        }

        let updateQuery = 'UPDATE novela SET ';
        const fieldValues = [];
        const fieldsToUpdate = [];

        if (novelaData.nombre !== undefined) {
            fieldsToUpdate.push('nombre=?');
            fieldValues.push(novelaData.nombre);
        }

        if (imagePath) {
            fieldsToUpdate.push('imagen_local=?');
            fieldValues.push(imagePath);
        }

        if (imageBlob) {
            // Convertir el archivo de imagen Blob en un buffer de datos
            const imageBlobData = await fs.promises.readFile(imageBlob.path);
            fieldsToUpdate.push('imagen_blob=?');
            fieldValues.push(imageBlobData);
        }

        updateQuery += fieldsToUpdate.join(', ');
        updateQuery += ' WHERE id=?';
        fieldValues.push(id);

        const result = await db.query(updateQuery, fieldValues);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar la novela:', error);
        throw new Error('Error al actualizar la novela.');
    }
}

async function deleteNovela(novelaId) {
    const result = await db.query('DELETE FROM novela WHERE id = ?', [novelaId]);
    return result.affectedRows > 0;
}

module.exports = {
    getAllNovelas,
    getNovelasByGeneroLiterarioId,
    createNovela,
    updateNovela,
    deleteNovela
};