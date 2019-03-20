const express = require('express')
const bodyParser = require('body-parser')
const port = 3000
const app = express()
const cors = require('cors')


// * entender os dados enviados em json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

require('./app/controllers/index')(app)

app.listen(port, () => {
    console.log(`Servidor online na porta ${port}`)
})