const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config();

app.use(express.json({ extended: true }))


app.use('/auth', require('./routes/auth.routes'))

const PORT = process.env.PORT || 3000

const start = () => {
    try {

        mongoose.connect(process.env.NODE_ENV === "production" ? 
            process.env.DB_PROD_CONN_URI :
            process.env.DB_DEV_CONN_URI
        , {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })

        app.listen(PORT, () => {
            console.log(`app has been started on port ${PORT}`)
        })
    } catch (error) {
        console.error(error)
    }
}

start()