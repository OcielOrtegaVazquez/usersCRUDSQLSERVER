/* Importar el archivo de conexión */
const config = require("../config/dbconfig.js");

/* importar dependencias requeridas*/
const sql = require("mssql");

/* --------------------------------------------- */
/* ------------- Funciones HTTPS --------------- */
/* --------------------------------------------- */

/* ----------- Funciones Catalogos ------------- */

/*  Obtener todos los catalogos de los Unidades */
async function getCatUnidades() {
    try {
        let pool = await sql.connect(config);
        let catUnidades = await pool.request().query("SELECT * FROM sam.cat_unidad");
        return catUnidades.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/*  Obtener todos los catalogos de los Estados */
async function getCatEstados() {
    try {
        let pool = await sql.connect(config);
        let catEstados = await pool.request().query("SELECT * FROM sam.cat_estado2");
        return catEstados.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}


module.exports = {
    getCatUnidades: getCatUnidades,
    getCatEstados: getCatEstados
}