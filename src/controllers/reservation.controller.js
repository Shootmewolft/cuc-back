import Reservation from "../models/reservation.model.js"
import Table from "../models/table.model.js"
import Customer from "../models/customer.model.js"
import { sendReservationEmail } from "../utils/mailer.js"
import { Op } from "sequelize"

export const createReservation = async (req, res) => {
  const { customer_id, table_id, date, time, people } = req.body

  try {
    const table = await Table.findByPk(table_id)
    if (!table) return res.status(404).json({ message: "Table not found" })
    if (table.capacity < people)
      return res.status(400).json({ message: "Table capacity is not enough" })

    // Check if table is already reserved at the given time
    const conflict = await Reservation.findOne({
      where: {
        table_id,
        date,
        time,
        status: "confirmed",
      },
    })

    if (conflict) {
      return res
        .status(409)
        .json({ message: "Table is already reserved at that date and time" })
    }

    const reservation = await Reservation.create({
      customer_id,
      table_id,
      date,
      time,
      people,
      status: "confirmed",
    })

    // Actualizar estado de la mesa a 'occupied'
    table.status = "occupied"
    await table.save()
    // Send confirmation email
    const customer = await Customer.findByPk(customer_id)
    await sendReservationEmail(customer.email, {
      name: customer.name,
      date,
      time,
      people,
      table_id,
    })

    res.status(201).json(reservation)
  } catch (error) {
    res.status(500).json({ message: "Failed to create reservation", error })
  }
}

export const getAllReservations = async (req, res) => {
  const { date } = req.query

  const where = {}
  if (date) {
    where.date = date
  }

  try {
    const reservations = await Reservation.findAll({
      where,
      include: [Customer, Table],
      order: [
        ["date", "ASC"],
        ["time", "ASC"],
      ],
    })

    res.json(reservations)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reservations", error })
  }
}

export const updateReservation = async (req, res) => {
  const { id } = req.params
  const { date, time, people, table_id } = req.body

  try {
    const reservation = await Reservation.findByPk(id)
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" })

    const table = await Table.findByPk(table_id)
    if (!table) return res.status(404).json({ message: "Table not found" })
    if (table.capacity < people)
      return res.status(400).json({ message: "Table capacity is not enough" })

    const conflict = await Reservation.findOne({
      where: {
        id_reservation: { [Op.ne]: id },
        table_id,
        date,
        time,
        status: "confirmed",
      },
    })

    if (conflict) {
      return res
        .status(409)
        .json({ message: "Table is already reserved at that date and time" })
    }

    reservation.date = date
    reservation.time = time
    reservation.people = people
    reservation.table_id = table_id
    await reservation.save()

    const customer = await Customer.findByPk(reservation.customer_id)
    await sendReservationEmail(customer.email, {
      name: customer.name,
      date,
      time,
      people,
      table_id,
    })

    res.json(reservation)
  } catch (error) {
    res.status(500).json({ message: "Failed to update reservation", error })
  }
}

export const cancelReservation = async (req, res) => {
  const { id } = req.params

  try {
    const reservation = await Reservation.findByPk(id)
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" })

    reservation.status = "cancelled"
    await reservation.save()

    const otherActive = await Reservation.findOne({
      where: {
        table_id: reservation.table_id,
        status: "confirmed",
        date: reservation.date,
        time: reservation.time,
      },
    })

    if (!otherActive) {
      const table = await Table.findByPk(reservation.table_id)
      table.status = "available"
      await table.save()
    }

    res.json({ message: "Reservation cancelled" })
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel reservation", error })
  }
}