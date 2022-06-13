/* Importar el archivo de conexión */
const config = require("../config/dbconfig.js");

/* importar dependencias requeridas*/
const sql = require("mssql");

/* --------------------------------------------- */
/* ------------- Funciones HTTPS --------------- */
/* --------------------------------------------- */

/* --- Funciones para Planes de investigacion ---*/

/* GET ALL Planes de Investigacion */
async function getAllPlanesInvestigacion() {
    try {
        let pool = await sql.connect(config);
        let planesInvestigacion = await pool
            .request()
            .query("SELECT * FROM sam.vEstructuraAMPF_PLAN");
        return planesInvestigacion.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* Obtener Plan de investigaicion Por carpeta */
async function getPlanInvestigacion(carpeta) {
    try {
        let pool = await sql.connect(config);
        let planInvestigacion = await pool
            .request()
            .input("tipo", sql.VarChar, carpeta.tipo)
            .input("edo", sql.VarChar, carpeta.edo)
            .input("unidad", sql.VarChar, carpeta.unidad)
            .input("numCar", sql.VarChar, carpeta.numCar)
            .input("anio", sql.VarChar, carpeta.anio)
            .query(
                "SELECT * FROM sam.vEstructuraAMPF_PLAN WHERE NumCar =  @tipo + '/' + @edo + '/' + @unidad + '/' + @numCar + '/' + @anio "
            );
        return planInvestigacion.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* Obtener Listado de Diligencia - Plan Asignado A Carpeta deInvestigacion */
async function getPlanDiligencia(carpeta) {
    try {
        let pool = await sql.connect(config);
        let diligencia = await pool
            .request()
            .input("tipo", sql.VarChar, carpeta.tipo)
            .input("edo", sql.VarChar, carpeta.edo)
            .input("unidad", sql.VarChar, carpeta.unidad)
            .input("numCar", sql.VarChar, carpeta.numCar)
            .input("anio", sql.VarChar, carpeta.anio)
            .query(
                "SELECT * FROM sam.vPlanAsignadoCI WHERE carpetainvestigacion = @tipo + '/' + @edo + '/' + @unidad + '/' + @numCar + '/' + @anio "
            );
        return diligencia.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* Obtener Jerarquia de MP por Id */
async function getJerarquiaMP(mpId) {
    try {
        let pool = await sql.connect(config);
        let jerarquiaMP = await pool
            .request()
            .input("mpId", sql.Int, mpId)
            .query(
                "SELECT * FROM sam.vJerarquiaEquiposAMPF_PLAN WHERE AMPF1_ID = @mpId "
            );
        return jerarquiaMP.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

module.exports = {
    getAllPlanesInvestigacion: getAllPlanesInvestigacion,
    getPlanInvestigacion: getPlanInvestigacion,
    getPlanDiligencia: getPlanDiligencia,
    getJerarquiaMP: getJerarquiaMP,
};