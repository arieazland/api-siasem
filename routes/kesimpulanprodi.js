const Express = require("express");
const Router = Express.Router();
const kesimpulanprodiController = require("../controllers/kesimpulanprodi");

/** Router */
Router.post('/regconc', kesimpulanprodiController.regConc);
Router.put('/editconc', kesimpulanprodiController.editConc);
Router.put('/deleteconc', kesimpulanprodiController.deleteConc);

module.exports = Router;