//Crear un servidor con express
import express from 'express';
import trackingRoutes from './trackingRoutes';
import coinRoutes from './coinRoutes';
import { connectToDatabase } from './db';

const cors = require('cors');
const app = express();
const port = 3000;

console.log('Server START!')
app.use(cors());
connectToDatabase();
app.listen(port, () => {
  console.log(`Currency service app listening at http://localhost:${port}`);
});

app.use(express.json());
app.use('/', trackingRoutes);
app.use('/', coinRoutes);


app.use((req, res) => {
  //SEND OK (200) RESPONSE
  res.status(200).send('Curency Service is running!');
});