//Crear un servidor con express
import express from 'express';
import trackingRoutes from './trackingRoutes';
import { connectToDatabase } from './db';

const app = express();
const port = 3000;


console.log('Server START!')
connectToDatabase();
app.listen(port, () => {
  console.log(`Currency service app listening at http://localhost:${port}`);
});

app.use(express.json());
app.use('/cs', trackingRoutes);

