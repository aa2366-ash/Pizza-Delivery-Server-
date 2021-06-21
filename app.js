require("dotenv").config();
var express = require('express');
const cors = require("cors");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var orderRouter = require('./routes/orders')
var captureRouter = require('./routes/capture');
var kitchenRouter = require("./routes/kitchen");
var stockRouter = require("./routes/stock");
var historyRouter = require("./routes/history");
var app = express();

const PORT = process.env.PORT || 7070


app.use(cors());
app.use(bodyParser.json());





app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/order' , orderRouter )
app.use("/capture", captureRouter);
app.use("/kitchen", kitchenRouter);
app.use("/stock", stockRouter);
app.use("/history", historyRouter);


app.listen(PORT, () => console.log('Listening'))

module.exports = app;
