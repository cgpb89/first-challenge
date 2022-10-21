const mongoose = require('mongoose')

module.exports = function databaseConnection() {
    const uri = "mongodb+srv://<USER_NAME>:<PASSWORD>@cluster0.fqv7vlz.mongodb.net/employee?retryWrites=true&w=majority";
    const connectionParams={
      useNewUrlParser: true,
      useUnifiedTopology: true 
  }
  const connect = mongoose.connect(uri, connectionParams)
      .then( () => {
          console.log('Connected to database ')
      })
      .catch( (err) => {
          console.error(`Error connecting to the database. \n${err}`);
      })

}