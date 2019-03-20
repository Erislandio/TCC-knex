const mongoose = require('../../database/index')

const ResultsSchema = new mongoose.Schema({
    resultado: {
        type: String,
        require: true
    },
    imagem: {
        type: String,
        require: true
    },
    data_resultado: {
        type: Date,
        default: Date.now
    },
    condicoes_ambiente: {
        type: String,
        require: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Results = mongoose.model('Results', ResultsSchema)

module.exports = Results