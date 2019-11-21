const express = require('express');
const db = require('../mysql/db')
const dbconnection = db();

const router = new express.Router();

router.get('/employees', async (req, res) => {
    let data;
    dbconnection.query('SELECT * FROM employees', (error, results, fields) => {
        if (error) throw error;
        let data = [];
        console.log(results)
        results.forEach(record =>{
            data.push(record)
        })
        res.render('employees', { data: JSON.stringify(data) });
    })
    
});

module.exports = router;
