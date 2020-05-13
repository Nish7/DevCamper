const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');

//Route Files
const bootcamps = require('./routes/bootcamps');

//Env invokation
dotenv.config({path: './config/config.env'});

const app = express();


//Morgan : Req Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}



//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`);
});
