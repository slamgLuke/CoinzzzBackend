//Rutas para el servicio de tracklist

import express, { Request, Response, NextFunction } from 'express';
import { connectToDatabase, getDb } from './db';
import jwt from 'jsonwebtoken';


const router = express.Router();
const  JWT_SECRET = 'zzznioc';

// Middleware para verificar el token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    jwt.verify(token, JWT_SECRET, (err : any, decoded : any) => {
        if (err) {
            return res.status(401).send('Invalid token');
        }
        req.body.user = decoded; // Guarda los datos decodificados en la solicitud para usarlos más tarde
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
        const query = { userId: req.body.user._id };
        //Obtener json con las monedas seguidas
        const result = await collection.findOne(query);
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
        const query = { userId: req.body.user._id };
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
        const query = { userId: req.body.user._id };
        const update = { $pull: { tracking_list: req.body.user.currencyId } }
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


//Obtener lista de monedas publica
router.get('/currency', async (req: Request, res: Response) => {
    //Comunicarse con el servicio de base de datos, y realizar la consulta
    try {
        const db = getDb();
        const collection = db.collection('currencies');
        const result = await collection.find().toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send('Error getting currencies');
    }
});

//añadir monedas a la base de datos ADMIN ONLY
router.post('/currency', async (req: Request, res: Response) => {
    //Obtener datos de la moneda
    const currencyId = req.body.currencyId;
    const currencyName = req.body.currencyName;
    const PASSWORD = req.body.PASSWORD;

    if (PASSWORD !== 'coinzzz') {
        res.status(401).send('Unauthorized');
        return;
    }

    //Validar que se haya enviado la moneda
    if (!currencyId) {
        res.status(400).send('Currency is required');
        return;
    }

    //Comunicarse con el servicio de base de datos, y realizar la inserción
    try {
        const db = getDb();
        const collection = db.collection('currencies');
        const query = { currencyId: currencyId };
        const update = {
            $set: { currencyName: currencyName }
        };

        const result = await collection.updateOne(query, update, { upsert: true });
        if (result.upsertedCount > 0) {
            res.send('Currency added');
        } else {
            res.send('Currency already exists');
        }
    } catch (error) {
        res.status(500).send('Error updating currency');
    }
});

export default router;