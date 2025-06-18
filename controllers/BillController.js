var BillModel = require("../models/BillModels");
var moment = require("moment");

var Task = function (task) {
  this.task = task.task;
};

Task.generateBillNo = async function generateBillNo(data, result) {
  try {
    var response = await BillModel.generateBillNo(data);
    result(response);
  } catch (error) {
    result(error);
  }
};

Task.getBill = async function getBill(data, result) {
  try {
    var response = await BillModel.getBill(data);
    result(response);
  } catch (error) {
    result(error);
  }
};

Task.getBillByBillNo = async function getBillByBillNo(data, result) {
  try {
    var responseBill = await BillModel.getBillByBillNo(data);
    if (responseBill?.data[0]?.issuedate) {
      var issueDate = new Date(responseBill?.data[0]?.issuedate);
      var issueDateStr =
        issueDate.getDate() +
        "/" +
        (issueDate.getMonth() + 1) +
        "/" +
        (issueDate.getFullYear() + 543);
      responseBill.data[0].issuedate = moment(
        issueDateStr,
        "DD/MM/YYYY"
      ).format("DD/MM/YYYY");
    }
    if (responseBill?.data[0]?.receivedate) {
      var receiveDate = new Date(responseBill?.data[0]?.receivedate);
      var receiveDateStr =
        receiveDate.getDate() +
        "/" +
        (receiveDate.getMonth() + 1) +
        "/" +
        (receiveDate.getFullYear() + 543);
      responseBill.data[0].receivedate = moment(
        receiveDateStr,
        "DD/MM/YYYY"
      ).format("DD/MM/YYYY");
    }
    if (responseBill?.data?.length > 0) {
      // var responseBillListProduct = await BillModel.getBillListProductByBillNo(responseBill?.data[0]?.billid);
      var responseBillListProduct =
        await BillModel.getBillListProductFreeTextByBillNo(
          responseBill?.data[0]?.billid
        );
      responseBill.data[0].listProduct = responseBillListProduct.data;
      result(responseBill);
    } else {
      result(responseBill);
    }
  } catch (error) {
    result(error);
  }
};

Task.getBillById = async function getBillById(data, result) {
  try {
    var responseBill = await BillModel.getBillById(data);
    if (responseBill?.data[0]?.issuedate) {
      var issueDate = new Date(responseBill?.data[0]?.issuedate);
      var issueDateStr =
        issueDate.getDate() +
        "/" +
        (issueDate.getMonth() + 1) +
        "/" +
        (issueDate.getFullYear() + 543);
      responseBill.data[0].issuedate = moment(
        issueDateStr,
        "DD/MM/YYYY"
      ).format("DD/MM/YYYY");
    }
    if (responseBill?.data[0]?.receivedate) {
      var receiveDate = new Date(responseBill?.data[0]?.receivedate);
      var receiveDateStr =
        receiveDate.getDate() +
        "/" +
        (receiveDate.getMonth() + 1) +
        "/" +
        (receiveDate.getFullYear() + 543);
      responseBill.data[0].receivedate = moment(
        receiveDateStr,
        "DD/MM/YYYY"
      ).format("DD/MM/YYYY");
    }
    if (responseBill?.data?.length > 0) {
      // var responseBillListProduct = await BillModel.getBillListProductByBillNo(responseBill?.data[0]?.billid);
      var responseBillListProduct =
        await BillModel.getBillListProductFreeTextByBillNo(
          responseBill?.data[0]?.billid
        );
      responseBill.data[0].listProduct = responseBillListProduct.data;
      result(responseBill);
    } else {
      result(responseBill);
    }
  } catch (error) {
    result(error);
  }
};

Task.searchBill = async function searchBill(data, result) {
  try {
    var response = await BillModel.searchBill(data);
    result(response);
  } catch (error) {
    result(error);
  }
};

Task.getBillByCustomer = async function getBillByCustomer(data, result) {
  try {
    var response = await BillModel.getBillByCustomer(data);
    result(response);
  } catch (error) {
    result(error);
  }
};

Task.getBillByDate = async function getBillByDate(data, result) {
  try {
    var response = await BillModel.getBillByDate(data);
    result(response);
  } catch (error) {
    result(error);
  }
};

Task.createBillFreeText = async function createBillFreeText(data, result) {
  try {
    var receiveDate = data?.receiveDate?.split("/");
    var issueDate = data?.issueDate?.split("/");

    data.receiveDate = receiveDate
      ? moment(receiveDate.join("-"), "DD-MM-YYYY")
          .subtract(543, "years")
          .format("YYYY-MM-DD HH:mm:ss.SSS")
      : null;
    data.issueDate = issueDate
      ? moment(issueDate.join("-"), "DD-MM-YYYY")
          .subtract(543, "years")
          .format("YYYY-MM-DD HH:mm:ss.SSS")
      : null;
    var response = await BillModel.createBillFreeText(data);
    result(response);
  } catch (error) {
    result(error);
  }
};

Task.updateBillFreeText = async function updateBillFreeText(data, result) {
  try {
    var receiveDate = data.receiveDate ? data.receiveDate.split("/") : null;
    var issueDate = data.issueDate.split("/");
    data.receiveDate = receiveDate
      ? moment(receiveDate.join("-"), "DD-MM-YYYY")
          .subtract(543, "years")
          .format("YYYY-MM-DD HH:mm:ss.SSS")
      : null;
    data.issueDate = issueDate
      ? moment(issueDate.join("-"), "DD-MM-YYYY")
          .subtract(543, "years")
          .format("YYYY-MM-DD HH:mm:ss.SSS")
      : null;

    var response = await BillModel.updateBillFreeText(data);
    result(response);
  } catch (error) {
    result(error);
  }
};

Task.fullPaymentBill = async function fullPaymentBill(id, result) {
  try {
    var response = await BillModel.fullPaymentBill(id);
    result(response);
  } catch (error) {
    result(error);
  }
};

Task.deleteBill = async function deleteBill(id, result) {
  try {
    var response = await BillModel.deleteBill(id);
    result(response);
  } catch (error) {
    result(error);
  }
};

Task.deleteListProductByListProductId =
  async function deleteListProductByListProductId(data, result) {
    try {
      var response = await BillModel.deleteListProductByListProductId(data);
      result(response);
    } catch (error) {
      result(error);
    }
  };

Task.deleteProductById = async function deleteProductById(data, result) {
  try {
    var response = await BillModel.deleteProductById(data);
    result(response);
  } catch (error) {
    result(error);
  }
};

module.exports = Task;
