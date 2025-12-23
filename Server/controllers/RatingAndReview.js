const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const mongoose = require('mongoose');

// create Rating 
exports.createRating = async (req, res) =>{
    try{

        // getting user id
        const userId = req.user.id;

        // fetch data from req body
        const {courseId, review, rating} =req.body;

        // Validation
        if (!courseId || !review || !rating) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Rating and Review lie between 1 to 5
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5",
            });
        }

        // validation check user is enrolled or not
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } },
        });
                          
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled in this course",
            });
        }

        // Check if user already reviewed this course
        const alreadyReviewed = await RatingAndReview.findOne({
            user:userId,
            course:courseId,
        });
    
        if(alreadyReviewed){
            // Update existing review instead of rejecting
            alreadyReviewed.rating = rating;
            alreadyReviewed.review = review;
            await alreadyReviewed.save();
            
            // Populate user data
            await alreadyReviewed.populate('user', 'firstName lastName image email');

            console.log("Rating updated successfully:", alreadyReviewed);

            return res.status(200).json({
                success:true,
                message:"Rating and Review updated successfully",
                ratingReview: alreadyReviewed,
            });
        }

        // create rating and review
        const ratingReview = await RatingAndReview.create({
            rating, 
            review,
            course:courseId,
            user:userId,
        });

        // Populate user data in the created review
        await ratingReview.populate('user', 'firstName lastName image email');

        // update the course with new rating
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    ratingAndReviews:ratingReview._id,
                }
            },
            {new: true}
        );

        console.log("Rating created successfully:", ratingReview);  

        // return response
        return res.status(200).json({
            success:true,
            message:"Rating and Review created successfully",
            ratingReview,
        });
                
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:true,
            message:"Rating and Review created Successfully",
            message:error.message,
        });
    }
}


// getAverageRating

exports.getAverageRating = async (req, res) =>{
    try{
        // get courseId
        const courseId = req.body.courseId;

        // calculate the average rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id:null,
                    averageRating: { $avg: "$rating"},
                }
            }
        ])

        // return rating
        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,
            })
        }
        // if no rating and Review exist
        return res.status(200).json({
            success:true,
            message:"Average Rating is 0 , No rating given till now",
            averageRating:0,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

// getAllRatingAndReviews

exports.getAllRating = async (req, res) => {
    try {
      const allReviews = await RatingAndReview.find()
        .sort({ rating: -1 }) // high rating first 
        .populate({
          path: "user",
          select: "firstName lastName email image",
        })
        .populate({
          path: "course",
          select: "courseName",
        })
        .exec();
  
      return res.status(200).json({
        success: true,
        message:"All reviews fetched successfully",
        data: allReviews,
      });
    }
     catch (error) {
      console.error("Error in getAllRatingAndReviews:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong while getting all ratings",
        error: error.message,
      });
    }
  };