const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide product name'],
            maxlength: [100, 'Name can not the more than 100 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Please provide product price'],
            default: 0,
        },
        description: {
            type: String,
            required: [true, 'Please provide product description'],
            maxlength: [1000, 'Name can not the more than 1000 characters'],
        },
        image: {
            type: String,
            default: '/uploads/example.jeg',
        },
        category: {
            type: String,
            required: [true, 'Please provide product category'],
            enum: ['office', 'kitchen', 'bedroom'],
        },
        company: {
            type: String,
            required: [true, 'Please provide product company'],
            enum: {
                values: ['ikea', 'liddy', 'marcos'],
                message: '${VALUE} is not supported',
            },
        },
        color: {
            type: [String],
            default: ['#258966'],
            required: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        freeShipping: {
            type: Boolean,
            default: false,
        },
        inventory: {
            type: Number,
            required: true,
            default: 15,
        },
        averageRating: {
            type: Number,
            default: 0,
        },
        numOfReviews: {
            type: Number,
            default: 0,
        },
        averageRating: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual('review', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
});

productSchema.pre('remove', async function (next) {
    await this.model('Review').deleteMany({ product: this._id });
});
module.exports = mongoose.model('Product', productSchema);
