import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRouter from './routes/auth.js';
import menuRouter from './routes/menu.js';
import cartRouter from './routes/cart.js';
import orderRouter from './routes/orders.js';

import errorHandler from './middlewares/errorHandler.js';

// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("🟢 DB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("🔴 DB Connection failed:", err.message);
  });
const database = mongoose.connection;

// Middlewares
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/menu', menuRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

database.on('error', (error) => console.log(error));
database.once('connected', () => {
    console.log('DB Connected');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

app.use(errorHandler);