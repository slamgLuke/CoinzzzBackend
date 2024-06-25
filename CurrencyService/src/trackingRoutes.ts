//Rutas para el servicio de tracklist

import express, { Request, Response, NextFunction } from 'express';
import { connectToDatabase, getDb } from './db';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const router = express.Router();
const  JWT_SECRET = 'zzznioc';

// Middleware para verificar el token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    console.log("Token check")
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    jwt.verify(token, JWT_SECRET, (err : any, decoded : any) => {
        if (err) {
            return res.status(401).send('Invalid token');
        }
        //console.log(decoded);
        req.body.user = ObjectId.createFromHexString(decoded._id); // Guarda los datos decodificados en la solicitud para usarlos más tarde
        next();
    });
};

// Definir una ruta para el servicio de tracklist
//Obtener la lista de monedas seguidas del usuario
router.get('/track',verifyToken , async (req: Request, res: Response) => {
    //Comunicarse con el servicio de base de datos, y realizar la consulta
    //TODO
    try {
        const db = getDb();
        const collection = db.collection('users');
        const query = { _id: req.body.user };
        //console.log(query);
        //Obtener json con las monedas seguidas

        //Busca en la bd el id 

        const result = await collection.findOne(query);
        console.log(result);
        if (result) {
            res.send(result.tracking_list);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).send('Error getting tracking list');
    }
});

//Postear moneda a seguir
router.post('/track',verifyToken, async (req: Request, res: Response) => {
    //Comunicarse con el servicio de base de datos, y realizar la inserción
    try {
        if (!req.body.currencyId) {
            res.status(400).send('Currency is required');
            return;
        }

        const db = getDb();
        const collection = db.collection('users');
        const query = { _id: req.body.user };
        const update = {
            $addToSet: { tracking_list: req.body.currencyId } // Agrega currencyId a un array, evitando duplicados
        };

        const result = await collection.updateOne(query, update);
        //checkear result
        if (result.modifiedCount > 0) {
            res.send('Tracking added');
            console.log(new Date().toISOString(), "Tracking added.")
            return;
        }
        else
            res.send('Tracking already exists');
    } catch (error) {
        res.status(500).send('Error updating tracking');
    }
});

//Eliminar moneda a seguir
router.delete('/track',verifyToken, async (req: Request, res: Response) => {
    //Comunicarse con el servicio de base de datos, y realizar la eliminación
    try {
        if (!req.body.currencyId) {
            res.status(400).send('Currency is required');
            return;
        }

        const db = getDb();
        const collection = db.collection('users');

        //Obtener json con las monedas seguidas
        const query = { _id: req.body.user };
        const update = { $pull: { tracking_list: req.body.currencyId } }
        const result = await collection.updateOne(query, update);
        if (result.modifiedCount > 0) {
            res.send('Tracking removed');
            console.log(new Date().toISOString(), "Tracking removed.")
            return;
        }
        else 
            res.send('Tracking not found');
    } catch (error) {
        res.status(500).send('Error updating tracking');
    }
});

//Transacciones TEMPLATE
const transactionTemplate = { 
    symbol: String,
    type: String,
    date: Date,
    price: Number,
    quantity: Number,
    value: Number
}


//Portfolio
router.get('/portfolio',verifyToken, async (req: Request, res: Response) => {
    //Comunicarse con el servicio de base de datos, y realizar la consulta
    try {
        const db = getDb();
        const collection = db.collection('users');
        const query = { _id: req.body.user };
        //Obtener json con las monedas seguidas
        const result = await collection.findOne(query);
        if (result) {
            res.send(result.portfolio);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).send('Error getting portfolio');
    }
});

//post portfolio
router.post('/portfolio',verifyToken, async (req: Request, res: Response) => {
    //Comunicarse con el servicio de base de datos, y realizar la inserción
    if (!req.body.transaction) {
        res.status(400).send('Transaction required');
        return;
    }

    try {
        const db = getDb();
        const collection = db.collection('users');
        const query = { _id: req.body.user };

        const transactionToAdd = {...transactionTemplate, ...req.body.transaction}

        if (transactionToAdd.type === 'buy') {
            transactionToAdd.value = transactionToAdd.price * transactionToAdd.quantity ;
        }
        else if (transactionToAdd.type === 'sell') {
            transactionToAdd.value = transactionToAdd.price * transactionToAdd.quantity * -1;
        }
        else {
            res.status(400).send('Invalid transaction type');
            return;
        }
        const update = {
            $addToSet: { "portfolio.transactions" : transactionToAdd},
            $inc: { "portfolio.networth" : transactionToAdd.value}
        };

        const result = await collection.updateOne(query, update);
        if (result.modifiedCount > 0) {
            res.send('Portfolio updated');
            console.log(new Date().toISOString(), "Portfolio updated.")
            return;
        }
        else
            res.send('Portfolio already exists');
    } catch (error) {
        res.status(500).send('Error updating portfolio');
    }
}
);

export default router;