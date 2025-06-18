var client = require("./BaseModel");
var dayJs = require("dayjs");
var Task = function (task) {
  this.task = task.task;
};

Task.generateBillNo = function generateBillNo(data, result) {
  return new Promise(function (resolve, reject) {
    var sql = "SELECT bill_number FROM tb_invoice ORDER BY id DESC LIMIT 1";
    client.query(sql, function (err, res) {
      let bill_no = "";
      if (res?.rowCount > 0) {
        let last_bill_no = res?.rows[0].bill_number;
        let last_year = last_bill_no?.substring(2, 4);
        let last_no = last_bill_no?.substring(4, 10);
        let current_year_th = new Date().getFullYear() + 543;
        let current_year = current_year_th.toString()?.substring(2, 4);
        if (current_year == last_year) {
          let new_no = parseInt(last_no) + 1;
          bill_no = current_year + new_no.toString().padStart(6, "0");
        } else {
          bill_no = current_year + "000001";
        }
      } else {
        let current_year_th = new Date().getFullYear() + 543;
        bill_no = current_year_th.toString()?.substring(2, 4) + "000001";
      }
      if (err) {
        const require = {
          data: [],
          error: err,
          query_result: false,
        };
        reject(require);
      } else {
        const require = {
          data: bill_no,
          error: err,
          query_result: true,
        };
        resolve(require);
      }
    });
    client.end;
  });
};

Task.getBill = function getBill(data, result) {
  return new Promise(function (resolve, reject) {
    var sql = `SELECT
        tb_invoice.id AS billId,
        tb_customer.deceased_name AS deceased,
        tb_customer.contact_person AS contact,
        tb_customer.customer_address AS address,
        tb_customer.mobile_no AS phone ,
        tb_customer.receive_from AS receiveFrom,
        tb_customer.send,
        tb_invoice.company_id,
        tb_company.company_name,
        bill_number AS billNo,
        tb_invoice.volume_no AS bookNo,
        tb_invoice.user_id,
        tb_invoice.payment_id,
        tb_mas_payment.payment_name AS paymentName,
        tb_invoice.total,
        tb_invoice.net_balance AS remaining,
        tb_invoice.deposit,
        tb_invoice.status_invoice AS status,
        tb_invoice.create_date AS billDateม
        (tb_invoice.total - tb_invoice.price_after_discount) AS discount,
    FROM
        tb_invoice
    LEFT JOIN tb_customer ON
        tb_invoice.id = tb_customer.invoice_id
    LEFT JOIN tb_mas_invoice_type ON
        tb_invoice.invoice_type_id = tb_mas_invoice_type.id
    LEFT JOIN tb_mas_payment ON
        tb_invoice.payment_id = tb_mas_payment.id
    LEFT JOIN tb_users ON
        tb_invoice.user_id = tb_users.id
    LEFT JOIN tb_company ON
        tb_invoice.company_id = tb_company.id
    WHERE
        tb_invoice.active_flag = 'Y' 
        AND DATE(tb_invoice.create_date) = CURRENT_DATE
    ORDER BY tb_invoice.id DESC`;
    client.query(sql, function (err, res) {
      if (err) {
        const require = {
          data: [],
          error: err,
          query_result: false,
        };
        reject(require);
      } else {
        const require = {
          data: res.rows,
          error: err,
          query_result: true,
        };
        resolve(require);
      }
    });
    client.end;
  });
};

Task.getBillByBillNo = function getBillByBillNo(data, result) {
  return new Promise(function (resolve, reject) {
    var sql = `SELECT
        tb_invoice.id AS billId,
        tb_customer.deceased_name AS deceased,
        tb_customer.contact_person AS contact,
        tb_customer.customer_address AS address,
        tb_customer.mobile_no AS phone ,
        tb_customer.receive_from AS receive,
        tb_invoice.receive_date AS receiveDate,
        tb_invoice.receive_time AS receiveTime,
        tb_customer.send,
        company_id,
        company_name,
        tb_invoice.donate,
        tb_invoice.issue_date AS issueDate,
        tb_invoice.issue_time AS issueTime,
        bill_number AS billNo,
        volume_no AS bookNo,
        user_id,
        tb_users.firstname || ' ' || tb_users.lastname AS billUser,
        payment_id,
        tb_mas_payment.payment_name AS paymentName,
        total,
        net_balance AS remaining,
        deposit,
        pay_extra AS payExtra,
        price_after_discount AS priceAfterDiscount,
        (total - price_after_discount) AS discount,
        status_invoice AS status,
        note,
        remark
    FROM
        tb_invoice
    LEFT JOIN tb_customer ON
        tb_invoice.id = tb_customer.invoice_id
    LEFT JOIN tb_mas_invoice_type ON
        tb_invoice.invoice_type_id = tb_mas_invoice_type.id
    LEFT JOIN tb_mas_payment ON
        tb_invoice.payment_id = tb_mas_payment.id
    LEFT JOIN tb_users ON
        tb_invoice.user_id = tb_users.id
    LEFT JOIN tb_company ON
        tb_invoice.company_id = tb_company.id
    WHERE
        tb_invoice.bill_number = $1`;

    client.query(sql, [data?.bill_no], function (err, res) {
      if (err) {
        const require = {
          data: [],
          error: err,
          query_result: false,
        };
        reject(require);
      } else {
        const require = {
          data: res.rows,
          error: err,
          query_result: true,
        };
        resolve(require);
      }
    });
    client.end;
  });
};

