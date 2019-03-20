const mongoose = require('mongoose');
const mongodbUri ='mongodb://@ds335275.mlab.com:35275/tcc';
mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  auth: {
    user: 'erislandio',
    password: 'Er1sl@ndio'
  }
})
const conn = mongoose.connection;    
conn.on('error', console.error.bind(console, 'Erro!:'));  
 
conn.once('open', () =>{
 console.log('conectado a database Mlab')                       
});

mongoose.Promise = global.Promise


module.exports = mongoose