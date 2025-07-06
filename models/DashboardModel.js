var client = require('./BaseModel');
var Task = function (task) {
    this.task = task.task;
};

Task.getHeader = async function getHeader(data) {
    return new Promise(function (resolve, reject) {
        var sql = `select sum(tbi.total) as total, sum(tbi.net_balance) as remain, sum(tbi.total - tbi.price_after_discount) as dicount,
                    sum(tbi.deposit) as deposit, sum(tbi.price_after_discount) as price_after_discount, 
                    count(tbi.id) as total_bill,
                    sum(case when tbi.net_balance > 0 then 1 else 0 end) as total_remain_bill,
                    (select sum(te.amount) as amount from tb_expense te 
                    where te.active_flag = 'Y'
                    and te.expense_date::date between $1 AND $2
                    ) as total_expense
                    from tb_invoice tbi
                    where tbi.status_invoice <> '3'
                    and tbi.create_date::date between $1 AND $2;`;

        client.query(sql, [data.dtStart, data.dtEnd], function (err, result) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });
};

Task.getExpenseSummary = async function getExpenseSummary(data) {
    return new Promise(function (resolve, reject) {
        var sql = `select tmet.expense_type_name, coalesce(sum(te.amount), 0) as total from tb_mas_expense_type tmet
                    left join tb_expense te  on te.expense_type_id = tmet.id and te.active_flag = 'Y' and te.expense_date::date between $1 AND $2
                    group by tmet.id, tmet.expense_type_name
                    order by tmet.id asc;`;
        client.query(sql, [data.dtStart, data.dtEnd], function (err, result) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });
};

Task.getExpenseComparison = async function getExpenseComparison(data) {
    return new Promise(function (resolve, reject) {
        var sql = `select date_trunc('${checkFilterType(data)}', tbi.create_date) as create_date,
                    sum(tbi.price_after_discount) as price_after_discount, 
                    coalesce(sum(expense.amount), 0) as total_expense
                    from tb_invoice tbi
                    left join (
                    select date_trunc('${checkFilterType(data)}', te.expense_date) as create_date, sum(te.amount) as amount from tb_expense te 
                    where te.active_flag = 'Y'
                    and te.expense_date::date between $1 AND $2
                    group by date_trunc('${checkFilterType(data)}', te.expense_date)
                    ) as expense on date_trunc('${checkFilterType(data)}', tbi.create_date) = expense.create_date
                    where tbi.status_invoice <> '3'
                    and tbi.create_date::date between $1 AND $2
                    group by date_trunc('${checkFilterType(data)}', tbi.create_date);`;

        client.query(sql, [data.dtStart, data.dtEnd], function (err, result) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });
};


Task.getOperatingResult = async function getOperatingResult(data) {
    return new Promise(function (resolve, reject) {
        var sql = `with results as (
                        select date_trunc('${checkFilterType(data)}', tbi.create_date) as create_date , sum(tbi.total) as total, sum(tbi.net_balance) as remain, sum(tbi.total - tbi.price_after_discount) as dicount,
                        sum(tbi.deposit) as deposit, sum(tbi.price_after_discount) as price_after_discount, 
                        coalesce(sum(expense.amount), 0) as total_expense
                        from tb_invoice tbi
                        left join (
                        select date_trunc('${checkFilterType(data)}', te.expense_date) as create_date, sum(te.amount) as amount from tb_expense te 
                        where te.active_flag = 'Y'
                        and te.expense_date::date between $1 AND $2
                        group by date_trunc('${checkFilterType(data)}', te.expense_date)
                        ) as expense on date_trunc('${checkFilterType(data)}', tbi.create_date) = expense.create_date
                        where tbi.status_invoice <> '3'
                        and tbi.create_date::date between $1 AND $2
                        group by date_trunc('${checkFilterType(data)}', tbi.create_date)
                    )
                    select r.*, (r.price_after_discount - r.total_expense) as profit,
                    round(((r.price_after_discount - r.total_expense) / r.price_after_discount * 100), 2) as efficiency,
                    round(((r.price_after_discount - r.remain) / r.price_after_discount * 100), 2) as collectionRate
                    from results r
                    order by r.create_date;`;

        client.query(sql, [data.dtStart, data.dtEnd], function (err, result) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });
};

const checkFilterType = function(data) {
    switch(data.type)
    {
        case "month":
            return "day";
        case "year":
            return "month";
        default:
            return "day";
    }
};

module.exports = Task;