Task.getBillById = function getBillById(data, result) {
  return new Promise(function (resolve, reject) {
    var sql = `SELECT
        tb_invoice.id AS billId,
        tb_customer.deceased_name AS deceased,
        tb_customer.contact_person AS contact,
        tb_customer.customer_address AS address,
        tb_customer.mobile_no AS phone ,
        tb_customer.receive_from AS receive,
        tb_invoice.receive_date AS receiveDate,
        tb_invoice.receive_time AS receiveTime,
        tb_customer.send,
        company_id,
        company_name,
        tb_invoice.donate,
        tb_invoice.issue_date AS issueDate,
        tb_invoice.issue_time AS issueTime,
        bill_number AS billNo,
        volume_no AS bookNo,
        user_id,
        tb_users.firstname || ' ' || tb_users.lastname AS billUser,
        payment_id,
        tb_mas_payment.payment_name AS paymentName,
        total,
        net_balance AS remaining,
        deposit,
        pay_extra AS payExtra,
        price_after_discount AS priceAfterDiscount,
        (total - price_after_discount) AS discount,
        status_invoice AS status,
        note,
        remark
    FROM
        tb_invoice
    LEFT JOIN tb_customer ON
        tb_invoice.id = tb_customer.invoice_id
    LEFT JOIN tb_mas_invoice_type ON
        tb_invoice.invoice_type_id = tb_mas_invoice_type.id
    LEFT JOIN tb_mas_payment ON
        tb_invoice.payment_id = tb_mas_payment.id
    LEFT JOIN tb_users ON
        tb_invoice.user_id = tb_users.id
    LEFT JOIN tb_company ON
        tb_invoice.company_id = tb_company.id
    WHERE
        tb_invoice.id = $1`;

    client.query(sql, [data?.id], function (err, res) {
      if (err) {
        const require = {
          data: [],
          error: err,
          query_result: false,
        };
        reject(require);
      } else {
        const require = {
          data: res.rows,
          error: err,
          query_result: true,
        };
        resolve(require);
      }
    });
    client.end;
  });
};

Task.searchBill = function searchBill(data, result) {
  return new Promise(function (resolve, reject) {
    var sql =
      "SELECT " +
      "tb_invoice.id AS billId, " +
      "tb_customer.deceased_name AS deceased, " +
      "tb_customer.contact_person AS contact, " +
      "tb_customer.customer_address AS address, " +
      "tb_customer.mobile_no AS phone, " +
      "tb_customer.receive_from AS receive, " +
      "tb_invoice.receive_date AS receiveDate, " +
      "tb_invoice.receive_time AS receiveTime, " +
      "tb_customer.send, " +
      "company_id, " +
      "company_name, " +
      "tb_invoice.donate, " +
      "tb_invoice.issue_date AS issueDate, " +
      "tb_invoice.issue_time AS issueTime, " +
      "bill_number AS billNo, " +
      "volume_no AS bookNo, " +
      "user_id, " +
      "tb_users.firstname || ' ' || tb_users.lastname AS billUser, " +
      "payment_id, " +
      "tb_mas_payment.payment_name AS paymentName, " +
      "total, " +
      "net_balance AS remaining, " +
      "deposit, " +
      "pay_extra AS payExtra, " +
      "price_after_discount AS priceAfterDiscount, " +
      "(total - price_after_discount) AS discount, " +
      "status_invoice AS status, " +
      "tb_invoice.create_date AS billDate, " +
      "note, " +
      "remark " +
      "FROM " +
      "tb_invoice " +
      "LEFT JOIN tb_customer ON " +
      "tb_invoice.id = tb_customer.invoice_id " +
      "LEFT JOIN tb_mas_invoice_type ON " +
      "tb_invoice.invoice_type_id = tb_mas_invoice_type.id " +
      "LEFT JOIN tb_mas_payment ON " +
      "tb_invoice.payment_id = tb_mas_payment.id " +
      "LEFT JOIN tb_users ON " +
      "tb_invoice.user_id = tb_users.id " +
      "LEFT JOIN tb_company ON " +
      "tb_invoice.company_id = tb_company.id " +
      "WHERE " +
      "tb_invoice.active_flag = 'Y' ";
    let params = [];
    let paramIndex = 1;
    if (data?.receiptNumber) {
      sql += "AND tb_invoice.bill_number = $" + paramIndex++ + " ";
      params.push(data.receiptNumber);
    }
    if (data?.dateRange) {
      sql +=
        "AND tb_invoice.update_date BETWEEN $" +
        paramIndex++ +
        " AND $" +
        paramIndex++ +
        " ";
      params.push(
        dayJs(data.dateRange[0])
          .add(1, "day")
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        dayJs(data.dateRange[1])
          .add(1, "day")
          .endOf("day")
          .set("hour", 23)
          .set("minute", 59)
          .set("second", 59)
          .format("YYYY-MM-DD HH:mm:ss")
      );
    } else {
      sql += "AND DATE(tb_invoice.update_date) = CURRENT_DATE  ";
    }

    if (data?.status) {
      sql += "AND tb_invoice.status_invoice = $" + paramIndex++ + "  ";
      params.push(data.status);
    }
    if (data?.type) {
      sql += "AND tb_mas_payment.id = $" + paramIndex++ + "  ";
      params.push(data.type);
    }
    sql += "ORDER BY tb_invoice.id DESC";
    client.query(sql, params, function (err, res) {
      if (err) {
        const require = {
          data: [],
          error: err,
          query_result: false,
        };
        reject(require);
      } else {
        const require = {
          data: res.rows,
          error: err,
          query_result: true,
        };
        resolve(require);
      }
    });
    client.end;
  });
};

