const uuid = require('uuid');
const path = require('path');

const {Author, Book, Quote} = require('../models/models');
const ApiError = require('../error/ApiError');

const _transformAuthor = (author) => {
    return {
        id: author.id,
        name: author.name,
        description: author.description,
        photo: author.photo,
        userId: author.userId,
        countryId: author.countryId
    }
};


class AuthorController {
    async create(req, res, next) {
        try {
            const {id} = req.user;
            let {name, description, countryId} = req.body;
            let fileName;
            
            const candicate = await Author.findOne({where: {userId: id, name}});
            if (candicate) {
                return next(ApiError.badRequest('Такой автор уже существует!'));
            } 

            if (req.files === null) {
                fileName = "838ab1ce-606a-4cd6-8107-7871313b7305.jpg";
            } else {
                const {photo} = req.files;
                fileName = uuid.v4() + ".jpg";
                photo.mv(path.resolve(__dirname, '..', 'static', fileName));
            }
            

            const author = await Author.create({name, description, userId: id, countryId, photo: fileName});            
            return res.json(_transformAuthor(author));

        } catch(err) { 
            next(ApiError.badRequest(err.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const {id} = req.user;
            const authors = await Author.findAll({where:{userId: id}});
            return res.json(authors.map(author => _transformAuthor(author)));

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async getONe(req, res, next) {
        try {
            const {id} = req.params;
            const author = await Author.findOne({where: {userId: req.user.id, id}});
            return res.json(_transformAuthor(author));

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            const books = await Book.findAll({where: {authorId: id}});

            for (let i = 0; i < books.length; i++) {
                await Quote.destroy({where: {userId: req.user.id, bookId: books[i].id}});
            }
            
            await Book.destroy({where: {userId: req.user.id, authorId: id}});
            await Author.destroy({where: {userId: req.user.id, id}});

            return res.json('Author was deleted');

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params;
            const {name, description, countryId} = req.body;
            let fileName;

            if (req.files === null) {
                fileName = "838ab1ce-606a-4cd6-8107-7871313b7305.jpg";
            } else {
                const {photo} = req.files;
                fileName = uuid.v4() + ".jpg";
                photo.mv(path.resolve(__dirname, '..', 'static', fileName));
            }

            await Author.update({name, description, photo: fileName, countryId}, {where: {userId: req.user.id, id}});
            return res.json('Author was updated');

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }
};

module.exports = new AuthorController();