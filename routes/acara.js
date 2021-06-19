const Express = require("express");
const Router = Express.Router();
const acaraController = require("../controllers/acara");

/** Router */
Router.post('/regacara', acaraController.regAcara);
Router.put('/editacara', acaraController.editAcara);
Router.put('/deleteacara', acaraController.deleteAcara);

module.exports = Router;