Task.getBillByCustomer = function getBillByCustomer(data, result) {
  return new Promise(function (resolve, reject) {
    var sql =
      "SELECT * FROM tb_invoice WHERE customer_id = '" + data.customer_id + "'";
    client.query(sql, function (err, res) {
      if (err) {
        const require = {
          data: [],
          error: err,
          query_result: false,
        };
        reject(require);
      } else {
        const require = {
          data: res.rows,
          error: err,
          query_result: true,
        };
        resolve(require);
      }
    });
    client.end;
  });
};

Task.getBillListProductByBillNo = function getBillListProductByBillNo(
  data,
  result
) {
  return new Promise(function (resolve, reject) {
    var sql = `SELECT 
        tb_tem_stock.id AS listProductId,
        tb_tem_stock.invoice_id, 
        tb_tem_stock.stock_id,
        tb_tem_stock.stock_name,
        tb_tem_stock.stock_other,
        tb_tem_stock.amount_used,
        tb_tem_stock.price,
        tb_tem_stock.total_price,
        tb_stock.in_stock
        FROM tb_tem_stock 
        LEFT JOIN tb_stock ON tb_tem_stock.stock_id = tb_stock.id
        WHERE invoice_id = $1 AND tb_tem_stock.active_flag = 'Y' ORDER BY tb_tem_stock.id ASC`;
    client.query(sql, [data], function (err, res) {
      if (err) {
        const require = {
          data: [],
          error: err,
          query_result: false,
        };
        reject(require);
      } else {
        const require = {
          data: res.rows,
          error: err,
          query_result: true,
        };
        resolve(require);
      }
    });
    client.end;
  });
};

// getBillListProductFreeTextByBillNo
Task.getBillListProductFreeTextByBillNo =
  function getBillListProductFreeTextByBillNo(data, result) {
    var columns = [
      "tb_free_stock.id AS listProductId",
      "tb_free_stock.invoice_id",
      "tb_free_stock.stock_name",
      "tb_free_stock.amount_used",
      "tb_free_stock.price",
      "tb_free_stock.total_price",
    ];

    var sql = `SELECT ${columns.join(
      ", "
    )} FROM tb_free_stock WHERE invoice_id = $1 AND tb_free_stock.active_flag = 'Y' ORDER BY tb_free_stock.id ASC`;

    return new Promise(function (resolve, reject) {
      client.query(sql, [data], function (err, res) {
        if (err) {
          const require = {
            data: [],
            error: err,
            query_result: false,
          };
          reject(require);
        } else {
          const require = {
            data: res.rows,
            error: err,
            query_result: true,
          };
          resolve(require);
        }
      });
      client.end;
    });
  };

Task.getBillByDate = function getBillByDate(data, result) {
  return new Promise(function (resolve, reject) {
    var sql =
      "SELECT * FROM tb_invoice WHERE invoice_date BETWEEN '" +
      data.start_date +
      "' AND '" +
      data.end_date +
      "'";
    client.query(sql, function (err, res) {
      if (err) {
        const require = {
          data: [],
          error: err,
          query_result: false,
        };
        reject(require);
      } else {
        const require = {
          data: res.rows,
          error: err,
          query_result: true,
        };
        resolve(require);
      }
    });
    client.end;
  });
};

