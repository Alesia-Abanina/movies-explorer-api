require('dotenv').config();

const {
  PORT = 3000,
  DB_URI = 'mongodb://localhost:27017/bitfilmsdb',
} = process.env;

const whitelist = [
  'https://movies.abanina.nomoredomains.monster',
  'http://movies.abanina.nomoredomains.monster',
  'http://localhost:3000',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

module.exports = { PORT, DB_URI, corsOptions };
