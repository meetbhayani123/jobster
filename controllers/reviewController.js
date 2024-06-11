const { StatusCodes } = require('http-status-codes');

const Review = require('../models/review');
const Product = require('../models/product');

const customError = require('../errors');
const { checkPermissions } = require('../utils');

const createReview = async (req, res) => {
    const { product: productId } = req.body;
    const isValidProduct = await Product.findOne({ _id: productId });
    if (!isValidProduct) {
        throw new customError.NotFoundError(`No product with id: ${productId}`);
    }

    const alreadySubmit = await Review.findOne({ product: productId, user: req.user.userId });
    if (alreadySubmit) {
        throw new customError.BadRequestError('Already Submitted review');
    }

    req.body.user = req.user.userId;
    const review = await Review.create(req.body);

    res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
    const reviews = await Review.find({}).populate({ path: 'product', select: 'name company price' });
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
    const review = await Review.findOne({ _id: req.params.id });
    if (!review) {
        throw new customError.NotFoundError(`No review with id: ${req.params.id}`);
    }

    res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
    const { id: reviewId } = req.params;
    const { title, comment, rating } = req.body;
    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
        throw new customError.NotFoundError(`No review with id: ${reviewId}`);
    }
    checkPermissions(req.user, review.user);
    (review.title = title), (review.rating = rating), (review.comment = comment);

    await review.save();
    res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
    const reviewId = req.params.id;

    const review = await Review.findOne({ _id: reviewId });
    if (!review) {
        throw new customError.NotFoundError(`No review with id: ${reviewId}`);
    }
    checkPermissions(req.user, review.user);
    await review.remove();

    res.status(StatusCodes.OK).json({ message: 'Review Deleted successFully' });
};

const getSingleProductReviews = async (req, res) => {
    const { id: productId } = req.params;
    const reviews = await Review.find({ product: productId });
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReviews,
};
