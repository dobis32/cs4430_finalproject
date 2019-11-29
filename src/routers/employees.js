const express = require('express');
const db = require('../mysql/db')
const dbconnection = db();

const router = new express.Router();

router.get('/employees', async (req, res) => {
    let links = {
        id: `/employees?sort=employeeid&order=asc`,
        lastname: `/employees?sort=lastname&order=asc`,
        hiredate: `/employees?sort=hiredate&order=asc`,
        commission: `/employees?sort=commission&order=asc`
    }
    if (req.query.sort && req.query.order) {
        if (req.query.sort == 'employeeid') {
            links.id = `/employees?sort=employeeid&order=${req.query.order == 'asc' ? 'desc' : 'asc'}`
        }
        else if (req.query.sort == 'lastname'){
            links.lastname = `/employees?sort=lastname&order=${req.query.order == 'asc' ? 'desc' : 'asc'}`
        }
        else if (req.query.sort == 'hiredate'){
            links.hiredate = `/employees?sort=hiredate&order=${req.query.order == 'asc' ? 'desc' : 'asc'}`
        }
        else if (req.query.sort == 'commission'){
            links.commission = `/employees?sort=commission&order=${req.query.order == 'asc' ? 'desc' : 'asc'}`
        }
        
    }
    if(req.query.id){
        let data;        
        dbconnection.query(`SELECT * FROM employees WHERE employees.EmployeeID = ${req.query.id};`, (error, results, fields) => {
            if (error) throw error;
            let data = [];
            results.forEach(record =>{
                data.push(record)
            })
            if (data.length > 0) {
                res.send({ data: JSON.stringify(data),status: true });
            } else {
                res.send({ status: false });
            }
        })
    } else {
        var data = [];
        var sales = [];
        dbconnection.beginTransaction((error) => {
            const failureResponse = () => {
                res.send({ status: false, message: 'Something failed!'})
            }
            if (error) {
                dbconnection.rollback(failureResponse());
            } else {
                dbconnection.query(`SELECT EmployeeID, SUM(SubTotal) AS s1 FROM sales GROUP BY EmployeeID`, (error, results, fields) => {
                    if (error) {
                        dbconnection.rollback(failureResponse());
                    } else {
                        results.forEach(record => {
                            sales.push(record)
                        });
                        let orderClause = '';
                        if (req.query.sort && req.query.order) {
                            orderClause = `ORDER BY ${req.query.sort} ${req.query.order}`
                        }
                        dbconnection.query(`SELECT * FROM employees ${orderClause}`, (error, results, fields) => {
                            if (error) {
                                console.log('[ERROR]', error);
                                dbconnection.rollback(failureResponse());
                            } else {
                                results.forEach(record => {
                                    record.allSales = 0;
                                    data.push(record)
                                });
                                dbconnection.commit((error) => {
                                    if (error) {
                                        dbconnection.rollback(failureResponse);
                                    }
                                    else {
                                        for(let i = 0; i < sales.length; i++) {
                                            for(let k = 0; k < data.length; k++) {
                                                if(sales[i].EmployeeID == data[k].EmployeeID){
                                                    data[k].allSales = sales[i].s1
                                                }
                                            }
                                        }
                                        res.render('employees', { data: JSON.stringify(data), links });
                                    } 
                                }); 
                            }
                        });
                    }
                });
            }
        });
    }
});

router.get('/employees/edit', async (req, res) => {
    if(req.query.id){
        let id = req.query.id;
        let employee = {}
        if (id > 0) {
            let data;
            dbconnection.query(`SELECT * FROM employees, (SELECT EmployeeID, SUM(SubTotal) AS allSales FROM sales GROUP BY EmployeeID) AS s1 WHERE employees.EmployeeID = ${req.query.id} AND employees.EmployeeID = s1.EmployeeID;`, (error, results, fields) => {
                if (error) {
                    console.log('[ERROR]', error);
                }
                let data = [];
                results.forEach(record =>{
                    data.push(record);
                });
                employee = data[0]
                res.render('employee_edit', { data: JSON.stringify(employee) , id: JSON.stringify(employee.EmployeeID)});
            });
        } else {
            res.render('employee_edit', { data: JSON.stringify(employee) , id: JSON.stringify(id)});
        }
    }
    else {
        res.redirect('/customers');
    }
});

router.post('/employees/save', async (req, res) => {
    try{
        if(req.body.id > 0){
            dbconnection.query(`UPDATE employees SET FirstName = '${req.body.firstName}', LastName = '${req.body.lastName}', HireDate = '${req.body.hireDate}', SalesToDate = ${req.body.salesToDate}, Phone = '${req.body.phone}', Commission = ${req.body.commission} WHERE EmployeeID = '${req.body.id}'`, (error, results, fields) => {
                if (error)  console.log(error);
                res.status(201).send({status: true})
            });
        } else {
            dbconnection.query(`INSERT INTO employees (FirstName, LastName, HireDate, SalesToDate, Phone, Commission) VALUES ('${req.body.firstName}', '${req.body.lastName}', '${req.body.hireDate}', ${req.body.salesToDate}, '${req.body.phone}' , ${req.body.commission})`, (error, results, fields) => {
                if (error) throw error;
                res.status(201).send({status: true})
            });
        }
        
    } catch (error) {
        res.status(500).send({status: false})
    }
    
});

router.post('/employees/remove', async (req, res) => {
    const id = req.body.id;
    if(id && id > 0){
        dbconnection.beginTransaction((error) => {
            const failureResponse = () => {
                res.send({ status: false, message: 'Something failed!'})
            }
            if (error) {
                dbconnection.rollback(failureResponse());
            }
            dbconnection.query(`UPDATE sales SET EmployeeID = NULL WHERE EmployeeID = ${req.body.id}`, (error, results, fields) => {
                if (error) {
                    dbconnection.rollback(failureResponse());
                }
                else {
                    dbconnection.query(`DELETE FROM employees WHERE EmployeeID = ${req.body.id}`, (error, results, fields) => {
                        if (error) {
                            console.log('[ERROR]', error);
                            dbconnection.rollback(failureResponse());
                        } else {
                            dbconnection.commit((error) => {
                                if (error) {
                                    dbconnection.rollback(failureResponse);
                                }
                                else {
                                    res.send({ status: true, message: 'Record removed!' });
                                }
                            });
                        }
                    });
                }
            });
        });
    }
    else {
        res.status(404).send({status: false})
    }
});

module.exports = router;
