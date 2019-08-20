const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

const apps = require('./playstore.js');

app.get('/apps', (req, res) => {
  const { sort, genres } = req.query;

  let results = [...apps];

  if (genres) {
    const validGenres = [
      'action',
      'puzzle',
      'strategy',
      'casual',
      'arcade',
      'card'
    ];
    if (!validGenres.includes(genres.toLowerCase())) {
      return res.status(400).send('Must be a valid genre');
    }
    results = results.filter(app =>
      app.Genres.toLowerCase.includes(genres.toLowerCase())
    );
  }
  if (sort) {
    if (!(sort.toLowerCase() === 'rating') && !(sort.toLowerCase() === 'app')) {
      return res.status(400).send('Must sort by app or rating');
    }
    if (sort.toLowerCase() === 'rating') {
      results = results.sort((a, b) => {
        return b.Rating - a.Rating;
      });
    }
    if (sort.toLowerCase() === 'app') {
      results = results.sort((a, b) => {
        if (b.App.toLowerCase() > a.App.toLowerCase()) return -1;
        else return 1;
      });
    }
  }

  res.json(results);
});

app.listen(8000, () => {
  console.log('Server started on PORT 8000');
});
