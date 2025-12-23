import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import Catalog from './pages/Catalog';
import CourseDetails from './pages/CourseDetails';
import Contact from './pages/Contact';
import ContactUs from './pages/ContactUs';
import About from './pages/About';
import MyProfile from './pages/MyProfile';
import Settings from './pages/Settings';
import EnrolledCourses from './pages/EnrolledCourses';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import Cart from './pages/Cart';
import MyCourses from './pages/MyCourses';
import AddCourse from './pages/AddCourse';
import EditCourse from './pages/EditCourse';
import ViewCourse from './pages/ViewCourse';
import CategoryPage from './pages/CategoryPage';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Reviews from './pages/Reviews';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen flex flex-col bg-dark-50">
          <Navbar />
          <main className="flex-grow pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/update-password/:id" element={<UpdatePassword />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/courses" element={<Catalog />} />
              <Route path="/catalog/:categoryId" element={<CategoryPage />} />
              <Route path="/courses/:courseId" element={<CourseDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/about" element={<About />} />
              <Route path="/reviews" element={<Reviews />} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard/my-profile" element={<MyProfile />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses />} />
              <Route path="/dashboard/student" element={<StudentDashboard />} />
              <Route path="/dashboard/instructor" element={<InstructorDashboard />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/dashboard/cart" element={<Cart />} />
              <Route path="/dashboard/checkout" element={<Checkout />} />
              <Route path="/dashboard/payment" element={<Checkout />} />
              
              {/* Course Management Routes */}
              <Route path="/dashboard/my-courses" element={<MyCourses />} />
              <Route path="/dashboard/add-course" element={<AddCourse />} />
              <Route path="/dashboard/edit-course/:courseId" element={<EditCourse />} />
              <Route path="/view-course/:courseId" element={<ViewCourse />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
