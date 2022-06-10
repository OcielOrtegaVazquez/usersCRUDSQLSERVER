const express = require("express");
const app = express();
let ambito = "HTTPS_REVECO";
let versionMSSQLFGR = "0.0.2";
const sql = require("mssql");
var https = require("https");
const config = require("./config/dbconfig.js");
const router = express.Router();
var fs = require("fs"); //--> Crear directorio
const PORT = 3000;
var bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require('jsonwebtoken');

/* Importar dbuser */
const dbuser = require("./controllers/dbUser");
const dbCarpetaInvestigacion = require('./controllers/dbCarpetaInvestigacion');
const dbCMI = require("./controllers/dbcmi");

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

/* Mostramos un mensaje de Success en consola */
sql.connect(config, (err) => {
    if (err) {
        throw err;
    }
    console.log("Connection Successful !");
    new sql.Request().query("select 1 as number", (err, result) => {
        console.dir(result);
    });
});

sql.on("error", (err) => {
    console.log("Sql database connection error ", err);
});

if (ambito.indexOf("HTTPS") > -1) {
    var auxCer = "reveco.fgr.org.mx.crt";
    var auxKey = "reveco.fgr.org.mx.key";
    if (ambito.indexOf("LOCAL") > -1) {
        auxCer = "server.cer";
        auxKey = "server.key";
    }
    https
        .createServer({
                //--> ***HTTPS
                cert: fs.readFileSync("cert/" + auxCer),
                //--> ***HTTPS
                key: fs.readFileSync("cert/" + auxKey),
            },
            app
        )
        .listen(PORT, function() {
            console.log("MSSQL-FGR versión: " + infoVer());
            console.log("HTTPS: > " + auxCer);
            console.log("Express-> Listening on " + PORT);
            console.log(infoDB());
        });
} else {
    app.listen(PORT, function() {
        console.log("MSSQL-FGR versión: " + infoVer());
        console.log("Express-> Listening on " + PORT);
        console.log(infoDB());
    });
}

sql.on("error", (err) => {
    console.log("ERROR: ");
    console.log(err);
});

function infoVer() {
    return versionMSSQLFGR;
}

function infoDB() {
    return "DB: " + config.server + ">" + config.database;
}

/* --------- HTTPS ------------- */

/* ------------------------------ */
const configC = require("./config/config");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(configC.server));

/* --------- HTTPS ------------- */
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

/* -------------------------            key          ----------------------------- */
app.set("key", config.key);

/* ------------------------- Creacion de Rutas HTTPS ----------------------------- */

/* ---------------------------- Ruta principal ----------------------------------- */
app.use("/admin", router);


/* ------------------------------------------------------------------------------- */
/* ------------------------- Creacion de Rutas Users ----------------------------- */
/* ------------------------------------------------------------------------------- */


/* Obtenermos todos los usuarios */
router.route("/users").get((req, res) => {
    dbuser.getUsers().then((users) => {
        res.json({ users });
    });
});

/* Obtenemos 1 usuario */
router.route("/users/:id").get((req, res) => {
    dbuser.getUserId(req.params.id).then((user) => {
        res.json({ user });
    });
});

/* Insertamos 1 usuario nuevo */
router.route("/users").post((req, res) => {
    const insertUser = {...req.body };
    dbuser.insertUser(insertUser).then((user) => {
        res.setHeader("Content-Type", "application/json");
        res.json({ user });
    });
});

/* Actualizar usuario */
router.route("/update").put((req, res) => {
    const updateUser = {...req.body };
    dbuser.updateUser(updateUser).then((user) => {
        res.json({ user });
    });
});

/* Borrar Usuario */
router.route("/users/:id").delete((req, res) => {
    dbuser.deleteUser(req.params.id).then((user) => {
        res.json({ user });
    });
});

/* Login Usuario */
router.route("/users/login").post((req, res) => {
    const userLogin = {...req.body };
    console.log(req.body);
    console.log(`Usuario: ${userLogin.username} Intentando Conectar a la DB...`);
    dbuser.loginUser(userLogin).then((user) => {
        res.setHeader("Content-Type", "application/json");
        if (res) {
            let dataUser = JSON.stringify(user);
            //console.log("usuario base:  " + user[0].username);
            //console.log("usuario role:  " + user[0].role);
            const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + 60 * 60, data: dataUser }, '@FgR@c0M@0rG@mX-Si3R!');
            res.json(token);
            console.log(token);
        } else {
            res.json('usuario incorrecto');
        }
    });
});


/* ------------------------------------------------------------------------------- */
/* --------------- Creacion de Rutas Carpetas de Investigacion ------------------- */
/* ------------------------------------------------------------------------------- */

