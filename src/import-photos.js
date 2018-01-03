'use strict'

import axios from 'axios'
import mongoose from 'mongoose'
import sharp from 'sharp'
import del from 'del'
import fs from 'fs'
import uuidv4 from 'uuid/v4'

import config from './config'
import Photo from './models/photo'

mongoose.Promise = global.Promise
mongoose.connect(config.database, { useMongoClient: true })

mongoose.connection.once('open', function () {
    // Remove all photos from the disk and database
    removeAllPhotos()

    axios
        // Retrieve the images urls from the webservice
        .get(config.images.source)
        // Import the photos to the database and resize
        .then(response => importPhotos(response.data.images))
        // Catch possible errors
        .catch((err) => console.log('Erro: ' + err.message))
        // Close the mongodb connection once finished
        .then(() => mongoose.connection.close())
})

/**
 * Loop through the images to save and resize the photos
 * @param array images
 */
function importPhotos (images) {
    return new Promise((resolve, reject) => {
        let done = 0
        images.forEach((image) => {
            try {
                importAndResizePhoto(image)
                    .then((photo) => {
                        console.log(`Foto importada: ${photo.filename}`)
                        done++
                        if (images.length === done) resolve(true)
                    })
            }
            catch (err) { reject(err) }
        })
    })
}

/**
 * Import the photo from the url, create the variations and save to the database
 * @param Object image
 */
function importAndResizePhoto (image) {
    return new Promise((resolve, reject) => {
        const extension = extractFileExtension(image.url)

        let photo = new Photo({
            filename: extractFileName(image.url),
            sizes: {}
        })

        axios
            .get(image.url, { responseType: 'arraybuffer' })
            .then(response => {
                let filename = uuidv4() + '.' + extension
                photo.sizes.original = filename

                // Save the original image
                fs.writeFile(
                    './storage/photos/' + filename,
                    response.data,
                    (err) => {
                        if (err) throw err

                        // Loop through all image sizes to crete the photo sizes variations
                        config.images.sizes.forEach(size => {
                            let filename = uuidv4() + '.' + extension
                            photo.sizes[size.name] = filename

                            // Resize the photo and save to the disk
                            sharp(response.data)
                                .resize(size.width, size.height)
                                .toFile(
                                    './storage/photos/' + filename,
                                    (err) => { if (err) throw err }
                                )
                        })

                        // Save the photo on the database with its variations
                        photo.save((err, photo) => {
                            if (err) reject(err)
                            resolve(photo)
                        })
                    }
                )
            })
            .catch(err => {
                console.log(err)
            })
    })
}

/**
 * Extract the file name of a given url
 * @param string url
 */
function extractFileName(url) {
    return url.substring(url.lastIndexOf('/') + 1)
}

/**
 * Extract the file extension of a given url
 * @param string url
 */
function extractFileExtension(url) {
    return url.substring(url.lastIndexOf('.') + 1)
}

/**
 * Remove all photos from database and disk
 */
function removeAllPhotos() {
    del('./storage/photos/*.*').then(() => {
        Photo.remove({}).then((err) => { })
    })
}