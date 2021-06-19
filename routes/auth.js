const Express = require("express");
const Router = Express.Router();
const authController = require("../controllers/auth");

/** Router */
Router.post('/login', authController.login);
Router.post('/regadmin', authController.regAdmin);
Router.post('/regmahasiswa', authController.regMahasiswa);
Router.put('/edit', authController.edit);
Router.put('/delete', authController.delete);

module.exports = Router;