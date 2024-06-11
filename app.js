require('dotenv').config();
const express = require('express');
require('express-async-errors');
const app = express();

const connectDB = require('./db/connect');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieParser(process.env.JWT_SECRET));

app.get('/api/v1', (req, res) => {
    console.log(req.signedCookies);
    res.send('e-commerce api');
});

app.use('/api/v1/auth', require('./router/auth'));
app.use('/api/v1/user', require('./router/user'));
app.use('/api/v1/product', require('./router/productRouter'));
app.use('/api/v1/review', require('./router/reviewRouter'));
app.use('/api/v1/order', require('./router/orderRouter'));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () => {
            console.log(`server is start on port: ${port}`);
        });
    } catch (err) {
        console.log(`🚀 ~ start ~ err:`, err);
    }
};

start();
