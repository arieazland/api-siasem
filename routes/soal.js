const Express = require("express");
const Router = Express.Router();
const soalController = require("../controllers/soal");

/** Router */
Router.post('/regsoal', soalController.regSoal);
Router.put('/editsoal', soalController.editSoal);
Router.put('/deletesoal', soalController.deleteSoal);

module.exports = Router;