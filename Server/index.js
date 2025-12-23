const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");
const contactRoutes = require("./routes/Contact");


const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

// database connect 
database.connect();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:5173",
        credentials:true,
    })
)

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)

// cloudinary connection
cloudinaryConnect();

// Debug middleware - log all incoming requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
console.log("📍 Course routes mounted at /api/v1/course");
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactRoutes);


// def route 

app.get("/", (req, res) =>{
    return res.json({
        success:true,
        message:"your sever is up and running ",
    });
});

app.listen(PORT, () =>{
    console.log(`App is running at ${PORT}`)
})

