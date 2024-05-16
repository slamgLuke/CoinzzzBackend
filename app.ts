import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/{db-name-here}', { useNewUrlParser: true, useUnifiedTopology: true });


app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
