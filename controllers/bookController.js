const uuid = require('uuid');
const path = require('path');

const {Book, Quote} = require('../models/models');
const ApiError = require('../error/ApiError');

const _transformBook = (book) => {
    return {
        id: book.id,
        name: book.name,
        link: book.link,
        rating: book.rating,
        comment: book.comment,
        cover: book.cover,
        userId: book.userId,
        authorId: book.authorId,
        countryId: book.countryId
    }
};


class BookController {
    async create(req, res, next) {
        try {
            const {id} = req.user;
            let {name, link, rating, comment, countryId, authorId} = req.body;
            let fileName;

            if (req.files === null) {
                fileName = "2fdb8f0e-6538-4225-9db2-931902c0d7d5.jpg";
            } else {
                const {cover} = req.files;
                fileName = uuid.v4() + ".jpg";
                cover.mv(path.resolve(__dirname, '..', 'static', fileName));
            }

            const book = await Book.create({name, link, rating, comment, userId: id, countryId, authorId, cover: fileName});            
            return res.json(_transformBook(book));

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const {id} = req.user;
            const books = await Book.findAll({where:{userId: id}});
            return res.json(books.map(book => _transformBook(book)));

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async getONe(req, res, next) {
        try {
            const {id} = req.params;
            const book = await Book.findOne({where: {userId: req.user.id, id}});
            return res.json(_transformBook(book));

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            await Quote.destroy({where: {userId: req.user.id, bookId: id}});
            await Book.destroy({where: {userId: req.user.id, id}});
            return res.json('Book was deleted');

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params;
            const {name, link, rating, comment, countryId, authorId} = req.body;
            let fileName;

            if (req.files === null) {
                fileName = "2fdb8f0e-6538-4225-9db2-931902c0d7d5.jpg";
            } else {
                const {cover} = req.files;
                fileName = uuid.v4() + ".jpg";
                cover.mv(path.resolve(__dirname, '..', 'static', fileName));
            }

            await Book.update({name, link, rating, comment, cover: fileName, countryId, authorId}, {where: {userId: req.user.id, id}});
            return res.json('Book was updated');

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }
};

module.exports = new BookController();