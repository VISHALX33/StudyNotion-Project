// Quick debug script - check if student is enrolled
const mongoose = require('mongoose');
require('dotenv').config();

const Course = require('./models/Course');
const User = require('./models/User');
const RatingAndReview = require('./models/RatingAndReview');

async function checkEnrollment() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to DB');
    
    const userId = '6943f619185fb706a543b80a'; // From the JWT token
    const courseId = process.argv[2]; // Pass as argument
    
    if (!courseId) {
      console.log('Usage: node test-enrollment.js <courseId>');
      process.exit(1);
    }
    
    console.log('Checking enrollment for:');
    console.log('User ID:', userId);
    console.log('Course ID:', courseId);
    
    const user = await User.findById(userId);
    console.log('\nUser:', user?.firstName, user?.email);
    console.log('Account Type:', user?.accountType);
    
    const course = await Course.findById(courseId);
    console.log('\nCourse:', course?.courseName);
    console.log('Students Enrolled:', course?.studentsEnrolled?.length);
    console.log('Is Enrolled:', course?.studentsEnrolled?.includes(userId));
    
    const existingReview = await RatingAndReview.findOne({ user: userId, course: courseId });
    console.log('\nExisting Review:', existingReview ? 'YES' : 'NO');
    if (existingReview) {
      console.log('Review ID:', existingReview._id);
      console.log('Rating:', existingReview.rating);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkEnrollment();
