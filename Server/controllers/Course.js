const { response } = require("express");
const Course = require("../models/Course");
const Category = require("../models/category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const category = require("../models/category");
const RatingAndReview = require("../models/RatingAndReview");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const { convertSecondsToDuration } = require("../utils/secToDuration");


// createCourse handler functin
exports.createCourse = async (req, res) =>{
    try{
        // fetch data
        const {courseName, courseDescription, whatYouWillLearn, price, category} = req.body;

        // get thumbnail
        const thumbnail = req.files.thumbnailImage;

        // validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !thumbnail){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }

        // check for instructor 
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
         console.log("Instructor Details: ", instructorDetails);
        //accountType:"Instructor",

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instrunctor Details not found",
            });
        }

        // check category is valid or not
        const categoryDetails = await Category.findById(category);
            if(!categoryDetails){
                return res.status(404).json({
                    success:false,
                    message:"Category Details not found",
                });
            }

            // Upload Image on cloudinary
            const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

            // create an entry for new course
            const newCourse = await Course.create({
                courseName,
                courseDescription,
                instructor:instructorDetails._id,
                whatYouWillLearn:whatYouWillLearn,
                price,
                category:categoryDetails._id,
                thumbnail:thumbnailImage.secure_url,
                status: "Published",
                tag: [],
            });


            //  add the new course
            await User.findByIdAndUpdate(
                {_id: instructorDetails._id},
                {
                    $push:{
                        courses: newCourse._id,
                    }
                },
                {new:true},
            );


            // TODO HW by myself
            // update the Tag schema
            await Category.findByIdAndUpdate(
                categoryDetails._id,
                {
                     $push: 
                    { course: newCourse._id }
                 },
                { new: true }
              );
              


            return res.status(200).json({
                success:true,
                message:"Course created successfully",
                data:newCourse,
            });
        }
    
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create course",
            error:error.message,
        })
    }
};

// Get allcourses handler function

exports.getAllCourses = async (req, res) =>{
    try{
        const allCourses = await Course.find(
            { status: "Published" },
            {
                courseName: true,
                courseDescription: true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentsEnrolled: true,
                category: true,
                tag: true,
            }
        )
        .populate("instructor")
        .populate("category")
        .populate({
            path: "ratingAndReviews",
            populate: {
                path: "user",
                select: "firstName lastName image",
            },
        })
        .exec();

        return res.status(200).json({
            success:true,
            message:"Data for all courses fetched successfully",
            data:allCourses,
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Can not fetch course data",
            error:error.message,
        })
    }

};

// getCourseDetails
exports.getCourseDetails = async(req, res) =>{
    try{
        //get id
        const {courseId} = req.body;

        // find course details
        const courseDetails = await Course.findById(courseId)
                                    // {_id:courseId})
                                    .populate(
                                        {
                                            path:"instructor",
                                            populate:{
                                                path:"additionalDetails",
                                            },
                                        }
                                    )
                                    .populate("category")
                                    .populate({
                                        path: "ratingAndReviews",
                                        populate: {
                                            path: "user",
                                            select: "firstName lastName image",
                                        },
                                    })
                                    .populate({
                                        path:"courseContent",
                                        populate:{
                                            path:"SubSection",
                                        },
                                    })
                                    .exec();

             // validation
             if(!courseDetails){
                return res.status(400).json({
                    success:false,
                    message:`could not find the course with ${courseId}`,
                });
             }  
               // return response
              
                  return res.status(200).json({
                      success:true,
                       message:"course Details fetched successfully ",
                       data:courseDetails,
                   })  

     }
    catch(error){
        console.log("Error during getcourseDetails");
        return res.status(500).json({
            success:false,
            message: "error during getcourseDetails",
            error:error.message,
        });
    }
}

                  // getFullCourseDetails 

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      if (content.SubSection && Array.isArray(content.SubSection)) {
        content.SubSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration || 0)
          totalDurationInSeconds += timeDurationInSeconds
        })
      }
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedvideos
          ? courseProgressCount?.completedvideos
          : [],
      },
    })
  } catch (error) {
    console.error("ERROR in getFullCourseDetails:", error)
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// edit course 
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key of Object.keys(updates)) {
  if (key === "tag" || key === "instructions") {
    course[key] = JSON.parse(updates[key])
  } else {
    course[key] = updates[key]
  }
}

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

//  Get a list of course for a given Instructor 
exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 })
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
  }

  // Delete the Course
  exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentsEnroled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }

     

