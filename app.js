const connectDB = require('./db/connect');
const express = require('express');
const http = require('http');
const path = require('path')
const cors = require('cors')

const adminRouter = require('./routes/admin-router')
const adminProductRouter = require('./routes/admin-product-router')
const adminInventoryRouter = require('./routes/admin-inventory-router')
//const adminEmployeeRouter = require('./routes/admin-employee-router')
//const adminSupplierRouter = require('./routes/admin-supplier-router')
const productRouter = require('./routes/product-router')

const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const authMiddleware = require('./middleware/auth-middleware')

require('dotenv').config()
require('express-async-errors')


// Retrieve Files ----------------------------------------------------------------------------
//const homePage = readFileSync('./views/index.html');
const app = express();
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");
// app.use(express.static('./public'))

// Middleware -------------------------------------------------------------------------------
//app.use([logger, authorize]); //Applies to all get requests, can specify routes: app.use('/api', logger), executed in order
// app.use(express.urlencoded({extended: false}));
app.use(cors())
app.use(express.json());
app.use(express.static('./public'));

// Server -----------------------------------------------------------------------------------


// Routes -------------------------------------------------------------------------------
app.use('/api/v1/admin/dashboard', adminRouter); //add authMiddleware back
app.use('/api/v1/admin/dashboard/products', authMiddleware, adminProductRouter); //add authMiddleware back
app.use('/api/v1/admin/dashboard/inventory', authMiddleware, adminInventoryRouter); //add authMiddleware back
//app.use('/api/v1/admin/dashboard/employee', authMiddleware, adminEmployeeRouter);
//app.use('/api/v1/admin/dashboard/supplier', authMiddleware, adminSupplierRouter);
app.use('/api/v1/admin', adminRouter);
//app.use('/api/v1/employee/', authMiddleware, employeeRouter);
app.use('/api/v1/products', productRouter)

// add a new route for employees dashboard (click on an employee, view stats, etc.)

// app.use('/api/v1/admin/products', authMiddleware, adminRouter)


app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = 5000
// const port = process.env.PORT || 3000

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI)
		const server = http.createServer()
		app.listen(port, () => {
			console.log(`Server is listening on port: ${port}`);
		})
	} catch (error) {
		console.log(error);
	}
}

start()