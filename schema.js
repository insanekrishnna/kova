const Joi = require('joi');

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        category: Joi.string().valid(
            'mountains', 'arctic', 'farms', 'desserts', 'Family', 
            'cities', 'Wildlife', 'Beach', 'Historical', 'Rooms', 'Other'
        ).required()
    }).required()
}).unknown(true);

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
}).unknown(true);

module.exports = { listingSchema, reviewSchema };