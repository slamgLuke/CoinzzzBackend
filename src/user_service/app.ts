//Crear un servidor con express
import express from 'express';


const app = express();
const port = 3001;


console.log('Server START!')
app.listen(port, () => {
  console.log(`User service app listening at http://localhost:${port}`);
});


app.use('/us',(req, res) => {
  res.send('User service');
});