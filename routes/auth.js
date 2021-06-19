const Express = require("express");
const Router = Express.Router();
const authController = require("../controllers/auth");

/** Router */
Router.post('/login', authController.login);
Router.post('/regadmin', authController.regAdmin);
Router.post('/regpsikolog', authController.regPsikolog);
Router.post('/regmahasiswa', authController.regMahasiswa);
Router.put('/edituser', authController.editUser);
Router.put('/deleteuser', authController.deleteUser);

module.exports = Router;