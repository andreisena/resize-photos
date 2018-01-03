'use strict'

import mongoose from 'mongoose'

import config from '../config'

const options = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}

const PhotoSchema = new mongoose.Schema({
    filename: {
        type: String
    },
    sizes: {
        type: Object
    }
}, options)

PhotoSchema.set('toJSON', {
    getters: true,
    timestamps: true,
    transform: function (doc, ret, options) {
        Object
            .keys(ret.sizes)
            .map(function (key, index) {
                ret.sizes[key] = config.appUrl + '/storage/photos/' + ret.sizes[key]
            })
        return {
            name: ret.filename,
            sizes: ret.sizes
        }
    }
})

export default mongoose.connection.model('Photo', PhotoSchema)