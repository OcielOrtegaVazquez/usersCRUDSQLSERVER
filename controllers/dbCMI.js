/* Importar el archivo de conexión */
const config = require("../config/dbconfig.js");

/* importar dependencias requeridas*/
const sql = require("mssql");
const CENAPI = require("../models/cmi.js");
const CGSP = require("../models/cmi.js");

/* --------------------------------------------- */
/* ------------- Funciones HTTPS --------------- */
/* --------------------------------------------- */

/* ------------- Funciones CENAPI --------------- */

/* GET ALL CMI_CENAPI */
async function getAllCenapi() {
    try {
        let pool = await sql.connect(config);
        let cenapi = await pool
            .request()
            .query("SELECT TOP(10) * FROM sam.AIC_COPLADII_CENAPI_BCP");
        return cenapi.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* GET Reporte entre 2 fechas CMI_CENAPI */
async function getReporteCenapi(rango) {
    try {
        let pool = await sql.connect(config);
        let reporteCENAPI = await pool
            .request()
            .input("startDate", sql.Date, rango.startDate)
            .input("endDate", sql.Date, rango.endDate)
            .query(
                "SELECT * FROM sam.AIC_COPLADII_CENAPI_BCP WHERE CONVERT(DATE, FechaHoraRecepcion) BETWEEN @startDate AND @endDate"
            );
        return reporteCENAPI.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* ------------- Funciones CGSP --------------- */

/* GET ALL CMI_CGSP */
async function getAllCGSP() {
    try {
        let pool = await sql.connect(config);
        let cgsp = await pool
            .request()
            .query("SELECT TOP(10) * FROM sam.AIC_COPLADII_CGSP_BCP");
        return cgsp.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* GET Reporte entre 2 fechas CMI_CENAPI */
async function getReporteCgsp(rango) {
    try {
        let pool = await sql.connect(config);
        let reporteCGSP = await pool
            .request()
            .input("startDate", sql.Date, rango.startDate)
            .input("endDate", sql.Date, rango.endDate)
            .query(
                "SELECT * FROM sam.AIC_COPLADII_CGSP_BCP WHERE CONVERT(DATE, FechaHoraSolicitud) BETWEEN @startDate AND @endDate"
            );
        return reporteCGSP.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* ------------- Funciones PFM_MM --------------- */

/* GET ALL CMI_CGSP */
async function getAllPFM_MM() {
    try {
        let pool = await sql.connect(config);
        let pfm_mm = await pool
            .request()
            .query("SELECT TOP(10) * FROM sam.AIC_COPLADII_PFM_MM_BCP");
        return pfm_mm.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* GET Reporte entre 2 fechas CMI_PFM_MM */
async function getReportePFM_MM(rango) {
    try {
        let pool = await sql.connect(config);
        let reportePFM_MM = await pool
            .request()
            .input("startDate", sql.Date, rango.startDate)
            .input("endDate", sql.Date, rango.endDate)
            .query(
                "SELECT * FROM sam.AIC_COPLADII_PFM_MM_BCP WHERE CONVERT(DATE, FechaHoraRecepcion) BETWEEN @startDate AND @endDate"
            );
        return reportePFM_MM.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* ------------- Funciones PFM_MJ --------------- */

/* GET ALL CMI_PFM_MJ */
async function getAllPFM_MJ() {
    try {
        let pool = await sql.connect(config);
        let pfm_mj = await pool
            .request()
            .query("SELECT TOP(10) * FROM sam.AIC_COPLADII_PFM_MJ_BCP");
        return pfm_mj.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* GET Reporte entre 2 fechas CMI_PFM_MJ */
async function getReportePFM_MJ(rango) {
    try {
        let pool = await sql.connect(config);
        let reportePFM_MJ = await pool
            .request()
            .input("startDate", sql.Date, rango.startDate)
            .input("endDate", sql.Date, rango.endDate)
            .query(
                "SELECT * FROM sam.AIC_COPLADII_PFM_MJ_BCP WHERE CONVERT(DATE, FechaHoraRecepcion) BETWEEN @startDate AND @endDate"
            );
        return reportePFM_MJ.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/*  Funciones para descargar los trimestes CENAPI */
async function getAllTrimestresCENAPI() {
    try {
        let pool = await sql.connect(config);
        let reporteTrimestreCENAPI = await pool
            .request()
            .query("SELECT TOP(10) * FROM sam.CMI_CENAPI");
        return reporteTrimestreCENAPI.recordset;
    } catch (error) {
        console.log("Error de Tipo: " + error);
    }
}

async function getTrimestreCENAPI(trimestre) {
    try {
        let pool = await sql.connect(config);
        let trimestreCENAPI = await pool
            .request()
            .input("trim", sql.Int, trimestre.trim)
            .query("SELECT * FROM sam.CMI_CENAPI WHERE Trimestre =@trim");
        return trimestreCENAPI.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/*  Funciones para descargar los trimestes CGSP */
async function getAllTrimestresCGSP() {
    try {
        let pool = await sql.connect(config);
        let reporteTrimestreCGSP = await pool
            .request()
            .query("SELECT TOP(10) * FROM sam.CMI_CGSP");
        return reporteTrimestreCGSP.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

async function getTrimestreCGSP(trimestre) {
    try {
        let pool = await sql.connect(config);
        let trimestreCGSP = await pool
            .request()
            .input("trim", sql.Int, trimestre.trim)
            .query("SELECT * FROM sam.CMI_CGSP WHERE Trimestre =@trim");
        return trimestreCGSP.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/*  Funciones para descargar los trimestes PFM_MJ */
async function getAllTrimestresPFM_MJ() {
    try {
        let pool = await sql.connect(config);
        let reporteTrimestrePFM_MJ = await pool
            .request()
            .query("SELECT TOP(10) * FROM sam.CMI_PFM_MJ");
        return reporteTrimestrePFM_MJ.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

async function getTrimestrePFM_MJ(trimestre) {
    try {
        let pool = await sql.connect(config);
        let trimestrePFM_MJ = await pool
            .request()
            .input("trim", sql.Int, trimestre.trim)
            .query("SELECT * FROM sam.CMI_PFM_MJ WHERE Trimestre =@trim");
        return trimestrePFM_MJ.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/*  Funciones para descargar los trimestes PFM_MM */
async function getAllTrimestresPFM_MM() {
    try {
        let pool = await sql.connect(config);
        let reporteTrimestrePFM_MM = await pool
            .request()
            .query("SELECT TOP(10) * FROM sam.CMI_PFM_MM");
        return reporteTrimestrePFM_MM.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

async function getTrimestrePFM_MM(trimestre) {
    try {
        let pool = await sql.connect(config);
        let trimestrePFM_MM = await pool
            .request()
            .input("trim", sql.Int, trimestre.trim)
            .query("SELECT * FROM sam.CMI_PFM_MM WHERE Trimestre =@trim");
        return trimestrePFM_MM.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

module.exports = {
    getAllCenapi: getAllCenapi,
    getReporteCenapi: getReporteCenapi,
    getAllCGSP: getAllCGSP,
    getReporteCgsp: getReporteCgsp,
    getAllPFM_MM: getAllPFM_MM,
    getReportePFM_MM: getReportePFM_MM,
    getAllPFM_MJ: getAllPFM_MJ,
    getReportePFM_MJ: getReportePFM_MJ,
    getAllTrimestresCENAPI: getAllTrimestresCENAPI,
    getTrimestreCENAPI: getTrimestreCENAPI,
    getAllTrimestresCGSP: getAllTrimestresCGSP,
    getTrimestreCGSP: getTrimestreCGSP,
    getAllTrimestresPFM_MJ: getAllTrimestresPFM_MJ,
    getTrimestrePFM_MJ: getTrimestrePFM_MJ,
    getAllTrimestresPFM_MM: getAllTrimestresPFM_MM,
    getTrimestrePFM_MM: getTrimestrePFM_MM,
};