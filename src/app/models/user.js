const mongoose = require('../../database/index')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    results: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Results"
    }],
    camera: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Camera"
    }
})

userSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User