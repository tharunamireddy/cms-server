const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://tharunamireddy07:2zA6l7Gj7FqTrJSJ@cluster0.smmvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Customer Schema
const customerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNumber: String,
    email: String,
    address: String,
});

const Customer = mongoose.model('Customer', customerSchema);

// Routes

// Create a customer
app.post('/api/customers', async (req, res) => {
  const { firstName, lastName, phoneNumber, email, address } = req.body;
  try {
      const existingCustomer = await Customer.findOne({ email });
      if (existingCustomer) {
          return res.status(400).json({ message: 'Customer already exists' });
      }
      const newCustomer = new Customer({ firstName, lastName, phoneNumber, email, address });
      await newCustomer.save();
      res.json(newCustomer);
  } catch (error) {
      res.status(400).json({ message: 'Error saving customer', error });
  }
});


// Get all customers
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json({ status: 'ok', customers });
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Error fetching customers', error });
    }
});

// Get a single customer
app.get('/api/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ status: 'error', message: 'Customer not found' });
        }
        res.json({ status: 'ok', customer });
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Error fetching customer', error });
    }
});

// Update a customer
app.put('/api/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!customer) {
            return res.status(404).json({ status: 'error', message: 'Customer not found' });
        }
        res.json({ status: 'ok', customer });
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Error updating customer', error });
    }
});

// Delete a customer
app.delete('/api/customers/:id', async (req, res) => {
    try {
        const result = await Customer.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ status: 'error', message: 'Customer not found' });
        }
        res.json({ status: 'ok', message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Error deleting customer', error });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
