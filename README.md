# RESTAURANT RESERVATION SYSTEM – API DOCUMENTATION
Base URL: http://localhost:3000/api

## AUTHENTICATION
POST /auth/login

Description: Authenticate an admin and return a JWT token.
Request Body:

{
  "email": "admin@example.com",
  "password": "your_password"
}

Response:

{
  "token": "JWT_TOKEN",
  "admin": {
    "id": 1,
    "name": "Admin Name",
    "email": "admin@example.com"
  }
}

👤 CUSTOMERS

🔒 All routes require a valid JWT in the Authorization header.
POST /customers

Create a new customer

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890"
}

GET /customers

Get a list of all customers
GET /customers/:id/reservations

Get reservation history of a specific customer
PUT /customers/:id

Update a customer

{
  "name": "Updated Name",
  "email": "new@example.com",
  "phone": "999888777"
}

DELETE /customers/:id

Delete a customer
🍽️ TABLES
POST /tables

Create a new table

{
  "capacity": 4
}

GET /tables

Get all tables
GET /tables/available?date=YYYY-MM-DD&time=HH:mm&people=4

Check available tables for a specific date, time, and number of people
📅 RESERVATIONS
POST /reservations

Create a new reservation

{
  "customer_id": 1,
  "table_id": 2,
  "date": "2025-06-01",
  "time": "19:00",
  "people": 4
}

→ 📧 Sends confirmation email to the customer
GET /reservations

Get all reservations (including customer and table details)
PUT /reservations/:id

Update a reservation

{
  "date": "2025-06-01",
  "time": "20:00",
  "people": 2,
  "table_id": 3
}

→ 📧 Sends updated confirmation email to the customer
DELETE /reservations/:id

Cancel a reservation

→ Reservation status becomes "cancelled"
📩 EMAILS

    Emails are sent using the configured MAIL_USER and MAIL_PASS.

    Sent when:

        A reservation is created

        A reservation is updated

🔐 SECURITY

    All routes (except /auth/login) require a JWT via Authorization: Bearer <token>.

    Passwords are hashed using bcryptjs.

🧪 STATUS CODES
Code	Meaning
200	OK
201	Created
400	Bad Request
401	Unauthorized
403	Forbidden (invalid token)
404	Not Found
409	Conflict (e.g. table busy)
500	Internal Server Error