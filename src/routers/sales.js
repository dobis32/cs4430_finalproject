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

router.post('/sales/edit', async (req, res) => {
    if (req.body.query) {
        dbconnection.query(req.body.query, (error, results, fields) => {
            if (error) {
                console.log('[ERROR]', error);
                res.status(500).send({ status: false, message: `[ERROR] ${error}` });
            }
            res.send({ status: true, message: 'Query successful!'})
        });
    }
    else {
        res.send({ status: false, message: 'No query found in request body...'})
    }
});

module.exports = router;
