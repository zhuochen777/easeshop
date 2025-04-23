const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const cors = require("cors")

const app = express();
app.use(cors())


dotenv.config();

app.use(express.json())
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("db connection successes");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT || 5000, () => {
  console.log("server is running");
});
