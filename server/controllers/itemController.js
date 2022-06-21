const uuid = require('uuid')
const path = require('path')
const {Item} = require('../models/models')
const ApiError = require('../error/ApiError')

class ItemController {
    async create(req, res, next) {
        try {
            let {name, color, size, price, typeId, desc} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".png"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))

            const item = await Item.create({name, color, size, price, typeId, desc, img: fileName});

            return res.json(item)
            
        } catch (e) {
            next(ApiError.badRequest(e.message))

        }
    }

    async getAll(req, res) {
        let {typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 20
        let offset = page * limit - limit
        let items;
        if (!typeId) {
            items = await Item.findAndCountAll({limit, offset})
        } else {
            items = await Item.findAndCountAll({where: {typeId}, limit, offset})
        }
        return res.json(items)
    }

    async getOne(req, res) {
        const {id} = req.params
        const item = await Item.findOne(
            {where: {id}}
        )
        return res.json(item)
    }
}

module.exports = new ItemController()