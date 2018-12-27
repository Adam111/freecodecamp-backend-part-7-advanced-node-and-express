const passport = require('passport');
const bcrypt   = require('bcrypt');

module.exports = function(app, db) {
  app.route('/').get((req, res) => {
    // res.sendFile(process.cwd() + '/views/index.html');
    // res.render(process.cwd() + '/views/pug/index', {title: 'Hello', message: 'Please login'});
    res.render(process.cwd() + '/views/pug/index.pug', { title: 'Hello', message: 'Please login', showLogin: true, showRegistration: true });
  });

  // Using route here is required for the test to pass
  app.route('/register').post((req, res, next) => {
    db.db().collection('users').findOne({ username: req.body.username }, function(err, user) {
      if (err) {
        next(err);
      } else if (user) {
        res.redirect('/');
      } else {
        db.db().collection('users').insertOne(
          { username: req.body.username,
           password: bcrypt.hashSync(req.body.password, 12) },
          (err, doc) => {
            if (err) {
              res.redirect('/');
            } else {
              next(null, user);
            }
          }
        )
      }
    })},
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res, next) => {
      res.redirect('/profile');
    }
  );

  app.post('/login', passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
    // const user = req.user;
    res.redirect('/profile');
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/profile', ensureAuthenticated, (req, res) => {
    res.render(process.cwd() + '/views/pug/profile.pug', { username: req.user.username });
  });

  app.use((req, res, next) => {
    res.status(404)
      .type('text')
      .send('Not Found');
  });
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};