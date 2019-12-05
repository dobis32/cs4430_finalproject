const express = require('express');
const db = require('../mysql/db')
const dbconnection = db();

const router = new express.Router();

router.get('/vehicles', async (req, res) => {
    let links = {
        id: `/vehicles?sort=vehicleid&order=asc`,
        make: `/vehicles?sort=make&order=asc`,
        model: `/vehicles?sort=model&order=asc`,
        year: `/vehicles?sort=year&order=asc`,
        color: `/vehicles?sort=color&order=asc`,
        price: `/vehicles?sort=price&order=asc`
    }
    let orderClause = '';
    if (req.query.sort && req.query.order) {
        orderClause = `ORDER BY ${req.query.sort} ${req.query.order}`
        if (req.query.sort == 'vehicleid') {
            links.id = `/vehicles?sort=vehicleid&order=${req.query.order == 'asc' ? 'desc' : 'asc'}`
        }
        else if (req.query.sort == 'make'){
            links.make = `/vehicles?sort=make&order=${req.query.order == 'asc' ? 'desc' : 'asc'}`
        }
        else if (req.query.sort == 'model'){
            links.model = `/vehicles?sort=model&order=${req.query.order == 'asc' ? 'desc' : 'asc'}`
        }
        else if (req.query.sort == 'year'){
            links.year = `/vehicles?sort=year&order=${req.query.order == 'asc' ? 'desc' : 'asc'}`
        }
        else if (req.query.sort == 'color'){
            links.color = `/vehicles?sort=color&order=${req.query.order == 'asc' ? 'desc' : 'asc'}`
        }
        else if (req.query.sort == 'price'){
            links.price = `/vehicles?sort=price&order=${req.query.order == 'asc' ? 'desc' : 'asc'}`
        }
    }
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
            res.render('vehicles', { data: JSON.stringify(data), links });
        });
    } else if (req.query.make) {
        let data;
        dbconnection.query(`SELECT * FROM vehicles WHERE Make = '${req.query.make}'`, (error, results, fields) => {
            if (error) throw error;
            let data = [];
            results.forEach(record =>{
                data.push(record);
            })
            res.render('vehicles', { data: JSON.stringify(data), links });
        });
    } else {
        let data;
        dbconnection.query(`SELECT * FROM vehicles ${orderClause}`, (error, results, fields) => {
            if (error) throw error;
            let data = [];
            results.forEach(record =>{
                data.push(record);
            })
            res.render('vehicles', { data: JSON.stringify(data), links });
        });
    }
});

router.get('/vehicles/edit', async (req, res) => {
    if(req.query.id){
        let vehicle = {}
        if (req.query.id > 0) {
            let data;
            dbconnection.query(`SELECT * FROM (SELECT COUNT(SubTotal) AS sold FROM sales WHERE VehicleID = ${req.query.id}) AS blank, vehicles WHERE VehicleID = ${req.query.id}`, (error, results, fields) => {
                if (error) throw error;
                let data = [];
                results.forEach(record =>{
                    data.push(record)
                });
                vehicle = data[0]
                res.render('vehicle_edit', { data: JSON.stringify(vehicle) , id: JSON.stringify(vehicle.VehicleID)})
            })
        } else {
            res.render('vehicle_edit', { data: JSON.stringify(vehicle) , id: JSON.stringify(req.query.id)})
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
                dbconnection.query(`SELECT MAX(VehicleID) AS id FROM vehicles`, (error, results, fields) => {
                    let data = [];
                    results.forEach(record =>{
                        data.push(record);
                    });
                    res.status(201).send({status: true, id: data[0].id})
                });
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
