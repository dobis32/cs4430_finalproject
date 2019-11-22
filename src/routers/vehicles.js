const express = require('express');
const db = require('../mysql/db')
const dbconnection = db();

const router = new express.Router();

router.get('/vehicles', async (req, res) => {
    let data;
    dbconnection.query('SELECT * FROM vehicles', (error, results, fields) => {
        if (error) throw error;
        let data = [];
        console.log(results)
        results.forEach(record =>{
            data.push(record)
        })
        res.render('vehicles', { data: JSON.stringify(data) });
    })
    
});

router.get('/vehicles/edit', async (req, res) => {
    let id = req.query.id
    if(id){
        let vehicle = {}
        if (id > 0) {
            let data;
            dbconnection.query(`SELECT * FROM vehicles WHERE VehicleID = ${id}`, (error, results, fields) => {
                if (error) throw error;
                let data = [];
                results.forEach(record =>{
                    data.push(record)
                });
                vehicle = data[0]
                res.render('vehicle_edit', { data: JSON.stringify(vehicle) , id: JSON.stringify(vehicle.VehicleID)})
            })
        } else {
            res.render('vehicle_edit', { data: JSON.stringify(vehicle) , id: JSON.stringify(id)})
        }
    }
    else {
        res.redirect('/customers')
    }
});

router.post('/vehicles/save', async (req, res) => {
    console.log(req.body)
    try{
        if(req.body.id > 0){
            dbconnection.query(`UPDATE vehicles SET Make = '${req.body.make}', Model = '${req.body.model}', Year = '${req.body.year}', Color = '${req.body.color}', Price = '${req.body.price}' WHERE VehicleID = '${req.body.id}'`, (error, results, fields) => {
                if (error)  console.log(error);
                res.status(201).send({status: true})
            });
        } else {
            dbconnection.query(`INSERT INTO vehicles (Make, Model, Year, Color, Price) VALUES ('${req.body.make}', '${req.body.model}', '${req.body.year}', '${req.body.color}', '${req.body.price}')`, (error, results, fields) => {
                if (error) throw error;
                res.status(201).send({status: true})
            });
        }
        
    } catch (error) {
        res.status(500).send({status: false})
    }
    
});

module.exports = router;
