const express = require('express');
const https = require('https')
let http = require('http')
let serverData = require('./data');
let path = require('path');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'source/pages/pug'));
var server = http.createServer(app);
var io = require('socket.io').listen(server);

const HTML_DIR = "/source/pages";
const CLIENT_DIR = "/source/client";

var cookieParser = require('cookie-parser');
var session = require('express-session')
app.use(cookieParser());
app.use(session({
    secret: '34SDgsdgspxxxxxxxfddsfdfds3wdfsG',
    resave: false,
    saveUninitialized: true
}));

let clientAccountRouter = require('./routers/clientAccountRouter')(app);
let clientHomeRouter = require('./routers/clientHomeRouter')(app);
let clientOrdersRouter = require('./routers/clientOrdersRouter')(app);
let navigationRouter = require('./routers/navigationRouter')(app);
let searchRouter = require('./routers/searchRouter')(app);
let bookRouter = require('./routers/bookRouter')(app);
let formRouter = require('./routers/formRouter')(app);
let cartTabRouter = require('./routers/cartTabRouter')(app);

app.use('/client_account', clientAccountRouter);
app.use(['/client_home','/','HomePage.html'], clientHomeRouter);
app.use('/client_orders', clientOrdersRouter);
app.use('/form', formRouter);
app.use('/nav', navigationRouter);
app.use('/search', searchRouter);
app.use('/book', bookRouter);
app.use('/cart_tab', cartTabRouter);

app.use(express.static(__dirname + CLIENT_DIR));
app.use(express.static(__dirname + HTML_DIR));

server.listen(process.env.PORT || 3000);
