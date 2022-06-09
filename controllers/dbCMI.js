/* Importar el archivo de conexión */
const config = require("../config/dbconfig.js");

/* importar dependencias requeridas*/
const sql = require("mssql");
const CENAPI = require("../models/cmi.js");

/* --------------------------------------------- */
/* ------------- Funciones HTTPS --------------- */
/* --------------------------------------------- */

/* GET ALL CMI_CENAPI */
async function getAllCenapi() {
    try {
        let pool = await sql.connect(config);
        let cenapi = await pool
            .request()
            .query("SELECT TOP(10) * FROM sam.AIC_COPLADII_CENAPI");
        return cenapi.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* GET Reporte entre 2 fechas CMI_CENAPI */

async function getReporteCenapi(rango) {
    try {
        let pool = await sql.connect(config);
        console.log(rango);
        console.log(rango.startDate);
        console.log(rango.endDate);
        let reporteCENAPI = await pool
            .request()
            .input("startDate", sql.Date, rango.startDate)
            .input("endDate", sql.Date, rango.endDate)
            .query(
                "SELECT * FROM sam.COPLADII_CENAPI WHERE CONVERT(DATE, FechaHoraRecepcion) BETWEEN @startDate AND @endDate"
            );
        return reporteCENAPI.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

module.exports = {
    getAllCenapi: getAllCenapi,
    getReporteCenapi: getReporteCenapi,
};