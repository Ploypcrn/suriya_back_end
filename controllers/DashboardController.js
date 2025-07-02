var DashboardModel = require('../models/DashboardModel');
var moment = require('moment');

var Task = function (task) {
    this.task = task.task;
};

Task.getHeader = async function getHeader(data, result) {
    try {
        var response = await DashboardModel.getHeader(data);
        result(response);
    } catch (error) {
        result(error);
    }
}

Task.getExpenseSummary = async function getExpenseSummary(data, result) {
    try {
        var response = await DashboardModel.getExpenseSummary(data);
        result(response);
    } catch (error) {
        result(error);
    }
}

Task.getExpenseComparison = async function getExpenseComparison(data, result) {
    try {
        var response = await DashboardModel.getExpenseComparison(data);
        result(response);
    } catch (error) {
        result(error);
    }
}

Task.getOperatingResult = async function getOperatingResult(data, result) {
    try {
        var response = await DashboardModel.getOperatingResult(data);
        result(response);
    } catch (error) {
        result(error);
    }
}

module.exports = Task;
