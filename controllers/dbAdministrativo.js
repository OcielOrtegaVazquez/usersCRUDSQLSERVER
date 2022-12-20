/* Importar el archivo de conexión */
const config = require("../config/dbconfig.js");

/* importar dependencias requeridas*/
const sql = require("mssql");

/* --------------------------------------------- */
/* ------------- Funciones HTTPS --------------- */
/* --------------------------------------------- */

/* funciones para vacaciones */
async function getAllVacaciones() {
    try {
        let pool = await sql.connect(config);
        let getVacaciones = await pool
            .request()
            .query("SELECT * FROM sam.usuarioVacaciones");
        return getVacaciones.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

async function getRegistroById(id) {
    try {
        let pool = await sql.connect(config);
        let getRegistroById = await pool
            .request()
            .input("id", sql.Int, id)
            .query("SELECT * FROM sam.usuarioVacaciones where id =@id");
        return getRegistroById.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

async function postVacaciones(vacaciones) {
    try {
        let pool = await sql.connect(config);
        let postVacaciones = await pool
            .request()
            .input("fecIni", sql.Date, vacaciones.fecIni)
            .input("estatusReg", sql.Int, vacaciones.estatusReg)
            .input("fecRegistro", sql.Date, vacaciones.fecRegistro)
            .input("descripcion", sql.VarChar, vacaciones.descripcion)
            .input("periodo", sql.Int, vacaciones.periodo)
            .input("anio", sql.Int, vacaciones.anio)
            .input("username", sql.VarChar, vacaciones.username)
            .input("nombre", sql.VarChar, vacaciones.nombre)
            .input("u_admin", sql.VarChar, vacaciones.u_admin)
            .input("fecFin", sql.Date, vacaciones.fecFin)
            .query(
                "INSERT INTO sam.usuarioVacaciones (fecIni, estatusReg, fecRegistro, descripcion, periodo, anio, username, nombre, u_admin, color, fecFin) VALUES (@fecIni, @estatusReg, @fecRegistro, @descripcion, @periodo, @anio, @username, @nombre, @u_admin, '#008ee4', @fecFin) "
            );
        return postVacaciones.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

async function getVacacionesByUser(username) {
    try {
        let pool = await sql.connect(config);
        let vacacionesByUser = await pool
            .request()
            .input("username", sql.VarChar, username.username)
            .query(
                "SELECT id, format(fecIni, 'dd/MM/yyyy') AS fecIni, format(fecRegistro, 'dd/MM/yyyy') AS fecRegistro, descripcion, periodo, anio, username, nombre, u_admin, color, format(fecFin, 'dd/MM/yyyy') AS fecFin  FROM sam.usuarioVacaciones WHERE username =@username ORDER BY fecIni DESC"
            );
        return vacacionesByUser.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

async function deleteVacacionesByUser(id) {
    try {
        let pool = await sql.connect(config);
        let deleteVacaciones = await pool
            .request()
            .input("id", sql.VarChar, id)
            .query("DELETE FROM sam.usuarioVacaciones WHERE id =@id ");
        return deleteVacaciones.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

async function getVacacionesGrafica() {
    try {
        let pool = await sql.connect(config);
        let getVacaciones = await pool
            .request()
            .query(
                "SELECT cast(id as nvarchar(10)) AS id, nombre AS label FROM sam.usuarioVacaciones"
            );
        return getVacaciones.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

async function getFechaInicialVacaciones() {
    try {
        let pool = await sql.connect(config);
        let getFechaInicialVacaciones = await pool
            .request()
            .query(
                "SELECT cast(id as nvarchar(10)) AS id, format(fecIni, 'dd/MM/yyyy') AS label FROM sam.usuarioVacaciones"
            );
        return getFechaInicialVacaciones.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

async function getFechaFinalVacaciones() {
    try {
        let pool = await sql.connect(config);
        let getFechaFinalVacaciones = await pool
            .request()
            .query(
                "SELECT cast(id as nvarchar(10)) AS id, format(fecFin, 'dd/MM/yyyy') AS label FROM sam.usuarioVacaciones"
            );
        return getFechaFinalVacaciones.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

async function getRangoVacaciones() {
    try {
        let pool = await sql.connect(config);
        let getRangoVacaciones = await pool
            .request()
            .query(
                "SELECT cast(id as nvarchar(10)) AS id, format(fecIni, 'dd/MM/yyyy') AS start, format(fecFin, 'dd/MM/yyyy') AS [end], color  FROM sam.usuarioVacaciones"
            );
        return getRangoVacaciones.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

module.exports = {
    getAllVacaciones: getAllVacaciones,
    postVacaciones: postVacaciones,
    getVacacionesByUser: getVacacionesByUser,
    deleteVacacionesByUser: deleteVacacionesByUser,
    getVacacionesGrafica: getVacacionesGrafica,
    getFechaInicialVacaciones: getFechaInicialVacaciones,
    getFechaFinalVacaciones: getFechaFinalVacaciones,
    getRangoVacaciones: getRangoVacaciones,
    getRegistroById: getRegistroById
};