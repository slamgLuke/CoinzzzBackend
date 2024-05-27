//Rutas para el servicio de tracklist y portfolio

import express, { Request, Response } from 'express';
import { connectToDatabase, getDb } from './db';
const router = express.Router();

// Definir una ruta para el servicio de tracklist

//Obtener la lista de monedas seguidas del usuario
router.get('/track', (req: Request, res: Response) => {
    //Obtener datos del usuario
    const userId = req.query.userId;

    //Validar que se haya enviado la moneda
    if (!userId) {
        res.status(400).send('User is required');
        return;
    }

    //Comunicarse con el servicio de base de datos, y realizar la consulta
    //TODO
    try {
        const db = getDb();
        const collection = db.collection('tracking');
        const query = { userId: userId };
        const result = collection.find(query);
        res.send(result);
    } catch (error) {
        res.status(500).send('Error getting tracking list');
    }
});


//Postear moneda a seguir
router.post('/track', (req: Request, res: Response) => {
    //Obtener datos del usuario
    const userId = req.query.userId;
    //Obtener datos de la moneda
    const currencyId = req.query.currencyId;

    //Validar que se haya enviado el usuario
    if (!userId) {
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
        const collection = db.collection('tracking');
        const query = { userId: userId, currencyId: currencyId };
        const result = collection.insertOne(query);
        res.send(result);
    } catch (error) {
        res.status(500).send('Error inserting tracking');
    }
});

//Eliminar moneda a seguir
router.delete('/track', (req: Request, res: Response) => {
    //Obtener datos del usuario
    const userId = req.query.userId;
    //Obtener datos de la moneda
    const currencyId = req.query.currencyId;

    //Validar que se haya enviado el usuario
    if (!userId) {
        res.status(400).send('User is required');
        return;
    }

    //Validar que se haya enviado la moneda
    if (!currencyId) {
        res.status(400).send('Currency is required');
        return;
    }

    //Comunicarse con el servicio de base de datos, y realizar la eliminación
    //TODO
    try{
        const db = getDb();
        const collection = db.collection('tracking');
        const query = { userId: userId, currencyId: currencyId };
        const result = collection.deleteOne(query);
        res.send(result);
    } catch (error) {
        res.status(500).send('Error deleting tracking');
    }
});

/*
// Definir una ruta para el servicio de portfolio
router.get('/portfolio', (req: Request, res: Response) => {
    //Obtener datos del usuario
    const userId = req.query.userId;
    const currency = req.query.currency;
    let date = req.query.date;

    //Validar que se haya enviado el usuario
    if (!userId) {
        res.status(400).send('User is required');
        return;
    }

    //Validar que se haya enviado la moneda
    if (!currency) {
        res.status(400).send('Currency is required');
        return;
    }

    //Si no se envía la fecha, se toma la fecha actual
    if (!date) {
        date = new Date().toISOString().split('T')[0];
    }

    //Enviar respuesta
    //TODO: IMPLEMENTAR
    res.send(`Portfolio of user ${userId} for ${date}`);

});*/

export default router;