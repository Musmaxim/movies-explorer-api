const express = require('express');
const mongoose = require('mongoose');
// const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { errors } = require('celebrate');
const { PORT } = require('./config');
const router = require('./routes/index');
const errorHandler = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
// });

const app = express();

mongoose.connect('mongodb://localhost:27017/moviesdb', { useNewUrlParser: true });

app.use(express.json());

app.use(requestLogger);

// app.use(limiter);

app.use(cors());

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
