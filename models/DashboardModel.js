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
        var sql = `with all_dates as (
                    select date_trunc('${checkFilterType(data)}', tbi.create_date) as create_date,
                        sum(tbi.price_after_discount - tbi.net_balance) as price_after_discount, 
                        0 as total_expense
                    from tb_invoice tbi
                    where tbi.status_invoice <> '3'
                    and tbi.create_date::date between $1 AND $2
                    group by date_trunc('${checkFilterType(data)}', tbi.create_date)

                    union

                    select date_trunc('${checkFilterType(data)}', te.expense_date) as create_date,
                        0 as price_after_discount, 
                        sum(te.amount) as total_expense
                    from tb_expense te
                    where te.active_flag = 'Y'
                    and te.expense_date::date between $1 AND $2
                    group by date_trunc('${checkFilterType(data)}', te.expense_date)
                ),
                results as (
                    select create_date,
                        sum(price_after_discount) as price_after_discount,
                        sum(total_expense) as total_expense
                    from all_dates
                    group by create_date
                )
                select *
                from results
                order by create_date;`;

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
        var sql = `with all_dates as (
                    select date_trunc('${checkFilterType(data)}', tbi.create_date) as create_date,
                        sum(tbi.total) as total, 
                        sum(tbi.net_balance) as remain, 
                        sum(tbi.total - tbi.price_after_discount) as discount,
                        sum(tbi.deposit) as deposit, 
                        sum(tbi.price_after_discount) as price_after_discount, 
                        count(tbi.id) as total_bill,
                        sum(case when tbi.net_balance > 0 then 1 else 0 end) as total_remain_bill,
                        0 as total_expense
                    from tb_invoice tbi
                    where tbi.status_invoice <> '3'
                    and tbi.create_date::date between $1 AND $2
                    group by date_trunc('${checkFilterType(data)}', tbi.create_date)

                    union

                    select date_trunc('${checkFilterType(data)}', te.expense_date) as create_date,
                        0 as total, 
                        0 as remain, 
                        0 as discount,
                        0 as deposit, 
                        0 as price_after_discount, 
                        0 as total_bill,
                        0 as total_remain_bill,
                        sum(te.amount) as total_expense
                    from tb_expense te
                    where te.active_flag = 'Y'
                    and te.expense_date::date between $1 AND $2
                    group by date_trunc('${checkFilterType(data)}', te.expense_date)
                ),
                results as (
                    select d.create_date, 
                        sum(coalesce(d.total, 0)) as total, 
                        sum(coalesce(d.remain, 0)) as remain, 
                        sum(coalesce(d.discount, 0)) as discount,
                        sum(coalesce(d.deposit, 0)) as deposit, 
                        sum(coalesce(d.price_after_discount, 0)) as price_after_discount,
                        sum(coalesce(d.total_expense, 0)) as total_expense,
                        sum(coalesce(d.total_bill, 0)) as total_bill,
                        sum(coalesce(d.total_remain_bill, 0)) as total_remain_bill
                    from all_dates d
                    group by d.create_date
                )
                select r.*, 
                    (r.price_after_discount - r.total_expense) as profit,
                    case when r.price_after_discount > 0 
                            then round(((r.price_after_discount - r.total_expense) / r.price_after_discount * 100), 2) 
                            else 0 end as efficiency,
                    case when r.price_after_discount > 0 
                            then round(((r.price_after_discount - r.remain) / r.price_after_discount * 100), 2) 
                            else 0 end as collectionRate
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
