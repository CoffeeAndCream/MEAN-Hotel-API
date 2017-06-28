var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

//GET all reviews for a hotel
module.exports.reviewsGetAll = function(req, res) {
  var hotelId = req.params.hotelId;

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
      var response = {
        status : 200,
        message : hotel.reviews
      };
      if (err) {
        response.status = 500;
        response.message = err;
      } else if(!hotel) {
        response.status = 404;
        response.message = {
          "message" : "Could not find hotel with that ID"
        }
      } else if(!hotel.reviews) {
        response.message = {
          "message" : "No reviews available."
        }
      } else {
        response.message = hotel.reviews
      }
      res
        .status(response.status)
        .json(response.message);
    });
};

//GET a specific review for a hotel
module.exports.reviewsGetOne = function(req, res) {
  var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;
  console.log("GET reviewId " + reviewId + " for hotelId " + hotelId);

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        response.status = 500;
        response.message = err;
      } else if(!hotel){
        response.status = 404;
        response.message = {
          "message" : "Could not find hotel with that ID"
        }
      } else {
        response.message = hotel.reviews.id(reviewId);

        if (!response.message) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      res
        .status(response.status)
        .json(response.message)
    })
};

var _addReview = function(req, res, hotel) {

  hotel.reviews.push({
    name : req.body.name,
    rating : parseInt(req.body.rating, 10),
    review : req.body.review
  });

  hotel.save(function(err, hotelUpdated){
    if (err) {
      console.log(err);
      res
        .status(500)
        .json(err);
    } else {
      res
        .status(201)
        .json(hotelUpdated.reviews[hotelUpdated.reviews.length - 1]);
    }
  });

};

module.exports.reviewsAddOne = function(req, res) {
  var hotelId = req.params.hotelId;

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
      var response = {
        status : 200,
        message : hotel.reviews
      };
      if (err) {
        response.status = 500;
        response.message = err;
      } else if(!hotel) {
        response.status = 404;
        response.message = {
          "message" : "Could not find hotel with that ID"
        }
      } else if(!hotel.reviews) {
        response.message = {
          "message" : "No reviews available."
        }
      }
      if(hotel) {
        _addReview(req, res, hotel);
      } else {
        res
          .status(response.status)
          .json(response.message);
      }
      res
        .status(response.status)
        .json(response.message);
    });

};


module.exports.reviewsUpdateOne = function(req, res) {
  var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
      var response = {
        status : 200,
        message : hotel.reviews
      };
      if (err) {
        response.status = 500;
        response.message = err;
      } else if(!hotel) {
        response.status = 404;
        response.message = {
          "message" : "Could not find hotel with that ID"
        }
      } else if(!hotel.reviews) {
        response.message = {
          "message" : "No reviews available."
        }
      }
      if(response.status !== 200){
        res
          .status(response.status)
          .json(response.message);
      } else {
        hotel.reviews.id(reviewId).name = req.body.name;
        hotel.reviews.id(reviewId).rating = parseInt(req.body.rating, 10);
        hotel.reviews.id(reviewId).review = req.body.review;

        hotel.save(function(err, updatedHotel) {
          if(err){
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        })
      }
    });
};

module.exports.reviewsDeleteOne = function(req, res) {
  var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
      var response = {
        status : 200,
        message : hotel.reviews
      };
      if (err) {
        response.status = 500;
        response.message = err;
      } else if(!hotel) {
        response.status = 404;
        response.message = {
          "message" : "Could not find hotel with that ID"
        }
      } else if(!hotel.reviews) {
        response.message = {
          "message" : "No reviews available."
        }
      }
      if(response.status !== 200){
        res
          .status(response.status)
          .json(response.message);
      } else {
        thisReview = hotel.reviews.id(reviewId);

        if(!thisReview) {
          response.status = 404;
          response.messsage = {
            "message" : "Review ID not found " + reviewId
          };
        }
    }
    if(response.status !== 200) {
      res
        .status(response.status)
        .json(response.message);
    } else {
      hotel.reviews.id(reviewId).remove();
      hotel.save(function(err, updatedHotel) {
        if(err){
          res
            .status(500)
            .json(err);
        } else {
          res
            .status(204)
            .json();
        }
      })
    }
  });
};
