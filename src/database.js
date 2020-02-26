const mongoose = require('mongoose');
const mongoUrl = process.env.MONGO_URL;

const connect = () => {
  return mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

module.exports = {
  connect,
  connection: mongoose.connection
};
