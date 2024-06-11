const express = require('express');
const router = express.Router();

const { authenticateUser, authorizeUser } = require('../middleware/authentication');
const upload = require('../middleware/multer');
const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
} = require('../controllers/productController');
const { getSingleProductReviews } = require('../controllers/reviewController');

router
    .route('/')
    .post([authenticateUser, authorizeUser('admin')], createProduct)
    .get(getAllProducts);

router
    .route('/uploadImage')
    .post([authenticateUser, authorizeUser('admin'), upload.single('productImage')], uploadImage);

router
    .route('/:id')
    .get(getSingleProduct)
    .patch([authenticateUser, authorizeUser('admin')], updateProduct)
    .delete([authenticateUser, authorizeUser('admin')], deleteProduct);

router.route('/:id/reviews').get(getSingleProductReviews);
module.exports = router;
