/* Importar el archivo de conexión */
const config = require("../config/dbconfig.js");

/* importar dependencias requeridas*/
const sql = require("mssql");


/* --------------------------------------------- */
/* ------------- Funciones HTTPS --------------- */
/* --------------------------------------------- */


/* ------------- Funciones PARA OBTENER LOS REGISTROS DE PFM --------------- */

/* Descargar registros de CENAPI */
async function getCENAPITable() {
    const { spawn } = require("node:child_process");
    const bat = spawn("cenapi.bat", ["/c", "SIGERTM"]);
    const fs = require('fs').promises;

    try {

        bat.stdout.on("data", (data) => {
            console.log(data.toString());
        });

        bat.stderr.on("data", async(data) => {
            console.error(data.toString());
        });

        bat.on("exit", (code) => {
            console.log(`Child exited with code ${code}`);
        });

    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* Conteo, descarga y carga de registros de CENAPI  base de PFM */
async function getTotalesPFMhistorico() {

    const { spawn } = require('child_process');
    const bat = spawn("historico_pfm.bat", ["/c", "SIGERTM"]);

    try {
        bat.stdout.on("data", (data) => {
            console.log(data.toString());
        });

        bat.stderr.on("data", async(data) => {
            console.error(data.toString());
        });

        bat.on("exit", (code) => {
            console.log(`Child exited with code ${code}`);
        });

    } catch (error) {
        console.log("Error de tipo: " + error);
    }

}

/* Descargar Registros de CGSP */
async function getCGSPTable() {
    const { spawn } = require("node:child_process");
    const bat = spawn("cgsp.bat", ["/c", "SIGERTM"]);
    const fs = require('fs').promises;

    try {

        bat.stdout.on("data", (data) => {
            console.log(data.toString());
        });

        bat.stderr.on("data", (data) => {
            console.error(data.toString());
        });

        bat.on("exit", (code) => {
            console.log(`Child exited with code ${code}`);
        });

    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* Descargar Resgistros de PFM_MJ */
async function getPFM_MJTable() {
    const { spawn } = require("node:child_process");
    const bat = spawn("pfm_mj.bat", ["/c", "SIGERTM"]);
    const fs = require('fs').promises;

    try {

        bat.stdout.on("data", (data) => {
            console.log(data.toString());
        });

        bat.stderr.on("data", (data) => {
            console.error(data.toString());
        });

        bat.on("exit", (code) => {
            console.log(`Child exited with code ${code}`);
        });

    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* Descargar Registros de PFM_MM */
async function getPFM_MMTable() {
    const { spawn } = require("node:child_process");
    const bat = spawn("pfm_mm.bat", ["/c", "SIGERTM"]);
    const fs = require('fs').promises;

    try {

        bat.stdout.on("data", (data) => {
            console.log(data.toString());
        });

        bat.stderr.on("data", (data) => {
            console.error(data.toString());
        });

        bat.on("exit", (code) => {
            console.log(`Child exited with code ${code}`);
        });

    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* ------------- Funciones PARA INSERTAR LOS REGISTROS DE PFM EN BASE COPLADII --------------- */

/* Insertar Registros en CENAPI_BCP */
async function insertRegistrosPFM_CENAPI() {
    try {
        let pool = await sql.connect(config);
        let insertRegistros = await pool.request().query("EXEC dbo.SPS_INSERT_PFM_CENAPI");
        return insertRegistros.rowsAffected;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* Insertar Registros en CGSP_BCP */
async function insertRegistrosPFM_CGSP() {
    try {
        let pool = await sql.connect(config);
        let insertRegistros = await pool.request().query("EXEC dbo.SPS_INSERT_PFM_CGSP");
        return insertRegistros.rowsAffected;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* Insert Registros en PFM_MJ */
async function insertRegistrosPFM_MJ() {
    try {
        let pool = await sql.connect(config);
        let insertRegistros = await pool.request().query("EXEC dbo.SPS_INSERT_PFM_MJ");
        return insertRegistros.rowsAffected;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* Insert Registros en  PFM_MM */
async function insertRegistrosPFM_MM() {
    try {
        let pool = await sql.connect(config);
        let insertRegistros = await pool.request().query("EXEC dbo.SPS_INSERT_PFM_MM");
        return insertRegistros.rowsAffected;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* Historico PFM-AIC */
async function historicoPFM() {
    try {
        let pool = await sql.connect(config);
        let historicoPFM = await pool.request().query("select * from sam.AIC_PFM_HISTORICO");
        return historicoPFM.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* Conteo de Registros Base Copladii */
async function totalRegistros() {
    try {
        let pool = await sql.connect(config);
        let totalRegistros = await pool.request().query("SELECT * FROM [sam].[BitacoraSIER_BCP] ORDER BY Fecha DESC");
        return totalRegistros.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

module.exports = {
    getCENAPITable: getCENAPITable,
    getCGSPTable: getCGSPTable,
    getPFM_MJTable: getPFM_MJTable,
    getPFM_MMTable: getPFM_MMTable,
    insertRegistrosPFM_CENAPI: insertRegistrosPFM_CENAPI,
    insertRegistrosPFM_CGSP: insertRegistrosPFM_CGSP,
    insertRegistrosPFM_MJ: insertRegistrosPFM_MJ,
    insertRegistrosPFM_MM: insertRegistrosPFM_MM,
    historicoPFM: historicoPFM,
    totalRegistros: totalRegistros,
    getTotalesPFMhistorico: getTotalesPFMhistorico
}