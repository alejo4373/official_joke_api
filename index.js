const express = require('express');
const morgan = require('morgan');
const { randomJoke, randomTen, jokeByType, randomNJokes } = require('./handler');

const app = express();

app.use(morgan('dev'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  res.send('Try /random_joke, /random_ten, /jokes/random, or /jokes/ten');
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/random_joke', (req, res) => {
  res.json(randomJoke());
});

app.get('/random_ten', (req, res) => {
  res.json(randomTen());
});

app.get('/jokes/random', (req, res) => {
  res.json(randomJoke());
});

app.get('/jokes/ten', (req, res) => {
  res.json(randomTen());
});

app.get('/jokes/random/:n', (req, res, next) => {
  let number = Number(req.params.n)
  if(!isNaN(number)) {
    res.json(randomNJokes(number));
  } else  {
    next(new Error(`/${req.params.n} endpoint should be a number`))
  }
});

app.get('/jokes/:type/random', (req, res) => {
  res.json(jokeByType(req.params.type, 1));
});

app.get('/jokes/:type/ten', (req, res) => {
  res.json(jokeByType(req.params.type, 10));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    type: 'error', message: err.message
  });
});

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