Task.createBill = function createBill(data, result) {
  return new Promise(function (resolve, reject) {
    var columns = [
      "payment_id",
      "user_id",
      "company_id",
      "invoice_type_id",
      "issue_date",
      "donate",
      "receive_date",
      "volume_no",
      "bill_number",
      "price_after_discount",
      "deposit",
      "total",
      "payment",
      "net_balance",
      "note",
      "remark",
      "status_invoice",
      "create_by",
      "update_by",
    ];
    var values = [
      "$1",
      "$2",
      "$3",
      "$4",
      "$5",
      "$6",
      "$7",
      "$8",
      "$9",
      "$10",
      "$11",
      "$12",
      "$13",
      "$14",
      "$15",
      "$16",
      "$17",
      "$18",
      "$19",
    ];
    var dataValues = [
      data.paymentTypeId,
      data.billUserId,
      data.typeId,
      data.typeId,
      data.issueDate,
      data.donate,
      data.receiveDate,
      data.bookNo,
      data.billNo,
      data.priceAfterDiscount,
      data.deposit,
      data.sum,
      data.paymentTypeId,
      data.remaining,
      data.note,
      data.remark,
      "2",
      "admin",
      "admin",
    ];
    if (data.issueTime) {
      columns.push("issue_time");
      values.push("$20");
      dataValues.push(data.issueTime);
    }
    if (data.receiveTime) {
      columns.push("receive_time");
      values.push("$21");
      dataValues.push(data.receiveTime);
    }
    var sql = `INSERT INTO tb_invoice (${columns.join(
      ", "
    )}) VALUES (${values.join(", ")}) RETURNING id`;
    client.query(sql, dataValues, function (err, res) {
      if (err) {
        const require = {
          data: [],
          status: 500,
          error: err,
          query_result: false,
        };
        reject(require);
      } else {
        let invoice_id = res?.rows[0].id;
        let listProduct = data.listProduct;
        listProduct.forEach((element) => {
          element.invoice_id = invoice_id;
          Task.createListProduct(element, function (res) {});
        });
        Task.createCustomerByInvoiceId(data, invoice_id, function (res) {});
        const require = {
          data: res.rows,
          status: 200,
          error: err,
          query_result: true,
        };
        resolve(require);
      }
    });
    client.end;
  });
};

Task.createBillFreeText = async function createBillFreeText(data) {
  try {
    // 1. ดึงหมายเลขบิลล่าสุด
    const res = await client.query(
      "SELECT bill_number FROM tb_invoice ORDER BY id DESC LIMIT 1"
    );

    // 2. สร้างหมายเลขบิลใหม่
    let newBillNumber = "";
    let prefix =
      data?.typeId == 1 || data?.typeId == 3
        ? "BN"
        : data?.typeId == 2
        ? "WS"
        : "";
    const lastBillNo = res?.rowCount > 0 ? res?.rows[0]?.bill_number : null;

    const currentYearTH = new Date().getFullYear() + 543;
    const currentYear = currentYearTH.toString().substring(2, 4);

    if (lastBillNo) {
      const lastYear = lastBillNo.substring(2, 4);
      const lastNo = lastBillNo.substring(4, 10);
      newBillNumber =
        currentYear === lastYear
          ? prefix +
            currentYear +
            (parseInt(lastNo) + 1).toString().padStart(6, "0")
          : prefix + currentYear + "000001";
    } else {
      newBillNumber = prefix + currentYear + "000001";
    }

    // 3. สร้างข้อมูล SQL สำหรับ INSERT
    const columns = [
      "payment_id",
      "user_id",
      "company_id",
      "invoice_type_id",
      "issue_date",
      "donate",
      "receive_date",
      "volume_no",
      "bill_number",
      "price_after_discount",
      "deposit",
      "total",
      "payment",
      "net_balance",
      "note",
      "remark",
      "status_invoice",
      "create_by",
      "update_by",
      "pay_extra",
    ];
    const values = columns.map((_, idx) => `$${idx + 1}`);
    const dataValues = [
      data.paymentTypeId,
      data.billUserId,
      data.typeId,
      data.typeId,
      data.issueDate,
      data.donate,
      data.receiveDate,
      data.bookNo,
      newBillNumber,
      data.priceAfterDiscount,
      data.deposit,
      data.sum,
      data.paymentTypeId,
      data.remaining,
      data.note,
      data.remark,
      "2",
      "admin",
      "admin",
      data.payExtra || 0,
    ];

    if (data.issueTime) {
      columns.push("issue_time");
      values.push(`$${values.length + 1}`);
      dataValues.push(data.issueTime);
    }
    if (data.receiveTime) {
      columns.push("receive_time");
      values.push(`$${values.length + 1}`);
      dataValues.push(data.receiveTime);
    }

    const sql = `INSERT INTO tb_invoice (${columns.join(
      ", "
    )}) VALUES (${values.join(", ")}) RETURNING bill_number, id`;

    // 4. รันคำสั่ง INSERT
    const insertRes = await client.query(sql, dataValues);
    console.log(insertRes)
    const invoiceId = insertRes.rows[0].id;

    // 5. จัดการสินค้า (listProduct)
    if (data.listProduct && Array.isArray(data.listProduct)) {
      const productPromises = data.listProduct.map((product) => {
        product.invoice_id = invoiceId;
        return product.listProductId
          ? Task.updateListProductFreeText(product)
          : Task.createListProductFreeText(product);
      });
      await Promise.all(productPromises);
    }

    // 6. จัดการลูกค้า (customer)
    await Task.createCustomerByInvoiceId(data, invoiceId);

    // 7. ส่งผลลัพธ์กลับ
    return {
      data: insertRes.rows,
      status: 200,
      error: null,
      query_result: true,
    };
  } catch (err) {
    // 8. จัดการข้อผิดพลาด
    console.error("Error in createBillFreeText:", err);
    return {
      data: [],
      status: 500,
      error: err.message || err,
      query_result: false,
    };
  }
};

