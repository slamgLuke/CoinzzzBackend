//Crear un servidor con express
import express from 'express';
import userRoutes from './userRoutes';
import { connectToDatabase } from './db';

const cors = require('cors');
const app = express();
const port = 3001;

console.log('Server START!')
app.use(cors());
connectToDatabase();
app.listen(port, () => {
  console.log(`USER service app listening at http://localhost:${port}`);
});

app.use(express.json());
app.use('/', userRoutes);

app.use((req, res) => {
  //SEND OK (200) RESPONSE
  res.status(200).send('User Service is running!');
});