const { Schema, model, Types } = require('mongoose')

const userShema = new Schema({
    email: {
        type: String,
        required,
        unique
    },
    password: {
        type: String,
        required: true
    },
    links: [{
        type: Types.ObjectId,
        ref: 'Link'
    }]  
})

module.exports = model('User', user)