Task.createListProduct = function createListProduct(data, result) {
  return new Promise(function (resolve, reject) {
    var sql =
      "INSERT INTO tb_tem_stock " +
      "( " +
      "invoice_id, " +
      "stock_id, " +
      "stock_name, " +
      "stock_other, " +
      "amount_used, " +
      "price, " +
      "total_price " +
      ") " +
      "VALUES( " +
      "$1, " +
      "$2, " +
      "$3, " +
      "$4, " +
      "$5, " +
      "$6, " +
      "$7 " +
      ") " +
      "RETURNING id";
    client.query(
      sql,
      [
        data.invoice_id,
        data.stockId,
        data.stockName,
        data.stockOther,
        data.amount,
        data.price,
        data.totalPrice,
      ],
      function (err, res) {
        if (err) {
          const require = {
            data: [],
            error: err,
            query_result: false,
          };
          reject(require);
        } else {
          let stock_id = data.stockId;
          let amount_used = data.amount;
          if (data.stockName !== "อื่นๆ") {
            Task.updateStock(stock_id, amount_used, function (res) {});
          }
          const require = {
            data: res.rows,
            error: err,
            query_result: true,
          };
          resolve(require);
        }
      }
    );
    client.end;
  });
};

Task.createListProductFreeText = function createListProductFreeText(
  data,
  result
) {
  var columns = [
    "invoice_id",
    "stock_name",
    "amount_used",
    "price",
    "total_price",
    "craeted_by",
    "updated_by",
  ];
  var values = ["$1", "$2", "$3", "$4", "$5", "$6", "$7"];

  var dataValues = [
    data.invoice_id,
    data.stockName,
    data.amount,
    data.price,
    data.totalPrice,
    "admin",
    "admin",
  ];

  var sql = `INSERT INTO tb_free_stock (${columns.join(
    ", "
  )}) VALUES (${values.join(", ")}) RETURNING id`;

  return new Promise(function (resolve, reject) {
    client.query(sql, dataValues, function (err, res) {
      console.log("createListProductFreeText err :", err);
      if (err) {
        const require = {
          data: [],
          error: err,
          query_result: false,
        };
        reject(require);
      } else {
        const require = {
          data: res.rows,
          error: err,
          query_result: true,
        };
        resolve(require);
      }
    });
    client.end;
  });
};

Task.createCustomerByInvoiceId = function createCustomerByInvoiceId(
  data,
  invoice_id,
  result
) {
  let date = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
  let dateTime = date.toString();
  return new Promise(function (resolve, reject) {
    var sql =
      "INSERT INTO tb_customer " +
      "( " +
      "invoice_id, " +
      "deceased_name, " +
      "contact_person, " +
      "customer_address, " +
      "mobile_no, " +
      "receive_from, " +
      "send, " +
      "create_by, " +
      "create_date, " +
      "update_by, " +
      "update_date, " +
      "active_flag " +
      ") " +
      "VALUES( " +
      "$1, " +
      "$2, " +
      "$3, " +
      "$4, " +
      "$5, " +
      "$6, " +
      "$7, " +
      "$8, " +
      "$9, " +
      "$10, " +
      "$11, " +
      "$12 " +
      ") " +
      "RETURNING id";
    client.query(
      sql,
      [
        invoice_id,
        data.deceased,
        data.contact,
        data.address,
        data.phone,
        data.receiveFrom,
        data.send,
        "admin",
        dateTime,
        "admin",
        dateTime,
        "Y",
      ],
      function (err, res) {
        if (err) {
          const require = {
            data: [],
            error: err,
            query_result: false,
          };
          reject(require);
        } else {
          const require = {
            data: res.rows,
            error: err,
            query_result: true,
          };
          resolve(require);
        }
      }
    );
    client.end;
  });
};

