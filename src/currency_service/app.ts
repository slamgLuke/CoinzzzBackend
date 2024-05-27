//Crear un servidor con express
import express from 'express';
import trackingRoutes from './trackingRoutes';

const app = express();
const port = 3000;


console.log('Server START!')
app.listen(port, () => {
  console.log(`Currency service app listening at http://localhost:${port}`);
});


app.use('/cs', trackingRoutes);

app.use('/cs',(req, res) => {
  res.send('Currency service root...');
});
