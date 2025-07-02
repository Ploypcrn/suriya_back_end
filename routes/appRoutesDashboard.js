var DashboardController = require("../controllers/DashboardController");
var DashboardModel = require("../models/DashboardModel");

module.exports = function (app) {
  const key = "/api/v1";

  app.get(`${key}/dashboard/getHeader`, function (req, res) {
    DashboardController.getHeader(req.body, function (err, task) {
      try {
        if (err) {
          return res.send(err);
        }
        return res.send(task);
      } catch (error) {
        return res.send(error);
      }
    });
  });

  app.get(`${key}/dashboard/getExpenseSummary`, function (req, res) {
    DashboardController.getExpenseSummary(req.body, function (err, task) {
      try {
        if (err) {
          return res.send(err);
        }
        return res.send(task);
      } catch (error) {
        return res.send(error);
      }
    });
  });

  app.get(`${key}/dashboard/getExpenseComparison`, function (req, res) {
    DashboardController.getExpenseComparison(req.body, function (err, task) {
      try {
        if (err) {
          return res.send(err);
        }
        return res.send(task);
      } catch (error) {
        return res.send(error);
      }
    });
  });

  app.get(`${key}/dashboard/getOperatingResult`, function (req, res) {
    DashboardController.getOperatingResult(req.body, function (err, task) {
      try {
        if (err) {
          return res.send(err);
        }
        return res.send(task);
      } catch (error) {
        return res.send(error);
      }
    });
  });
};
