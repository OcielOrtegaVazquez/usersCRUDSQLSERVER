/* --------- HTTPS ------------- */
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

/* ------------------------------ */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

/* --------- HTTPS ------------- */
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var config = {
    options: { enableArithAbort: false },
    //user: 'sa',
    user: "copladii_admin",
    //password: 'Passw0rd',
    password: "4dMC0pl419!!",
    //server: 'localhost\\SQL2017', // You can use 'localhost\\instance' to connect to named instance
    server: "192.168.206.113",
    database: "SAM",
    options: {
        trustServerCertificate: true,
    },
};

module.exports = config;