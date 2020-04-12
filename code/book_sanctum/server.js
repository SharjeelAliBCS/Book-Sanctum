const express = require('express');
const https = require('https')
let http = require('http')
let serverData = require('./data');
let path = require('path');

const app = express();

const HTML_DIR = "/source/pages/html";
const PUG_DIR = "/source/pages/pug";
const CSS_DIR = "/source/pages/css";
const CLIENT_DIR = "/source/client";

app.set('view engine', 'pug');
app.set('views', path.join(__dirname,PUG_DIR));
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + CLIENT_DIR));
app.use(express.static(__dirname + HTML_DIR));
app.use(express.static(__dirname + CSS_DIR));
app.use(express.static(__dirname + "/source/pages"));

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
let checkoutRouter = require('./routers/checkoutRouter')(app);
let adminHomeRouter = require('./routers/AdminHomeRouter')(app);
let salesRouter = require('./routers/salesRouter')(app);
let transactionsRouter = require('./routers/transactionsRouter')(app);
let inventoryRouter = require('./routers/inventoryRouter')(app);
let sellerRouter = require('./routers/sellerRouter')(app);
let requestRouter = require('./routers/requestRouter')(app);

app.use('/client_account', clientAccountRouter);
app.use(['/client_home','/','HomePage.html'], clientHomeRouter);
app.use('/client_orders', clientOrdersRouter);
app.use('/form', formRouter);
app.use('/nav', navigationRouter);
app.use('/search', searchRouter);
app.use('/book', bookRouter);
app.use('/cart_tab', cartTabRouter);
app.use('/checkout', checkoutRouter);
app.use('/admin_home', adminHomeRouter);
app.use('/sales', salesRouter);
app.use('/transactions', transactionsRouter);
app.use('/inventory', inventoryRouter);
app.use('/sellers', sellerRouter);
app.use('/request', requestRouter);

server.listen(process.env.PORT || 3000);
