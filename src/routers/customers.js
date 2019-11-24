const express = require('express');
const db = require('../mysql/db')
const dbconnection = db();

const router = new express.Router();

router.get('/customers', async (req, res) => {
    if(req.query.id){
        let data;
        dbconnection.query(`SELECT * FROM customers WHERE CustomerID = ${req.query.id}`, (error, results, fields) => {
            if (error) throw error;
            let data = [];
            results.forEach(record =>{
                data.push(record);
            })
            if (data.length > 0) {
                res.send({ data: JSON.stringify(data), status: true });
            } else {
                res.send({ status: false });
            }
        })
    } else {
        let data;
        dbconnection.query('SELECT * FROM customers', (error, results, fields) => {
            if (error) throw error;
            let data = [];
            results.forEach(record =>{
                data.push(record)
            });
            res.render('customers', { data: JSON.stringify(data) });
        });
    }
});

router.get('/customers/edit', async (req, res) => {
    let id = req.query.id
    if(id){
        let customer = {}
        if (id > 0) {
            let data;
            dbconnection.query(`SELECT * FROM customers WHERE CustomerID = ${id}`, (error, results, fields) => {
                if (error) throw error;
                let data = [];
                results.forEach(record =>{
                    data.push(record)
                });
                customer = data[0]
                res.render('customer_edit', { data: JSON.stringify(customer) , id: JSON.stringify(customer.CustomerID)})
            })
        } else {
            res.render('customer_edit', { data: JSON.stringify(customer) , id: JSON.stringify(id)})
        }
    }
    else {
        res.redirect('/customers')
    }
});

router.post('/customers/save', async (req, res) => {
    try{
        if(req.body.id > 0){
            dbconnection.query(`UPDATE customers SET FirstName = '${req.body.firstName}', LastName = '${req.body.lastName}', Phone = '${req.body.phone}' WHERE CustomerID = '${req.body.id}'`, (error, results, fields) => {
                if (error)  console.log(error);
                res.status(201).send({status: true})
            });
        } else {
            dbconnection.query(`INSERT INTO customers (FirstName, LastName, Phone) VALUES ('${req.body.firstName}', '${req.body.lastName}', '${req.body.phone}')`, (error, results, fields) => {
                if (error) throw error;
                res.status(201).send({status: true})
            });
        }
        
    } catch (error) {
        res.status(500).send({status: false})
    }
    
});

router.post('/customers/remove', async (req, res) => {
    const id = req.body.id;
    if(id && id > 0){
        dbconnection.beginTransaction((error) => {
            const failureResponse = () => {
                res.send({ status: false, message: 'Something failed!'})
            }
            if (error) {
                dbconnection.rollback(failureResponse());
            }
            dbconnection.query(`UPDATE sales SET CustomerID = NULL WHERE CustomerID = ${req.body.id}`, (error, results, fields) => {
                if (error) {
                    dbconnection.rollback(failureResponse());
                }
                else {
                    dbconnection.query(`DELETE FROM customers WHERE CustomerID = ${req.body.id}`, (error, results, fields) => {
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
})

module.exports = router;
