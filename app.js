require('dotenv').config();
const express = require('express');
require('express-async-errors');
const app = express();

const connectDB = require('./db/connect');

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet/');
const mongoSanitizer = require('express-mongo-sanitize');

//swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust-proxy', 1);
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 60,
    })
);

app.use(helmet());
app.use(xss());
app.use(mongoSanitizer());
app.use(cors({origin:"*"}));

app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieParser(process.env.JWT_SECRET));

app.get('/', (req, res) => {
    res.send('<h1>E-commerce API</h1><a href="/api-docs">Documentation</a>');
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

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
