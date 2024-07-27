const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./db')
const session = require('express-session')


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const { request } = require('http');

const app = express()
const port = 3000

app.use(cookieParser());
app.use(session({
  secret: 'jdzhbfvskehfnszdhfv',
  resave: false,
  saveUninitialized: true,
  }));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/data', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM user_data ORDER BY timestamp ASC ');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/', async(req,res) => {
  var input = req.body['input'];
  var sessID = req.session.id;
  try {
    await db.query('INSERT INTO user_data (username,session_id,queries) VALUES ($1, $2, $3)',['admin',sessID,input]);
    const result = await db.query('SELECT * FROM user_data where username = $1',['admin']);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`App listening on ${port}`)
})

module.exports = app;
