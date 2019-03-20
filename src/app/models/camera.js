const mongoose = require('../../database/index')
const bcripty = require('bcryptjs')

const CameraSchema = new mongoose.Schema({
    
    camera_name: {
        type: String,
    },
    tipo: {
        type: String,
    },
    qualidade: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Results = mongoose.model('Camera', CameraSchema)
module.exports = Results