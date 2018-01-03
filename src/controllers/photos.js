'use strict'

import express from 'express'

import Photo from '../models/photo'

export default function () {
    const router = express.Router()

    router.get('/', function (req, res, next) {
        Photo.find(null, function (err, rows) {
            if (err) return res.status(500).json({ error: err })
            res.json({ photos: rows })
        })
    })

    return router
}