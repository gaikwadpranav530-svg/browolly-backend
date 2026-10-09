const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const addFeatureRoutes = require("./routes/addFeature.routes");
const bookingRoutes = require("./routes/booking.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const contactRoutes = require("./routes/contact.routes");
const dotenv = require("dotenv")
dotenv.config()
const app = express();

connectDB();

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

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
