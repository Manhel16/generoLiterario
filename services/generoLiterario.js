const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
    const offset = helper.getOffset(page, config.listPerPage);
    const query = `
        SELECT g.id, g.nombre, g.descripcionBreve, COUNT(n.id) AS novelasCount
        FROM generoLiterario g
        LEFT JOIN novela n ON g.id = n.generoLiterarioId
        GROUP BY g.id
        LIMIT ${offset},${config.listPerPage}
    `;
    const rows = await db.query(query);
    const data = helper.emptyOrRows(rows);
    const meta = {page};

    return {
        data,
        meta
    };
}

async function create(generoLiterario) {
    if (!generoLiterario.nombre || !generoLiterario.descripcionBreve) {
        throw new Error("Nombre y descripción breve son campos requeridos.");
    }

    const resultado = await db.query(
        'INSERT INTO generoLiterario (nombre, descripcionBreve) VALUES(?,?)',
        [generoLiterario.nombre, generoLiterario.descripcionBreve]
    );
    let message = 'Error esperado al crear el género literario';
    if(resultado.affectedRows) {
        message = `Género literario creado correctamente`;
    }
    return { message };
}
async function update(id, generoLiterario) {
    const { nombre, descripcionBreve } = generoLiterario; // Extraer los campos necesarios
    const resultado = await db.query(
        'UPDATE generoLiterario SET nombre = ?, descripcionBreve = ? WHERE id = ?',
        [nombre, descripcionBreve, id]
    );
    let message = `No se ha podido actualizar el género literario con id=${id}`;
    if (resultado.affectedRows) {
        message = `Se han actualizado los datos del género literario con éxito`;
    }
    return { message };
}
async function remove(id) {
    const resultado  = await db.query(`DELETE FROM generoLiterario WHERE id=?`,[id]);
    let message =  `No se ha podido eliminar el género literario con id=${id}`;
    if(resultado.affectedRows) {
       message = `Se ha eliminado el género literario con éxito`;  
    }
    return ({message});
    }
module.exports = {
    getMultiple,
    create,
    update,
    remove
}