const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAuth,
  verifyTokenAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//create
router.post("/", verifyTokenAuth, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update
router.put("/:id", verifyTokenAuth, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(200).json(err);
  }
});

//delete
router.delete("/:id", verifyTokenAuth, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("cart deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user cart
router.get("/find/:useId", verifyTokenAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({userId:req.params.useId});
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all carts
router.get("/", verifyTokenAdmin, async (req, res) => {
  try{
    const carts = Cart.find()
    res.status(200).json(carts)
  }catch(err){
    res.status(500).json(err)
  }
});


module.exports = router;
