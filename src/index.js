const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs'); 
const employeesRouter = require('./routers/employees');
const customersRouter = require('./routers/customers');
const vehiclesRouter = require('./routers/vehicles');
const salsesRouter = require('./routers/sales');


const port = process.env.PORT || 3001;
const publicDirectoryPath = path.join(__dirname, '../public');
const templatesPath = path.join(__dirname, '../templates');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(publicDirectoryPath));
app.use(employeesRouter)
app.use(customersRouter)
app.use(vehiclesRouter)
app.use(salsesRouter)
app.set('view engine', 'hbs');
app.set('views', templatesPath);

app.listen(port, () => {
	console.log('Server is up on port ' + port);
});

