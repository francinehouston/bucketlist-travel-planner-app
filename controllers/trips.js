const express = require('express');
const User = require('../models/user');
const router = express.Router();





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

router.get('/new', async (req,res) =>{
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
  
  router.get('/:tripId', async (req, res) => {
    try {
      
      const currentUser = await User.findById(req.session.user._id);
      
      const trip = currentUser.trips.id(req.params.tripId);
      trip.startDate= new Date(trip.startDate).toLocaleDateString();
      trip.endDate= new Date(trip.endDate).toLocaleDateString();
      
      res.render('trips/show', {trip});
    } catch (error) {
     
      console.log(error);
      res.redirect('/');
    }
  });

  router.delete('/:tripId',async (req,res)=> {
    try {
        const currentUser = await User.findById(req.session.user._id);
        currentUser.trips.id(req.params.tripId).deleteOne();
        await currentUser.save();
res.redirect('/users/${currentUser._id}/trips')
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
  });

  router.get('/:tripId/edit', async (req,res)=> {
    try {
const currentUser = await User.findById(req.session.user._id);
const trip = currentUser.trips.id(req.params.tripId);
res.render('trips/edit.ejs', {trip, userId: currentUser._id});
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
  })

  router.put('/:tripId', async (req,res) =>{
    console.log(req.body)
    try {
        const currentUser = await User.findById(req.session.user._id);
        const trip = currentUser.trips.id(req.params.tripId);
        trip.title= req.body.title;
        trip.destination=req.body.destination;
        trip.activities=req.body.activities;
        await currentUser.save();
        await trip.save();
res.redirect(`/users/${currentUser._id}/trips/${trip._id}`)

    } catch (error) {
console.log(error);
res.redirect('/');
    }
  });


module.exports = router;