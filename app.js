const express = require('express');
const app = express();
let ambito = "HTTPS_REVECO"
let versionMSSQLFGR = "0.0.2";
const sql = require('mssql')
var https = require('https');
const config = require('./dbconfig.js');
const router = express.Router();
var fs = require('fs'); //--> Crear directorio
const PORT = 3000
var bodyParser = require('body-parser');


/* Importar dbuser */
const dbuser = require('./dbUser');
const { user } = require('./dbconfig.js');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
        auxKey = "server.key"
    }
    https.createServer({
        //--> ***HTTPS
        cert: fs.readFileSync('cert/' + auxCer),
        //--> ***HTTPS
        key: fs.readFileSync('cert/' + auxKey)
    }, app).listen(PORT, function() {
        console.log("MSSQL-FGR versión: " + infoVer());
        console.log("HTTPS: > " + auxCer);
        console.log('Express-> Listening on ' + PORT);
        console.log(infoDB());
    });
} else {
    app.listen(PORT, function() {
        console.log("MSSQL-FGR versión: " + infoVer());
        console.log('Express-> Listening on ' + PORT);
        console.log(infoDB());
    });
}

sql.on('error', err => {
    console.log("ERROR: ");
    console.log(err);
})

function infoVer() {
    return versionMSSQLFGR;
}

function infoDB() {
    return "DB: " + config.server + ">" + config.database
}



/* ------------------------- Creacion de Rutas HTTPS ----------------------------- */

/* Ruta principal */
app.use('/admin', router);

/* Obtenermos todos los usuarios */
router.route('/users').get((req, res) => {
    dbuser.getUsers().then(users => {
        res.json({ users });
    });
});

/* Obtenemos 1 usuario */
router.route('/users/:id').get((req, res) => {
    dbuser.getUserId(req.params.id).then(user => {
        res.json({ user });
    });
});

/* Insertamos 1 usuario nuevo */
router.route('/new').post((req, res) => {
    let insertUser = {...req.body };
    dbuser.insertUser(insertUser).then(user => {
        res.json({ user });
    });
});

/* Actualizar usuario */
router.route('/update').put((req, res) => {
    let updateUser = {...req.body };
    dbuser.updateUser(updateUser).then(user => {
        res.json({ user });
    });
});

/* Borrar Usuario */
router.route('/delete/:id').delete((req, res) => {
    dbuser.deleteUser(req.params.id).then(user => {
        res.json({ user });
    });
});