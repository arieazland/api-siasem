const Express = require("express");
const Mysql = require("mysql");
const Bcrypt = require("bcrypt");
const Path = require("path");
const Dotenv = require("dotenv");
Dotenv.config({ path: './.env' });

const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

const app = Express();

var session = require("express-session");
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Parse URL-encoded bodies (as sent by HTML Forms)
app.use(Express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API Clients)
app.use(Express.json());

/** define router */
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/acara', require('./routes/acara'));
app.use('/partisipant', require('./routes/partisipant'));
app.use('/part', require('./routes/part'));
app.use('/aspek', require('./routes/aspek'));
app.use('/soal', require('./routes/soal'));
app.use('/assessment', require('./routes/assessment'));
app.use('/kesimpulan', require('./routes/kesimpulan'));
app.use('/kesimpulanprodi', require('./routes/kesimpulanprodi'));

let port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
