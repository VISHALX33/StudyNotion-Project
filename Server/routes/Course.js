const express = require("express");
const router = express.Router();

console.log("🔥🔥🔥 COURSE ROUTES FILE LOADED 🔥🔥🔥");

// Import the controllers

// course controllers Import
const { createCourse, getAllCourses,getCourseDetails,getFullCourseDetails,editCourse,getInstructorCourses,deleteCourse,} = require("../controllers/Course");

//category controllers Import 
const { showAllcategories, createCategory,categoryPageDetails,deleteCategory,} =require("../controllers/Category");

// sections controllers Import 
const {createSection,updateSection,deleteSection ,} =require("../controllers/Section");

//subsection controllers Import
const {createSubSection,updateSubSection,deleteSubSection,} = require("../controllers/Subsection");

//Rating and Review controllers Import
const {createRating,getAverageRating,getAllRating,} =require("../controllers/RatingAndReview");

// updateCourseProgress
const {updateCourseProgress} = require("../controllers/courseProgress");
console.log("✅ updateCourseProgress imported:", typeof updateCourseProgress);

//Importing Middlewares
const {auth, isInstructor, isStudent, isAdmin,} = require("../middlewares/auth");



//---------------------------------------course Routes ------------------------------
  
// courses can only created by Instructor
router.post("/createCourse", auth, isInstructor, createCourse);


// Add a section to a course
router.post("/addSection", auth, isInstructor, createSection);

// update a section
router.post("/updateSection", auth, isInstructor, updateSection);

// Delete a section
router.post("/deleteSection", auth, isInstructor, deleteSection);

// Edit sub section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);

// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection);

// Get all Registered Courses
router.get("/getAllCourses", getAllCourses);

// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails);

// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails);

// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse);

// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);

// Delete a Course
router.delete("/deleteCourse", deleteCourse);

// Test route
router.post("/test-progress", (req, res) => {
  console.log("🧪 TEST ROUTE HIT");
  res.json({ success: true, message: "Test route works!" });
});

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);
console.log("✅ Route registered: POST /api/v1/course/updateCourseProgress");



// ------------------------- category routes only for admin

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllcategories);
router.post("/getCategoryPageDetails", categoryPageDetails);
router.delete("/deleteCategory/:categoryId", auth, isAdmin, deleteCategory);


// ------------------------ Rating and Review ---------------

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

module.exports = router





