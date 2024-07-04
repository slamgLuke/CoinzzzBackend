//Crear un servidor con express
import express from 'express';
import trackingRoutes from './trackingRoutes';
import coinRoutes from './coinRoutes';
import coinScheduler from './coinScheduler';
import { connectToDatabase } from './db';


const cors = require('cors');
const app = express();
const port = 3000;
const TIME_INTERVAL = 120; // in seconds

console.log('Server START!')
app.use(cors());
connectToDatabase().then(() => {
  setInterval(coinScheduler, TIME_INTERVAL * 1000); // Set the interval to 10 seconds (10 * 1000 milliseconds)
});

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

