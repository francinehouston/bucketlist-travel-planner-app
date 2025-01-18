const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs');
});

router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.post('/sign-up', async (req, res) => {
  try {
  
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.send('Username already taken.');
    }
  
   
    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and Confirm Password must match');
    }
  
 
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
  
  
    await User.create(req.body);
  
    res.redirect('/auth/sign-in');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.post('/sign-in', async (req, res) => {
  try {

    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send('Login failed. Please try again.');
    }
  
    
    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );
    if (!validPassword) {
      return res.send('Login failed. Please try again.');
    }
  
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    };
  
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});



router.get('/', (req, res) => {
  try{
    res.render('trips.index.ejs');

  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});



router.get('/new', async (req, res) => {
  res.render('trips/new.ejs');
});

router.post('/', async (req, res) => {
  try {
  
    const currentUser = await User.findById(req.session.user._id);
   
    currentUser.trips.push(req.body);
   
    await currentUser.save();
  
    res.redirect(`/users/${currentUser._id}/trips`);
  } catch (error) {
   
    console.log(error);
    res.redirect('/');
  }
});


router.get('/', async (req, res) => {
  try {
  
    const currentUser = await User.findById(req.session.user._id);
   
    res.render('trips/index.ejs', {
     trips: currentUser.trips,
    });
  } catch (error) {
   
    console.log(error);
    res.redirect('/');
  }
});



router.get('/:tripId', async (req, res) => {
  try {
    
    const currentUser = await User.findById(req.session.user._id);
    
    const application = currentUser.applications.id(req.params.applicationId);
   
    res.render('trips/show.ejs', {
      trip: trip,
    });
  } catch (error) {
  
    console.log(error);
    res.redirect('/');
  }
});



router.delete('/:tripId', async (req, res) => {
  try {
  
    const currentUser = await User.findById(req.session.user._id);
   
    currentUser.trips.id(req.params.tripId).deleteOne();
  
    await currentUser.save();
   
    res.redirect(`/users/${currentUser._id}/trips`);
  } catch (error) {
 
    console.log(error);
    res.redirect('/');
  }
});


router.get('/:tripId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const trip = currentUser.trips.id(req.params.tripsId);
    res.render('trips/edit.ejs', {
      trip:trip,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});



router.put('/:tripId', async (req, res) => {
  try {

    const currentUser = await User.findById(req.session.user._id);
   
    const application = currentUser.applications.id(req.params.tripId);
   
    application.set(req.body);
 
    await currentUser.save();
   
    res.redirect(
      `/users/${currentUser._id}/trips/${req.params.tripId}`
    );
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


module.exports = router;
