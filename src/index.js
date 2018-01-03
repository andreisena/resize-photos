'use strict'

// Dependencies
import express from 'express'
import helmet from 'helmet'
import mongoose from 'mongoose'
import morgan from 'morgan'

import config from './config'
import PhotosController from './controllers/photos'

const port = config.port
const app = express()
const router = express.Router()

// Init the database
mongoose.Promise = global.Promise
mongoose.connect(config.database, { useMongoClient: true })

// Wait for database connection to start the app
mongoose.connection.once('open', function () {
    // Start logging
    app.use(morgan('dev'))

    // Helmet
    app.use(helmet())

    // Storage static route
    app.use('/storage', express.static('storage'));

    // API Routes
    app.use('/photos', PhotosController())

    // Start the server
    app.listen(port)
    console.log('A API está sendo executada na porta ' + port)
})