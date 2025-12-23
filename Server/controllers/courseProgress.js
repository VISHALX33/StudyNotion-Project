const mongoose = require("mongoose")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course")

exports.updateCourseProgress = async (req, res) => {
  console.log("🎯 updateCourseProgress CONTROLLER HIT");
  console.log("Request body:", req.body);
  
  const { courseId, subsectionId } = req.body
  const userId = req.user.id

  try {
    // Check if the subsection is valid
    const subsection = await SubSection.findById(subsectionId)
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" })
    }

    // Find the course progress document for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    if (!courseProgress) {
      // If course progress doesn't exist, create a new one
      console.log("📝 Creating new CourseProgress document");
      courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedvideos: [subsectionId],
      });
      console.log("✅ CourseProgress created:", courseProgress);
      return res.status(200).json({ 
        success: true,
        message: "Course progress created and updated" 
      });
    } else {
      // If course progress exists, check if the subsection is already completed
      if (courseProgress.completedvideos.includes(subsectionId)) {
        return res.status(400).json({ error: "Subsection already completed" })
      }

      // Push the subsection into the completedVideos array
      courseProgress.completedvideos.push(subsectionId)
      console.log("➕ Added subsectionId to completedvideos");
    }

    // Save the updated course progress
    await courseProgress.save()
    console.log("💾 CourseProgress saved successfully");

    return res.status(200).json({ 
      success: true,
      message: "Course progress updated" 
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}