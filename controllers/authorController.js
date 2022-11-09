const uuid = require('uuid');
const path = require('path');

const {Author} = require('../models/models');
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
            const {photo} = req.files;
            let fileName = uuid.v4() + ".jpg";

            photo.mv(path.resolve(__dirname, '..', 'static', fileName));

            const candicate = await Author.findOne({where: {userId: id, name}});
            if (candicate) {
                return next(ApiError.badRequest('Такой автор уже существует!'));
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
            const {photo} = req.files;
            let fileName = uuid.v4() + ".jpg";

            photo.mv(path.resolve(__dirname, '..', 'static', fileName));

            await Author.update({name, description, photo: fileName, countryId}, {where: {userId: req.user.id, id}});
            return res.json('Author was updated');

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }
};

module.exports = new AuthorController();