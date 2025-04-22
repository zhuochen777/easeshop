const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAuth,
  verifyTokenAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//create
router.post("/", verifyTokenAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update
router.put("/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(200).json(err);
  }
});

//delete
router.delete("/:id", verifyTokenAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("product deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//get product
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all products
router.get("/", async (req, res) => {
  const queryNew = req.query.new;
  const queryCategory = req.query.category;

  try {
    let products;

    if (queryNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (queryCategory) {
      products = await Product.find({
        categories: { $in: [queryCategory] },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
