//Rutas para el servicio de tracklist

import express, { Request, Response } from 'express';
import { connectToDatabase, getDb } from './db';
const router = express.Router();

// Definir una ruta para el servicio de tracklist
//Obtener la lista de monedas seguidas del usuario
router.get('/track', async (req: Request, res: Response) => {
    //Obtener datos del usuario
    const email = req.body.email;

    //Validar que se haya enviado la moneda
    if (!email) {
        res.status(400).send('User is required');
        return;
    }

    //Comunicarse con el servicio de base de datos, y realizar la consulta
    //TODO
    try {
        const db = getDb();
        const collection = db.collection('users');
        const query = { email: email };
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
router.post('/track', async (req: Request, res: Response) => {
    //Obtener datos del usuario
    const email = req.body.email;
    //Obtener datos de la moneda
    const currencyId = req.body.currencyId;

    //Validar que se haya enviado el usuario
    if (!email) {
        console.log('User is required', email);
        res.status(400).send('User is required');
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
        const collection = db.collection('users');
        const query = { "email": email };
        const update = {
            $addToSet: { tracking_list: currencyId } // Agrega currencyId a un array, evitando duplicados
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
router.delete('/track', async (req: Request, res: Response) => {
    //Obtener datos del usuario
    const userId = req.body.userId;
    //Obtener datos de la moneda
    const removeCurrencyId = req.body.currencyId;

    //Validar que se haya enviado el usuario
    if (!userId) {
        res.status(400).send('User is required');
        return;
    }

    //Validar que se haya enviado la moneda
    if (!removeCurrencyId) {
        res.status(400).send('Currency is required');
        return;
    }

    //Comunicarse con el servicio de base de datos, y realizar la eliminación
    try {
        const db = getDb();
        const collection = db.collection('users');

        //Obtener json con las monedas seguidas
        const query = { userId: userId };
        const update = { $pull: { tracking_list: removeCurrencyId } }
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