const express = require('express');
const db = require('../mysql/db')
const dbconnection = db();

const router = new express.Router();

router.get('/vehicles', async (req, res) => {
    if(req.query.id){
        let data;
        dbconnection.query(`SELECT * FROM vehicles WHERE VehicleID = ${req.query.id}`, (error, results, fields) => {
            if (error) throw error;
            let data = [];
            results.forEach(record =>{
                data.push(record);
            })
            if (data.length > 0) {
                dbconnection.query(`SELECT * FROM sales WHERE VehicleID = ${req.query.id}`, (error, results, fields) => {
                    if (error) throw error;
                    let buffer = [];
                    results.forEach(record =>{
                        buffer.push(record);
                    })
                    if (buffer.length == 0) {
                        res.send({ data: JSON.stringify(data), status: true });
                    } else {
                        res.send({ status: false, message:'Vehicle with that ID has already been sold!' });
                    }
                });
            } else {
                res.send({ status: false, message:'No vehicle with that ID found!'});
            }
        })
    } else if (req.query.model) {
        let data;
        dbconnection.query(`SELECT * FROM vehicles WHERE Model = '${req.query.model}'`, (error, results, fields) => {
            if (error) throw error;
            let data = [];
            results.forEach(record =>{
                data.push(record);
            })
            res.render('vehicles', { data: JSON.stringify(data) });
        });
    } else if (req.query.make) {
        let data;
        dbconnection.query(`SELECT * FROM vehicles WHERE Make = '${req.query.make}'`, (error, results, fields) => {
            if (error) throw error;
            let data = [];
            results.forEach(record =>{
                data.push(record);
            })
            res.render('vehicles', { data: JSON.stringify(data) });
        });
    } else {
        let data;
        dbconnection.query('SELECT * FROM vehicles', (error, results, fields) => {
            if (error) throw error;
            let data = [];
            results.forEach(record =>{
                data.push(record);
            })
            res.render('vehicles', { data: JSON.stringify(data) });
        });
    }
});

router.get('/vehicles/edit', async (req, res) => {
    let id = req.query.id
    if(id){
        let vehicle = {}
        if (id > 0) {
            let data;
            dbconnection.query(`SELECT * FROM (SELECT COUNT(SubTotal) AS sold FROM sales WHERE VehicleID = ${req.query.id}) AS blank, vehicles WHERE VehicleID = ${id}`, (error, results, fields) => {
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

router.post('/vehicles/remove', async (req, res) => {
    const id = req.body.id;
    if(id && id > 0){
        dbconnection.beginTransaction((error) => {
            const failureResponse = () => {
                res.send({ status: false, message: 'Something failed!'})
            }
            if (error) {
                dbconnection.rollback(failureResponse());
            }
            dbconnection.query(`UPDATE sales SET VehicleID = NULL WHERE VehicleID = ${req.body.id}`, (error, results, fields) => {
                if (error) {
                    dbconnection.rollback(failureResponse());
                }
                else {
                    dbconnection.query(`DELETE FROM vehicles WHERE VehicleID = ${req.body.id}`, (error, results, fields) => {
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
