const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer'); // Assuming you have a separate model file

// Create a customer
router.post('/', async (req, res) => {
    const { firstName, lastName, phoneNumber, email, address } = req.body;
    try {
        const newCustomer = new Customer({ firstName, lastName, phoneNumber, email, address });
        await newCustomer.save();
        res.json(newCustomer);
    } catch (error) {
        res.status(400).json({ message: 'Error saving customer', error });
    }
});

// Get all customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching customers', error });
    }
});

// Get a single customer
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        res.json(customer);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching customer', error });
    }
});

// Update a customer
router.put('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(customer);
    } catch (error) {
        res.status(400).json({ message: 'Error updating customer', error });
    }
});

// Delete a customer
router.delete('/:id', async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting customer', error });
    }
});

module.exports = router;
