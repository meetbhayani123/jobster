const Product = require('../models/product');
const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');

const createProduct = async (req, res) => {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
    const products = await Product.find({});
    res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id }).populate('reviews');
    if (!product) {
        throw new customError.NotFoundError(`No product With id: ${req.params.id}`);
    }
    res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
    const product = await Product.findByIdAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
    });
    if (!product) {
        throw new customError.NotFoundError(`No product found with id: ${req.params.id}`);
    }
    res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
        throw new customError.NotFoundError(`No product with id: ${product}`);
    }
    await product.remove();
    res.status(StatusCodes.OK).json({ message: 'Success! product is deleted' });
};

const uploadImage = async (req, res) => {
    console.log(req.file);
    res.status(StatusCodes.OK).json({
        message: 'image upload successfully',
    });
};

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
};
