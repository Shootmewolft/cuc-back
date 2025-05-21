import Customer from '../models/customer.model.js';
import Reservation from '../models/reservation.model.js';
import Table from '../models/table.model.js';

export const createCustomer = async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const existingCustomer = await Customer.findOne({ where: { email } });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const newCustomer = await Customer.create({ name, email, phone });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create customer', error });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch customers', error });
  }
};

export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  try {
    const customer = await Customer.findByPk(id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    customer.name = name;
    customer.email = email;
    customer.phone = phone;
    await customer.save();

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update customer', error });
  }
};

export const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findByPk(id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    await customer.destroy();
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete customer', error });
  }
};

export const getCustomerReservations = async (req, res) => {
  const { id } = req.params;

  try {
    const reservations = await Reservation.findAll({
      where: { customer_id: id },
      include: [{ model: Table }],
      order: [['date', 'DESC'], ['time', 'DESC']]
    });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reservation history', error });
  }
};
