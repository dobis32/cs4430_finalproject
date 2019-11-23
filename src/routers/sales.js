const express = require('express');
const db = require('../mysql/db')
const dbconnection = db();

const router = new express.Router();

router.get('/sales', async (req, res) => {
    let data;
    dbconnection.query('SELECT * FROM sales', (error, results, fields) => {
        if (error) {
            console.log('[ERROR]', error)
        }
        let data = [];
        results.forEach(record =>{
            data.push(record)
        });
        res.render('sales', { data: JSON.stringify(data) });
    })
});

router.get('/sales/edit', async (req, res) => {
    if(req.query.id){
        const id = req.query.id;
        let sale = {}
        if(id > 0){
            dbconnection.query(`SELECT * FROM sales WHERE SaleID = ${id}`, (error, results, fields) => {
                if (error) {
                    console.log('[ERROR]', error)
                }
                let data = [];
                results.forEach(record =>{
                    data.push(record)
                });
                sale = data[0];
                res.render('sale_edit', { data: JSON.stringify(sale), id: JSON.stringify(sale.SaleID) });
            })
        } else {
            res.render('sale_edit', { data: JSON.stringify(sale), id: JSON.stringify(id) });
        }
        
    }
    let data;
    dbconnection.query('SELECT * FROM sales', (error, results, fields) => {
        if (error) {
            console.log('[ERROR]', error)
        }
        let data = [];
        results.forEach(record =>{
            data.push(record)
        });
        res.render('sales', { data: JSON.stringify(data) });
    })
});

router.post('/sales/edit', async (req, res) => {
    if (req.body.id) {
        const id = req.body.id;
        if (id > 0){
            dbconnection.query(`UPDATE sales SET EmployeeID = '${req.body.EmployeeID}, CustomerID = '${req.body.CustomerID}', VehicleID = '${req.body.VehicleID}', SubTotal = '${req.body.SubTotal}', Commission = '${req.body.Commission}' WHERE SaleID = ${req.body.id}`, (error, results, fields) => {
                if (error) {
                    console.log('[ERROR]', error);
                    res.status(500).send({ status: false, message: `[ERROR] ${error}` });
                }
                res.send({ status: true, message: 'Query successful!'})
            });
        }
        else {
            dbconnection.query(`INSERT INTO sales (EmployeeID, CustomerID, VehicleID, SubTotal, Commission) VALUES ('${req.body.EmployeeID}', '${req.body.CustomerID}', '${req.body.VehicleID}', '${req.body.SubTotal}', '${req.body.Commission}')`, (error, results, fields) => {
                if (error) {
                    console.log('[ERROR]', error);
                    res.status(500).send({ status: false, message: `[ERROR] ${error}` });
                }
                res.send({ status: true, message: 'Query successful!'})
            });
        }
    }
    else {
        res.send({ status: false, message: 'No query found in request body...'})
    }
});

module.exports = router;
