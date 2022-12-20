/* Importar el archivo de conexión */
const config = require("../config/dbconfig.js");

/* importar dependencias requeridas*/
const sql = require("mssql");

/* --------------------------------------------- */
/* ------------- Funciones HTTPS --------------- */
/* --------------------------------------------- */

/* --- Funciones para Resumen CMI ---*/
async function getAllResumenCMI() {
    try {
        let pool = await sql.connect(config);
        let resumenCMI = await pool.request().query("SELECT * FROM sam.TABLA_VALIDA_MES");
        return resumenCMI.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

async function getAllValidaTablaDatos() {
    try {
        let pool = await sql.connect(config);
        let validaTabla = await pool.request().query("SELECT * FROM sam.TABLA_VALIDA_DATO");
        return validaTabla.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

module.exports = {
    getAllResumenCMI: getAllResumenCMI,
    getAllValidaTablaDatos: getAllValidaTablaDatos
}