Task.deleteListProductFreeTextByInvoiceId =
  function deleteListProductFreeTextByInvoiceId(data) {
    return new Promise(function (resolve, reject) {
      var sql = "DELETE FROM tb_free_stock WHERE invoice_id = $1";
      client.query(sql, [data], function (err, res) {
        if (err) {
          const require = {
            data: [],
            error: err,
            query_result: false,
          };
          reject(require);
        } else {
          const require = {
            data: res.rows,
            error: err,
            query_result: true,
          };
          resolve(require);
        }
      });
      client.end;
    });
  };

Task.updateStock = function updateStock(stock_id, amount_used, result) {
  return new Promise(function (resolve, reject) {
    var sql =
      "UPDATE tb_stock SET in_stock = in_stock - " +
      amount_used +
      " WHERE id = " +
      stock_id;
    client.query(sql, function (err, res) {
      try {
        const require = {
          data: res.rows,
          error: err,
          query_result: true,
        };
        resolve(require);
      } catch (error) {
        const require = {
          data: [],
          error: err,
          query_result: false,
        };
        reject(require);
      }
    });
    client.end;
  });
};

Task.updateBill = async function updateBill(data) {
  const client = new Client(); // Ensure the client is properly initialized
  await client.connect(); // Connect to the database
  try {
    // Prepare columns and values
    let columns = [
      "payment_id = $1",
      "user_id = $2",
      "company_id = $3",
      "invoice_type_id = $4",
      "issue_date = $5",
      "receive_date = $6",
      "volume_no = $7",
      "bill_number = $8",
      "price_after_discount = $9",
      "deposit = $10",
      "pay_extra = $11",
      "total = $12",
      "payment = $13",
      "net_balance = $14",
      "note = $15",
      "remark = $16",
      "status_invoice = $17",
      "update_by = $18",
    ];

    let dataValues = [
      data.paymentTypeId,
      data.billUserId,
      data.companyId,
      data.typeId,
      data.issueDate,
      data.receiveDate,
      data.bookNo,
      data.billNo,
      data.priceAfterDiscount,
      data.deposit,
      data.payExtra,
      data.sum,
      data.paymentTypeId,
      data.remaining,
      data.note,
      data.remark,
      data.status,
      "admin",
    ];

    // Handle optional time fields
    if (data?.issueTime) {
      columns.push("issue_time = $" + (dataValues.length + 1));
      dataValues.push(formatDate(data.issueTime)); // Ensure valid format
    }

    if (data?.receiveTime) {
      columns.push("receive_time = $" + (dataValues.length + 1));
      dataValues.push(formatDate(data.receiveTime)); // Ensure valid format
    }

    // Add billId to the WHERE clause
    const whereClause = `WHERE id = $${dataValues.length + 1}`;
    dataValues.push(data.billId);

    const sql = `UPDATE tb_invoice SET ${columns.join(", ")} ${whereClause}`;
    const result = await client.query(sql, dataValues);

    // Handle product updates
    if (data.listProduct) {
      for (const product of data.listProduct) {
        if (product.stockName !== "อื่นๆ") {
          if (product.listProductId) {
            await Task.getStockByStockId(product);
          } else {
            product.invoice_id = data.billId;
            await Task.createListProduct(product);
          }
        } else {
          if (product.listProductId) {
            await Task.updateListProduct(product);
          } else {
            product.invoice_id = data.billId;
            await Task.createListProduct(product);
          }
        }
      }
    }

    // Update customer by invoice ID
    await Task.updateCustomerByInvoiceId(data);

    return {
      data: result,
      error: null,
      query_result: true,
    };
  } catch (err) {
    console.error("Error updating bill:", err);
    return {
      data: [],
      error: err,
      query_result: false,
    };
  } finally {
    await client.end(); // Ensure the connection is closed
  }
};


Task.fullPaymentBill = function fullPaymentBill(id) {
  return new Promise(function (resolve, reject) {
    var sql = "UPDATE tb_invoice SET pay_extra = net_balance, net_balance = 0, status_invoice  = 1 WHERE id = " + id;

    client.query(sql, function (err, res) {
      try {
        const require = {
          data: res.rows,
          error: err,
          query_result: true,
        };
        resolve(require);
      } catch (error) {
        const require = {
          data: [],
          error: err,
          query_result: false,
        };
        reject(require);
      }
    });
    client.end;
  });
};

