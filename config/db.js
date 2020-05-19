const mongoose = require("mongoose");

const connectDb = async () => {
  let conn = await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(
    `mongodb connected : ${conn.connection.host}`.cyan.underline.bold
  );
};

module.exports = connectDb;
