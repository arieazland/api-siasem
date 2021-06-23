const Express = require("express");
const Router = Express.Router();
const kesimpulanController = require("../controllers/kesimpulan");

/** Router */
Router.post('/regconc', kesimpulanController.regConc);
Router.put('/editconc', kesimpulanController.editConc);
Router.put('/deleteconc', kesimpulanController.deleteConc);

module.exports = Router;