const express = require('express')
const app = express()

app.use(express.json({ extended: true }))


app.use('/auth', require('./routes/auth.routes'))

const start = () => {
    try {
        app.listen(3000, () => {
            console.log('app has been started on port 3000')
        })
    } catch (error) {
        console.error(error)
    }
}

start()