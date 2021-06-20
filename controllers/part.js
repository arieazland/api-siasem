const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

/** insert part process */
exports.regPart = async (req, res, dataputs) => {

}

/** edit part process */
exports.editPart = async (req, res, dataputs) => {

}

/** delete part process */
exports.deletePart = async (req, res, dataputs) => {

}