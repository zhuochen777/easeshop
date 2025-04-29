const router = require("express").Router();
const dotenv = require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/payment", async (req, res) => {
  try {
    const {products} = req.body
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.title,
          images: [product.img],
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection:{
        allowed_countries:["US","CA"]
      },
      success_url: `${process.env.BASE_URL}/success`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
    });


    res.status(200).json({id:session.id});
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
