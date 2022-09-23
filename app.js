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
const jwt = require("jsonwebtoken");

/* Importar DB */
const dbuser = require("./controllers/dbUser");
const dbCarpetaInvestigacion = require("./controllers/dbCarpetaInvestigacion");
const dbCMI = require("./controllers/dbcmi");
const dbCatalogos = require("./controllers/dbCatalogos");
const viewsPFM = require("./controllers/viewsPFM");

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
const dbPlanInvestigacion = require("./controllers/dbPlanInvestigacion.js");
const dbResumenCMI = require("./controllers/dbResumenCMI.js");
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
router.route("/users", veryfyToken).get((req, res) => {
    dbuser.getUsers().then((users) => {
        res.json(users);
    });
});

/* Obtenemos 1 usuario */
router.route("/users/:id").get((req, res) => {
    dbuser.getUserId(req.params.id).then((user) => {
        res.json(user);
    });
});

/* Insertamos 1 usuario nuevo */
router.route("/users").post((req, res) => {
    const insertUser = {...req.body };
    dbuser.insertUser(insertUser).then((user) => {
        res.setHeader("Content-Type", "application/json");
        res.json(user);
    });
});

/* Actualizar usuario */
router.route("/update").put((req, res) => {
    const updateUser = {...req.body };
    dbuser.updateUser(updateUser).then((user) => {
        res.json(user);
    });
});

/* Borrar Usuario */
router.route("/users/:id").delete((req, res) => {
    dbuser.deleteUser(req.params.id).then((user) => {
        res.json(user);
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
            const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + 60 * 60, data: user },
                "@FgR@c0M@0rG@mX-Si3R!"
            );
            res.json(user);
            console.log(token);
            console.log(user);
        } else {
            res.json("usuario incorrecto");
        }
    });
});

/* Verificar Token */
function veryfyToken(req, res, next) {
    if (!req.headers.authorization) return res.status(401).json("No autorizado");
    const token = req.headers.authorization.substr(7);
    if (token !== "") {
        const content = jwt.verify(token, "@FgR@c0M@0rG@mX-Si3R!");
        console.log("SI pasa");
        console.log(content);
        req.data = content;
        next();
    } else {
        res.status(401).json("Token Vacio");
    }
}

/* ------------------------------------------------------------------------------- */
/* --------------- Creacion de Rutas Carpetas de Investigacion ------------------- */
/* ------------------------------------------------------------------------------- */

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
        res.json(carpetas2022);
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
        console.log(
            "Se Encontraron: " +
            reporteCENAPIRango.length +
            " Registros de CMI_CENAPI"
        );
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
        console.log(
            "Se encontraron: " + reporteCGSPRango.length + " Registros de CMI_CGSP"
        );
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
        console.log(
            "Se encontraron: " +
            reportePFM_MMRango.length +
            " Registros de CMI_PFM_MM"
        );
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
        console.log(
            "Se encontraron: " + reportePFM_MJRango.length + " Registros de CMI_PF_MJ"
        );
    });
});

/* ------------------------------------------------------------------------------ */
/* -------------------------------- CATALOGOS ----------------------------------- */
/* ------------------------------------------------------------------------------ */

/* Catalogo de Unidades */
router.route("/catUnidades").get((req, res) => {
    dbCatalogos.getCatUnidades().then((catUnidades) => {
        res.setHeader("Content-Type", "application/json");
        res.json(catUnidades);
    });
});

/* Catalogo de Estados */
router.route("/catEstados").get((req, res) => {
    dbCatalogos.getCatEstados().then((catEstados) => {
        res.setHeader("Content-Type", "application/json");
        res.json(catEstados);
    });
});

/* ------------------------------------------------------------------------------ */
/* ------------------------- Planes de Investigacion ---------------------------- */
/* ------------------------------------------------------------------------------ */

/* Obtener todos planes de invetigacion */
router.route("/planesInvestigacion").get((req, res) => {
    dbPlanInvestigacion
        .getAllPlanesInvestigacion()
        .then((planesInvestigacion) => {
            res.setHeader("Content-Type", "application/json");
            res.json(planesInvestigacion);
        });
});

/* Obtener plan de investigacion por numero de carpeta */
router.route("/planInvestigacion/carpeta").post((req, res) => {
    const numCarpeta = {...req.body };
    dbPlanInvestigacion
        .getPlanInvestigacion(numCarpeta)
        .then((planInvestigacion) => {
            res.setHeader("Content-Type", "application/json");
            res.json(planInvestigacion);
            console.log(planInvestigacion);
        });
});

