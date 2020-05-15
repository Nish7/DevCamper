const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const connectDb = require("./config/db.js");

//Env invocation
dotenv.config({ path: "./config/config.env" });

// connect DB
connectDb();

//Route Files
const bootcamps = require("./routes/bootcamps");

const app = express();

//Morgan : Req Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Body Parser
app.use(express.json());

//Mount Routers
app.use("/api/v1/bootcamps", bootcamps);

//error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `Server running on ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
  );
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
