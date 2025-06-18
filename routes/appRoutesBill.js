var BillController = require('../controllers/BillController');
var bill_model = require('../models/BillModels');

// generateBillNo

module.exports = function (app) {
    const key = '/api/v1';
    app.get(`${key}/bill/generateBillNo`, function (req, res) {
        BillController.generateBillNo(req.body, function (err, task) {
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

    // getBill
    app.get(`${key}/bill/getBill`, function (req, res) {
        BillController.getBill(req.body, function (err, task) {
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

    // getBillByBillNo/:bill_no
    app.get(`${key}/bill/getBillByBillNo/:bill_no`, function (req, res) {
        BillController.getBillByBillNo(req.params, function (err, task) {
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

      // getBillById/:id
      app.get(`${key}/bill/getBillById/:id`, function (req, res) {
        BillController.getBillById(req.params, function (err, task) {
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

    // searchBill
    app.post(`${key}/bill/searchBill`, function (req, res) {
        BillController.searchBill(req.body, function (err, task) {
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

    // getBillByCustomer
    app.get(`${key}/bill/getBillByCustomer`, function (req, res) {
        BillController.getBillByCustomer(req.body, function (err, task) {
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

    // getBillByDate
    app.get(`${key}/bill/getBillByDate`, function (req, res) {
        BillController.getBillByDate(req.body, function (err, task) {
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


    // createBillFreeText
    app.post(`${key}/bill/createBillFreeText`, function (req, res) {
        BillController.createBillFreeText(req.body, function (err, task) {
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

    // updateBillFreeText
    app.put(`${key}/bill/updateBillFreeText/:id`, function (req, res) {
        BillController.updateBillFreeText(req.body, function (err, task) {
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

    app.put(`${key}/bill/fullPaymentBill/:id`, function (req, res) {
        const id = req.params.id;
        BillController.fullPaymentBill( id, function (err, task) {
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


    // deleteBill
    app.delete(`${key}/bill/deleteBill/:id`, function (req, res) {
        const id = req.params.id;
        BillController.deleteBill( id, function (err, task) {
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

    app.delete(`${key}/bill/deleteListProductByInvoiceId/:bill_no`, function (req, res) {
        BillController.deleteListProductByListProductId(req.params, function (err, task) {
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
    // deleteProductById
    app.delete(`${key}/bill/deleteProductById/:id`, function (req, res) {
        BillController.deleteProductById(req.params, function (err, task) {
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
}