/* Obtener diligencias asignadad a carpeta */
router.route("/planDiligenciaCi/carpeta").post((req, res) => {
    const numCarpeta = {...req.body };
    dbPlanInvestigacion.getPlanDiligencia(numCarpeta).then((diligencia) => {
        res.setHeader("Content-Type", "application/json");
        res.json(diligencia);
        console.log(diligencia);
    });
});

/* Obtener la jerarquia de MP */
router.route("/mpEstructura/:id").get((req, res) => {
    dbPlanInvestigacion.getJerarquiaMP(req.params.id).then((getJerarquiaMP) => {
        res.setHeader("Content-Type", "application/json");
        res.json(getJerarquiaMP);
    });
});

/* ------------------------------------------------------------------------------- */
/* ---------------------- Creacion de Rutas Resumen CMI -------------------------- */
/* ------------------------------------------------------------------------------- */

/* Obtener el resumen de las tablas de CMI */
router.route("/resumen-cmi").get((req, res) => {
    dbResumenCMI.getAllResumenCMI().then((resumenCMI) => {
        res.setHeader("Content-Type", "application/json");
        res.json(resumenCMI);
        console.log(resumenCMI);
    });
});

/* Obtener el resumen de Tabla Valida Datos */
router.route("/resumen-cmi-valida").get((req, res) => {
    dbResumenCMI.getAllValidaTablaDatos().then((validaDatos) => {
        res.setHeader("Content-Type", "application/json");
        res.json(validaDatos);
        console.log(validaDatos);
    });
});

/* --------------------------------------------------------------------------------------- */
/* ---------------------- Creacion de Rutas DESCARGA VISTAS PFM -------------------------- */
/* --------------------------------------------------------------------------------------- */

/* Descargar Vista CENAPI */
router.route("/descargaCENAPI").get((req, res) => {
    viewsPFM.getCENAPITable().then((resumenCENAPI) => {
        res.setHeader("Content-Type", "application/json");
        res.send({
            message: "Descargando Base CENAPI, tiempo aproximado 1:45 min ...",
        });
    });
});

/* Descargar Vista CGSP */
router.route("/descargaCGSP").get((req, res) => {
    viewsPFM.getCGSPTable().then((resumenCGSP) => {
        res.setHeader("Content-Type", "application/json");
        res.send({
            message: "Descargando Base CGSP, tiempo aproximado 3:50 min ...",
        });
    });
});

/* Descargar Vista PFM_MJ */
router.route("/descargaPFM_MJ").get((req, res) => {
    viewsPFM.getPFM_MJTable().then((resumenPFM_MJ) => {
        res.setHeader("Content-Type", "application/json");
        res.send({
            message: "Descargando Base PFM_MJ, tiempo aproximado 1:45 min ...",
        });
    });
});

/* Descargar Vista PFM_MM */
router.route("/descargaPFM_MM").get((req, res) => {
    viewsPFM.getPFM_MMTable().then((resumenPFM_MM) => {
        res.setHeader("Content-Type", "application/json");
        res.send({
            message: "Descargando Base PFM_MM, tiempo aproximado 7:45 min ...",
        });
    });
});

/* Insertar Archivos Descargados de Vistas dePFM */

/* Insertar CENAPI */
router.route("/insertPFM_CENAPI").get((req, res) => {
    viewsPFM.insertRegistrosPFM_CENAPI().then((insertRegistrosPFM_CENAPI) => {
        res.setHeader("Content-Type", "application/json");
        res.json(insertRegistrosPFM_CENAPI);
    });
});

/* Insertar CGSP */
router.route("/insertPFM_CGSP").get((req, res) => {
    viewsPFM.insertRegistrosPFM_CGSP().then((insertRegistrosPFM_CGSP) => {
        res.setHeader("Content-Type", "application/json");
        res.json(insertRegistrosPFM_CGSP);
    });
});

/* Insertar PFM_MJ */
router.route("/insertPFM_MJ").get((req, res) => {
    viewsPFM.insertRegistrosPFM_MJ().then((insertRegistrosPFM_MJ) => {
        res.setHeader("Content-Type", "application/json");
        res.json(insertRegistrosPFM_MJ)
    });
});

/* Insertar PFM_MM */
router.route("/insertPFM_MM").get((req, res) => {
    viewsPFM.insertRegistrosPFM_MM().then((insertRegistrosPFM_MM) => {
        res.setHeader("Content-Type", "application/json");
        res.json(insertRegistrosPFM_MM);
    })
});

/* HISTORICO VISTAS PFM-AIC */
router.route("/historico_pfm").get((req, res) => {
    viewsPFM.historicoPFM().then((historicoPFM) => {
        res.setHeader("Content-Type", "application/json");
        res.json(historicoPFM);
    })
});