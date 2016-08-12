'use strict';

const github = require('./lib/github');

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.status(200).render('index');
  });

  app.post('/searchUser', github.searchUser);
  app.get('/user/:username', github.userDetail);
  app.get('/*', (req, res) => {
    res.status(404).render('error', {message: 'Sorry, you apparently got lost...'});
  })
};