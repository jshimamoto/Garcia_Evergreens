const connectDB = require("./db/connect");
const express = require("express");
const http = require("http");
const path = require("path");

//Security
const cors = require("cors");
const helmet = require("helmet")
const rateLimit = require('express-rate-limit')
const xss = require('xss-clean')

const adminRouter = require("./routes/admin-router");
const deliveryRouter = require("./routes/delivery-router")
const adminProductRouter = require("./routes/admin-product-router");
const inventoryRouter = require("./routes/inventory-router");
const adminEmployeeRouter = require('./routes/admin-employee-router')
const adminSupplierRouter = require('./routes/admin-supplier-router')
const adminSalesRouter = require('./routes/admin-sales-router')
const boxRouter = require('./routes/box-router')

//const productRouter = require("./routes/product-router");

//const employeeInventoryRouter = require("./routes/employee-inventory-router")

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authMiddleware = require("./middleware/auth-middleware");

require("dotenv").config();
require("express-async-errors");

// Retrieve Files ----------------------------------------------------------------------------
const app = express();
// app.use(express.static('./public'))

// Middleware -------------------------------------------------------------------------------
//app.use([logger, authorize]); //Applies to all get requests, can specify routes: app.use('/api', logger), executed in order
//app.use(express.urlencoded({extended: false}));
//app.set('trust proxy', 1)

// app.use(rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
// }))
// app.use(helmet());
// app.use(xss());
app.use(cors());
app.use(express.json());
app.use(express.static("./public"));

// Server -----------------------------------------------------------------------------------

// Routes -------------------------------------------------------------------------------
app.use('/api/v1/admin/products', authMiddleware, adminProductRouter);
app.use('/api/v1/admin/employees', authMiddleware, adminEmployeeRouter);
app.use('/api/v1/admin/suppliers', authMiddleware, adminSupplierRouter);
app.use('/api/v1/admin/sales', authMiddleware, adminSalesRouter)
app.use('/api/v1/inventory', authMiddleware, inventoryRouter);
app.use('/api/v1/delivery', authMiddleware, deliveryRouter);
app.use('/api/v1/boxes', authMiddleware, boxRouter)
app.use('/api/v1/admin', adminRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
	try {
	    await connectDB(process.env.MONGO_URI);
	    const server = http.createServer();
	    app.listen(port, () => {
	     	console.log(`Server is listening on port: ${port}`);
	    });
	} catch (error) {
	    console.log(error);
	}
};

start();
