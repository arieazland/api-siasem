const Express = require("express");
const Router = Express.Router();
const aspekController = require("../controllers/aspek");

/** Router */
Router.post('/regaspek', aspekController.regAspek);
Router.put('/editaspek', aspekController.editAspek);
Router.put('/deleteaspek', aspekController.deleteAspek);

module.exports = Router;