/* Obtenermos todos los usuarios */
router.route("/users").get((req, res) => {
    dbuser.getUsers().then((users) => {
        res.json({ users });
    });
});

/* Obtenemos todas las carpetas de investigacion del 2019 */
router.route("/carpetas2019").get((req, res) => {
    dbCarpetaInvestigacion.getCarpetasInvestigacion2019().then((carpetas2019) => {
        res.json(carpetas2019);
    });
});

/* Obtenemos todas las carpetas de investigacion del 2020 */
router.route("/carpetas2020").get((req, res) => {
    dbCarpetaInvestigacion.getCarpetasInvestigacion2020().then((carpetas2020) => {
        res.json(carpetas2020);
    });
});

/* Obtenemos todas las capetas de investigacion del 2021 */
router.route("/carpetas2021").get((req, res) => {
    dbCarpetaInvestigacion.getCarpetasInvestigacion2021().then((carpetas2021) => {
        res.json(carpetas2021);
    });
});

/* Obtenemos todas las carpetas de investigacion del 2022 */
router.route("/carpetas2022").get((req, res) => {
    dbCarpetaInvestigacion.getCarpetasInvestigacion2022().then((carpetas2022) => {
        res.json(carpetas2022)
    });
});

/* ------------------------------------------------------------------------------- */
/* ------------------------------- Reportes CMI ---------------------------------- */
/* ------------------------------------------------------------------------------- */


/* ------------------------------- CENAPI ---------------------------------- */

/* Obtenemos todos los registros de CMI_CENAPI */
router.route("/reporteCENAPI").get((req, res) => {
    dbCMI.getAllCenapi().then((reporteCenapi) => {
        res.setHeader("Content-Type", "application/json");
        res.json(reporteCenapi);
    });
});

/* Obtener el reporte de CMI_CENAPI entre rango de días */
router.route("/reporteCENAPI/rango").post((req, res) => {
    const rango = {...req.body };
    dbCMI.getReporteCenapi(rango).then((reporteCENAPIRango) => {
        res.setHeader("Content-Type", "application/json");
        res.json(reporteCENAPIRango);
        console.log("Se Encontraron: " + reporteCENAPIRango.length + " Registros de CMI_CENAPI");
    });
});


/* ------------------------------- CGSP ---------------------------------- */

/* Obtener todos los registros de CMI_CGSP */
router.route("/reporteCGSP").get((req, res) => {
    dbCMI.getAllCGSP().then((reporteCGSP) => {
        res.setHeader("Content-Type", "application/json");
        res.json(reporteCGSP);
    });
});

/* Obtener el reporte de CMI_CGSP entre un rango de dias */
router.route("/reporteCGSP/rango").post((req, res) => {
    const rango = {...req.body };
    dbCMI.getReporteCgsp(rango).then((reporteCGSPRango) => {
        res.setHeader("Content-Type", "application/json");
        res.json(reporteCGSPRango);
        console.log("Se encontraron: " + reporteCGSPRango.length + " Registros de CMI_CGSP");
    });
});


/* ------------------------------- PFM_MM ---------------------------------- */

/* Obtenemos todos los registros de PFM_MM */
router.route("/reportePFM_MM").get((req, res) => {
    dbCMI.getAllPFM_MM().then((reportePFM_MM) => {
        res.setHeader("Content-Type", "application/json");
        res.json(reportePFM_MM);
    });
});

/* Obtener el reporte de CMI_PFM_MM entre un rango de dias */
router.route("/reportePFM_MM/rango").post((req, res) => {
    const rango = {...req.body };
    dbCMI.getReportePFM_MM(rango).then((reportePFM_MMRango) => {
        res.setHeader("Content-Type", "application/json");
        res.json(reportePFM_MMRango);
        console.log("Se encontraron: " + reportePFM_MMRango.length + " Registros de CMI_PFM_MM");
    });
});


/* ------------------------------- PFM_MJ ---------------------------------- */

/* Obtenemos todos los registros de PFM_MJ */
router.route("/reportePFM_MJ").get((req, res) => {
    dbCMI.getAllPFM_MM().then((reportePFM_MJ) => {
        res.setHeader("Content-Type", "application/json");
        res.json(reportePFM_MJ);
    });
});

/* Obtener el reporte de CMI_PFM_MJ entre un rango de dias */
router.route("/reportePFM_MJ/rango").post((req, res) => {
    const rango = {...req.body };
    dbCMI.getReportePFM_MJ(rango).then((reportePFM_MJRango) => {
        res.setHeader("Content-Type", "application/json");
        res.json(reportePFM_MJRango);
        console.log("Se encontraron: " + reportePFM_MJRango.length + " Registros de CMI_PF_MJ");
    });
});