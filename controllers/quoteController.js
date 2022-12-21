const {Quote} = require('../models/models');
const ApiError = require('../error/ApiError');

const _transformQuote = (quote) => {
    return {
        id: quote.id,
        quote: quote.quote,
        userId: quote.userId,
        bookId: quote.bookId
    }
};

class QuoteController {
    async create(req, res, next) {
        try {
            const {id} = req.user;
            let {quote, bookId} = req.body;

            const quoteN = await Quote.create({quote, userId: id, bookId});            
            return res.json(_transformQuote(quoteN));

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const {id} = req.user;
            const quotes = await Quote.findAll({where:{userId: id}});
            return res.json(quotes.map(quote => _transformQuote(quote)));
        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async getONe(req, res, next) {
        try {
            const {id} = req.params;
            const quote = await Quote.findOne({where: {userId: req.user.id, id}});
            return res.json(_transformQuote(quote));

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            await Quote.destroy({where: {userId: req.user.id, id}});
            return res.json('Quote was deleted');

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params;
            const {quote} = req.body;
            await Quote.update({quote}, {where: {userId: req.user.id, id}});
            return res.json('Quote was updated');

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }
};

module.exports = new QuoteController();