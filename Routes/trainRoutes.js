const express = require("express");
const { Train } = require("../Models/trainModel");
const {findAvailableSeats,markSeatsAsBooked, markAllSeatsAsAvailabale} =require("../Controller/Controller")
const router = express.Router();
router.post("/", async (req, res) => {
  const numSeats = parseInt(req.body.numSeats);
  let train = await Train.findOne();

  try {
    if (!numSeats || numSeats < 1 || numSeats > 7) {
      return res
        .status(400)
        .send({ message: "Invalid number of seats requested" });
    }
    if (!train) {
      return res.status(404).send({ message: "Train not found" });
    }
    let notBooked=train.coach.seats.filter((el)=>el.isBooked===false) 
    if(notBooked.length<numSeats||notBooked.length==0){
      return res.status(400).send({ message: "No seats available" });
    }
    let availableSeats = findAvailableSeats(notBooked,numSeats)
    
    if (availableSeats.length <= 0||availableSeats.length<numSeats) { 
      return res.status(400).send({ message: "No seats available" });
    }
    let marks= markSeatsAsBooked(train.coach.seats, availableSeats);

    train.coach.seats=marks
    await train.save()
    res.send({ seats: availableSeats });
  } 
  catch (err) {
    res.status(500).send(err);
  }
});


router.get("/", async (req, res) => {
  try {
    const train = await Train.findOne()
    res.send(train);
  } catch (err) {
    res.send(err);
  }
});

module.exports = {
  router,
};
