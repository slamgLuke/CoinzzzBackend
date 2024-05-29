//Rutas para el servicio de tracklist

import express, { Request, Response } from 'express';
import { connectToDatabase, getDb } from './db';
const router = express.Router();

// Definir una ruta para el servicio de tracklist
//Obtener la lista de monedas seguidas del usuario
router.get('/track', async (req: Request, res: Response) => {
    //Obtener datos del usuario
    const userId = req.body.userId;

    //Validar que se haya enviado la moneda
    if (!userId) {
        res.status(400).send('User is required');
        return;
    }

    //Comunicarse con el servicio de base de datos, y realizar la consulta
    //TODO
    try {
        const db = getDb();
        const collection = db.collection('users');
        const query = { userId: userId };
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
    const userId = req.body.userId;
    //Obtener datos de la moneda
    const currencyId = req.body.currencyId;

    //Validar que se haya enviado el usuario
    if (!userId) {
        console.log('User is required', userId);
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
        const query = { userId: userId };
        const update = {
          $addToSet: { tracking_list: currencyId } // Agrega currencyId a un array, evitando duplicados
        };

        const result = await collection.updateOne(query, update);
        if (result.upsertedCount > 0) {
            res.send('Tracking added');
        }else
        {
            res.send('Tracking already exists');
        }
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
        const update = {$pull: { tracking_list : removeCurrencyId}}
        const result = await collection.updateOne(query, update);
        if (result.modifiedCount > 0) {
            res.send('Tracking removed');
        }
        else{
            res.send('Tracking not found');
        }
    } catch (error) {
        res.status(500).send('Error updating tracking');
    }
});

export default router;