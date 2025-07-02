const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 6789;

var publicDir = require("path").join(__dirname, "/public/");
app.use(express.static(publicDir));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  const origin = req.get("origin");
  // TODO Add origin validation
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma"
  );

  // intercept OPTIONS method
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
  } else {
    next();
  }
});

app.listen(port, () => {
  console.log("API Start server at port " + port + ".");
});

var appRouteAuthen = require("./routes/appRoutesAuthen");
var appRouteUsers = require("./routes/appRoutesUsers");
var appRouteStock = require("./routes/appRoutesStock");
var appRouteBill = require("./routes/appRoutesBill");
var appRouteMaster = require("./routes/appRoutesMaster");
var appRoutesCompany = require("./routes/appRoutesCompany");
var appRouteCheque = require("./routes/appRoutesCheque");
var appRouteExpense = require("./routes/appRoutesExpense");
var appRouteIncomeExpenses = require("./routes/appRoutesIncomeExpenses");
var appRouteDashboard = require("./routes/appRoutesDashboard");
// set routes

appRouteAuthen(app);
appRouteUsers(app);
appRouteStock(app);
appRouteBill(app);
appRouteMaster(app);
appRoutesCompany(app);
appRouteCheque(app);
appRouteExpense(app);
appRouteIncomeExpenses(app);
appRouteDashboard(app);
