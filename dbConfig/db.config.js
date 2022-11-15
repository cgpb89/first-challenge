const mongoose = require('mongoose')
const logger = require('../logger')

module.exports = function databaseConnection() {
    const uri = "mongodb+srv://carlos:carlos89@cluster0.fqv7vlz.mongodb.net/coe?retryWrites=true&w=majority";
    const connectionParams={
      useNewUrlParser: true,
      useUnifiedTopology: true 
  }
  const connect = mongoose.connect(uri, connectionParams)
      .then( () => {
            logger.debug('Connected to database ')
      })
      .catch( (err) => {
        logger.error(`Error connecting to the database. \n${err}`)
      })

}