// Helper function to format dates
function formatDate(date) {
  if (!date) return null;
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) throw new Error(`Invalid date format: ${date}`);
  return parsedDate.toISOString(); // Convert to ISO 8601 format
}

Task.updateBillFreeText = async function updateBillFreeText(data) {
  try {

 let prefix = "";

if (data?.typeId === 1 || data?.typeId === 3) {
  prefix = "BN";
} else if (data?.typeId === 2) {
  prefix = "WS";
}

const current_bill = data?.bill_number || "";

if (current_bill.substring(0, 2) !== prefix) {
  const suffix = current_bill.length > 2 ? current_bill.slice(2) : "";
  data.bill_number = prefix + suffix;
}


    const sql = `
    UPDATE public.tb_invoice
    SET 
        payment_id = $1, 
        user_id = $2, 
        company_id = $3, 
        invoice_type_id = $4, 
        issue_date = $5, 
        total = $6, 
        payment = $7, 
        net_balance = $8, 
        note = $9, 
        update_date = CURRENT_TIMESTAMP, 
        remark = $10, 
        status_invoice = $11, 
        price_after_discount = $12, 
        deposit = $13, 
        receive_date = $14, 
        receive_time = $15, 
        issue_time = $16, 
        donate = $17, 
        pay_extra = $18,
        bill_number = $19
    WHERE id = $20;
`;

    const values = [
      data.paymentTypeId,
      data.billUserId,
      data.typeId,
      data.typeId,
      data.issueDate,
      data.sum,
      data.paymentTypeId,
      data.remaining,
      data.note,
      data.remark,
      data.status,
      data.priceAfterDiscount,
      data.deposit,
      data.receiveDate,
      data.receiveTime,
      data.issueTime,
      data.donate,
      data.payExtra,
      data.bill_number,
      data.billId,
    ];

    const result = await client.query(sql, values);
    const result2 = await Task.updateCustomerByInvoiceId(data);

    await Task.deleteListProductFreeTextByInvoiceId(data.billId);
    if (data.listProduct && Array.isArray(data.listProduct)) {
      const productTasks = data.listProduct.map(async (product) => {
        product.invoice_id = data.billId;
        return Task.createListProductFreeText(product);
      });
      await Promise.all(productTasks);
    }
    return {
      data: result,
      error: null,
      query_result: true,
    };
  } catch (err) {
    console.error("Error in updateBillFreeText:", err);
    return {
      data: [],
      error: err,
      query_result: false,
    };
  }
};

// Helper to validate and format time
function validateAndFormatTime(time) {
  if (!time) return null;
  const timeRegex = /^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)$/;
  if (!timeRegex.test(time)) {
    console.warn(`Invalid time format: ${time}`);
    return null;
  }
  return time.includes(":")
    ? time
    : `${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4)}`;
}

Task.updateListProduct = function updateListProduct(data, result) {
  return new Promise(function (resolve, reject) {
    var sql =
      "UPDATE tb_tem_stock SET " +
      "stock_id = $1, " +
      "stock_name = $2, " +
      "amount_used = $3, " +
      "price = $4, " +
      "total_price = $5, " +
      "update_by = $6, " +
      "update_date = $7 " +
      "WHERE id = $8";
    client.query(
      sql,
      [
        data.stockId,
        data.stockName,
        data.amount,
        data.price,
        data.totalPrice,
        data.update_by,
        data.update_date,
        data.listProductId,
      ],
      function (err, res) {
        try {
          let stock_id = data.stockId;
          let amount_used = data.amount;
          const require = {
            data: res.rows,
            error: err,
            query_result: true,
          };
          resolve(require);
        } catch (error) {
          const require = {
            data: [],
            error: err,
            query_result: false,
          };
          reject(require);
        }
      }
    );
    client.end;
  });
};

Task.updateListProductFreeText = function updateListProductFreeText(
  data,
  result
) {
  var columns = [
    "stock_name = $1",
    "amount_used = $2",
    "price = $3",
    "total_price = $4",
    "updated_by = $5",
  ];

  var dataValues = [
    data.stockName,
    data.amount,
    data.price,
    data.totalPrice,
    "admin",
    data.listProductId,
  ];

  var sql = `UPDATE tb_free_stock SET ${columns.join(", ")} WHERE id = $6`;

  return new Promise(function (resolve, reject) {
    client.query(sql, dataValues, function (err, res) {
      try {
        const require = {
          data: res.rows,
          error: err,
          query_result: true,
        };
        resolve(require);
      } catch (error) {
        const require = {
          data: [],
          error: err,
          query_result: false,
        };
        reject(require);
      }
    });
    client.end;
  });
};

