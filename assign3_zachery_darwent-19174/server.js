const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// POST endpoint to handle order submission
app.post('/order', (req, res) => {
    // Extract data from the request body
    const { name, email, address, payment, cart } = req.body;

    // Calculate the total amount of the order based on cart items
    const totalAmount = cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    // Here you can process the order, save it to a database, send confirmation emails, etc.
    // For now, let's just send back the total amount as a response
    res.json({ totalAmount });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
