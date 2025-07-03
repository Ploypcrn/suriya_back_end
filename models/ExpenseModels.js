var client = require("./BaseModel");
var Task = function (task) {
  this.task = task.task;
};

Task.getExpense = function getExpense(data, result) {
  return new Promise(function (resolve, reject) {
    var sql = `select
	te.id,
	te.expense_name,
	te.amount,
	te.remark,
	te.expense_type_id,
	tmet.expense_type_name,
	te.create_by,
	te.create_date,
	te.update_by,
	te.update_date,
	te.active_flag,
  te.group_type_id,
  te.ref_bill_number,
  te.payment_type_id,
  tmpt.payment_type_name,
  te.ref_cheque_number
from
	tb_expense te
left join tb_mas_expense_type tmet on tmet.id = te.expense_type_id and tmet.active_flag = 'Y'
left join tb_mas_payment_type tmpt on tmpt.id = te.payment_type_id and tmpt.active_flag = 'Y'
where te.active_flag = 'Y'
order by te.create_date desc`;

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

Task.getExpenseById = function getExpenseById(data, result) {
  return new Promise(function (resolve, reject) {
    var sql = `select
    te.expense_name,
    te.amount,
    te.remark,
    te.expense_type_id,
    tmet.expense_type_name,
    te.group_type_id,
    te.ref_bill_number,
    te.payment_type_id,
    tmpt.payment_type_name,
    te.ref_cheque_number
  from
    tb_expense te
  left join tb_mas_expense_type tmet on tmet.id = te.expense_type_id and tmet.active_flag = 'Y'
  left join tb_mas_payment_type tmpt on tmpt.id = te.payment_type_id and tmpt.active_flag = 'Y'
  where te.active_flag = 'Y' and te.id = $1`;

    client.query(sql, [data.id], function (err, res) {
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

Task.searchExpense = function searchExpense(data, result) {
  return new Promise(function (resolve, reject) {
    var sql = `select
    te.id,
    te.expense_name,
    te.amount,
    te.remark,
    te.expense_type_id,
    tmet.expense_type_name,
    te.create_by,
    te.create_date,
    te.update_by,
    te.update_date,
    te.active_flag,
    te.group_type_id,
    te.ref_bill_number,
    te.payment_type_id,
    tmpt.payment_type_name,
    te.ref_cheque_number
  from
    tb_expense te
  left join tb_mas_expense_type tmet on tmet.id = te.expense_type_id and tmet.active_flag = 'Y'
  left join tb_mas_payment_type tmpt on tmpt.id = te.payment_type_id and tmpt.active_flag = 'Y'
  where te.active_flag = 'Y' `;

    let params = [];
    let paramIndex = 1;

    if (data?.dateRange) {

      // check same date
      if (data.dateRange[0] === data.dateRange[1]) {
        sql += `and te.create_date between $${paramIndex++} and $${paramIndex++} `;
        params.push(data.dateRange[0].split("T")[0], data.dateRange[1]);
      } else {
        sql += `and te.create_date between $${paramIndex++} and $${paramIndex++} `;
        params.push(data.dateRange[0], data.dateRange[1]);
      }
    }

    if (data?.type) {
      sql += `and te.expense_type_id = $${paramIndex++} `;
      params.push(data.type);
    }

  if (data?.receiptNumber) {
      sql += `and te.ref_bill_number like '%$${paramIndex++}%' `;
      params.push(data.type);
    }

    sql += `order by te.create_date desc`;
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

Task.createExpense = function createExpense(data, result) {
  return new Promise(function (resolve, reject) {
    var sql = `insert
      into
      tb_expense
  (
    expense_name,
    amount,
    remark,
    expense_type_id,
    group_type_id,
    ref_bill_number,
    payment_type_id,
    ref_cheque_number,
    create_by,
    update_by
  )
  values(
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9,
  $10
  )`;

    client.query(
      sql,
      [
        data.expenseName,
        data.amount,
        data.expenseRemark,
        data.expenseType,
        data.group_type_id,
        data.ref_bill_number,
        data.payment_type_id,
        data.ref_cheque_number,
        "admin",
        "admin",
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

Task.updateExpense = function updateExpense(data) {
  return new Promise(function (resolve, reject) {
    var sql = `update
    tb_expense
  set
    expense_type_id = $1,
    expense_name = $2,
    amount = $3,
    remark = $4,
    group_type_id = $5,
    ref_bill_number = $6,
    payment_type_id = $7,
    ref_cheque_number = $8,
    update_by = 'admin',
    update_date = CURRENT_TIMESTAMP
  where
    id = $9`;

    client.query(
      sql,
      [
        data.expenseType,
        data.expenseName,
        data.amount,
        data.expenseRemark,
        data.group_type_id,
        data.ref_bill_number,
        data.payment_type_id,
        data.ref_cheque_number,
        data.id,
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

Task.deleteExpense = function deleteExpense(data, result) {
  return new Promise(function (resolve, reject) {
    var sql = `update
    tb_expense
  set
    update_by = 'admin',
    update_date = CURRENT_TIMESTAMP,
    active_flag = 'N'
  where
      id = $1`;
    client.query(sql, [data.id], function (err, res) {
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

module.exports = Task;
