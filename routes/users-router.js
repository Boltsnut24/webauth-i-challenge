const express = require('express');
const Users = require('./users-model.js');
const bcrypt = require('bcryptjs');

const protected = require('../auth/middleware.js')

const router = express.Router();

router.get('/', protected, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
        console.log(err);
        res.send(err)
      });
});

router.post('/register', (req, res) => {
  let { username, password } = req.body;

  const hash = bcrypt.hashSync(password, 8); 

  Users.add({ username, password: hash })
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      console.log(error)
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'You cannot pass!' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('Error logging out.');
      } else {
        res.send('Good Bye');
      }
    });
  }
});


router.get('/hash', (req, res) => {
  const name = req.query.name;

  const hash = bcrypt.hashSync(name, 8); 
  res.send(`The hash for ${name} is: ${hash}`);
});

module.exports= router;