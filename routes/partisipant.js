const Express = require("express");
const Router = Express.Router();
const partisipantController = require("../controllers/partisipant");

/** Router */
Router.post('/regpartisipant', partisipantController.regPartisipant);
Router.put('/deletepartisipant', partisipantController.deletePartisipant);

module.exports = Router;