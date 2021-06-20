const Express = require("express");
const Router = Express.Router();
const partController = require("../controllers/part");

/** Router */
Router.post('/regpart', partController.regPart);
Router.put('/editpart', partController.editPart);
Router.put('/deletepart', partController.deletePart);

module.exports = Router;