export default {
    appUrl: 'http://localhost:3000',
    database: process.env.DATABASE || 'mongodb://localhost:27017/photos',
    port: process.env.PORT || 3000,
    images: {
        source: 'http://54.152.221.29/images.json',
        sizes: [
            { name: 'small', width: 320, height: 240 },
            { name: 'medium', width: 384, height: 288 },
            { name: 'large', width: 640, height: 480 }
        ]
    }
}