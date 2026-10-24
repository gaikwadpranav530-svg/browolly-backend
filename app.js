const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const addFeatureRoutes = require("./routes/addFeature.routes");
const bookingRoutes = require("./routes/booking.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const contactRoutes = require("./routes/contact.routes");
const cors = require("cors");
const dotenv = require("dotenv")
dotenv.config()
const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error(`Origin ${origin} is not allowed by CORS`));
    }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/features", addFeatureRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/contact", contactRoutes );

app.get("/", (req, res) => {
    res.send("Borrowly Backend is running");
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

const start = async () => {
    await connectDB();
    const port = Number(process.env.PORT) || 5000;
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
};

start().catch((error) => {
    console.error("Server startup failed:", error);
    process.exit(1);
});
