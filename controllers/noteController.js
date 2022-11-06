const {Note} = require('../models/models');
const ApiError = require('../error/ApiError');

const _transformNote = (note) => {
    return {
        id: note.id,
        name: note.name,
        userId: note.userId
    }
};

class NoteController {
    async create(req, res, next) {
        try {
            const {id} = req.user;
            let {name} = req.body;

            const note = await Note.create({name, userId: id});            
            return res.json(_transformNote(note));

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const {id} = req.user;
            const notes = await Note.findAll({where:{userId: id}});
            return res.json(notes.map(note => _transformNote(note)));
        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async getONe(req, res, next) {
        try {
            const {id} = req.params;
            const note = await Note.findOne({where: {userId: req.user.id, id}});
            return res.json(_transformNote(note));

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            await Note.destroy({where: {userId: req.user.id, id}});
            return res.json('Note was deleted');

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params;
            const {name} = req.body;
            await Note.update({name}, {where: {userId: req.user.id, id}});
            return res.json('Note was updated');

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }
};

module.exports = new NoteController();