Task.getStockByStockId = function getStockByStockId(data, result) {
  return new Promise(function (resolve, reject) {
    var sql =
      "SELECT tb_stock.in_stock, tb_tem_stock.amount_used " +
      "FROM tb_stock " +
      "LEFT JOIN tb_tem_stock ON tb_stock.id = tb_tem_stock.stock_id " +
      "WHERE tb_stock.id = " +
      data.stockId;
    client.query(sql, function (err, res) {
      try {
        let in_stock = res?.rows[0].in_stock;
        let amount_used_before = res?.rows[0].amount_used;
        let amount_used = data.amount;
        let amount_used_diff =
          amount_used_before > amount_used
            ? (in_stock =
                parseInt(in_stock) +
                (parseInt(amount_used_before) - parseInt(amount_used)))
            : (in_stock =
                parseInt(in_stock) -
                (parseInt(amount_used) - parseInt(amount_used_before)));

        Task.updateStockByStockId(data, amount_used_diff, function (res) {});

        const require = {
          data: res,
          error: err,
          query_result: true,
        };
        resolve(require);
      } catch (error) {
        const require = {
          data: [],
          error: err,
          query_result: false,
        };
        reject(require);
      }
    });
    client.end;
  });
};

Task.updateStockByStockId = function updateStockByStockId(
  data,
  in_stock,
  result
) {
  return new Promise(function (resolve, reject) {
    var sql =
      "UPDATE tb_stock SET in_stock = " +
      in_stock +
      " WHERE id = " +
      data.stockId;
    client.query(sql, function (err, res) {
      try {
        Task.updateListProduct(data, function (res) {});
        const require = {
          data: res,
          error: err,
          query_result: true,
        };
        resolve(require);
      } catch (error) {
        const require = {
          data: [],
          error: err,
          query_result: false,
        };
        reject(require);
      }
    });
    client.end;
  });
  return null;
};

Task.updateCustomerByInvoiceId = function updateCustomerByInvoiceId(
  data,
  result
) {
  return new Promise(function (resolve, reject) {
    var sql =
      "UPDATE tb_customer SET " +
      "deceased_name = $1, " +
      "contact_person = $2, " +
      "customer_address = $3, " +
      "mobile_no = $4, " +
      "receive_from = $5, " +
      "send = $6, " +
      "update_by = $7, " +
      "update_date = $8 " +
      "WHERE invoice_id = $9";
    client.query(
      sql,
      [
        data.deceased,
        data.contact,
        data.address,
        data.phone,
        data.receiveFrom,
        data.send,
        "admin",
        data.update_date,
        data.billId,
      ],
      function (err, res) {
        try {
          const require = {
            data: res.rows,
            error: err,
            query_result: true,
          };
          resolve(require);
        } catch (error) {
          const require = {
            data: [],
            error: err,
            query_result: false,
          };
          reject(require);
        }
      }
    );
    client.end;
  });
};

Task.deleteListProductByListProductId =
  function deleteListProductByListProductId(data, result) {
    return new Promise(function (resolve, reject) {
      var sql = "DELETE FROM tb_tem_stock WHERE id = $1";
      client.query(sql, [data.listProductId], function (err, res) {
        try {
          const require = {
            data: res,
            error: err,
            query_result: true,
          };
          resolve(require);
        } catch (error) {
          const require = {
            data: [],
            error: err,
            query_result: false,
          };
          reject(require);
        }
      });
      client.end;
    });
  };

Task.deleteProductById = function deleteProductById(data, result) {
  return new Promise(function (resolve, reject) {
    var sql = "DELETE FROM tb_free_stock WHERE id = $1";
    client.query(sql, [data.id], function (err, res) {
      try {
        const require = {
          data: res,
          error: err,
          query_result: true,
        };
        resolve(require);
      } catch (error) {
        const require = {
          data: [],
          error: err,
          query_result: false,
        };
        reject(require);
      }
    });
    client.end;
  });
};

Task.deleteBill = function deleteBill(id, result) {
  return new Promise(function (resolve, reject) {
    var sql = "DELETE FROM tb_invoice WHERE id = $1";
    client.query(sql, [id], function (err, res) {
      try {
        const require = {
          data: res,
          error: err,
          query_result: true,
        };
        Task.deleteStockByBillId(id, function (res) {});
        resolve(require);
      } catch (error) {
        const require = {
          data: [],
          error: err,
          query_result: false,
        };
        reject(require);
      }
    });
    client.end;
  });
};

Task.deleteStockByBillId = function deleteStockByBillId(id, result) {
  return new Promise(function (resolve, reject) {
    var sql = "DELETE FROM tb_free_stock WHERE invoice_id = $1";
    client.query(sql, [id], function (err, res) {
      try {
        const require = {
          data: res,
          error: err,
          query_result: true,
        };
        resolve(require);
      } catch (error) {
        const require = {
          data: [],
          error: err,
          query_result: false,
        };
        reject(require);
      }
    });
    client.end;
  });
};

module.exports = Task;
