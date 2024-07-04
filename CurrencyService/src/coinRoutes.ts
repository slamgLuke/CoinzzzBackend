import { Request, Response, Router } from 'express';
import { getDb } from './db';

const router = Router();


//Rutas publicas de monedas
//Obtener lista de monedas publica
router.get('/currency', async (req: Request, res: Response) => {
    //Comunicarse con el servicio de base de datos, y realizar la consulta
    console.log("Currency request received." , new Date().toISOString())
    try {
        const db = getDb();
        const collection = db.collection('currencies');
        const result = await collection.find().toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send('Error getting currencies');
    }
});

//Obtener datos de una moneda publica
router.post('/historical', async (req: Request, res: Response) => {
    //Obtener datos de la moneda
    const currencyList = req.body.currencyList;
    
    try {
        const db = getDb();
        const collection = db.collection('historical');

        const result = await collection.aggregate([
            { $match: { name: { $in: currencyList } } },
            { $sort: { date: -1 } },
            {
                $group: {
                    _id: '$name',
                    latestPrice: { $first: '$price' },
                    latestDate: { $first: '$date' },
                    price7D: {
                        $first: {
                            $cond: [
                                { $gte: [{ $subtract: [new Date(), '$date'] }, 7 * 24 * 60 * 60 * 1000] },
                                '$price',
                                null
                            ]
                        }
                    },
                    price30D: {
                        $first: {
                            $cond: [
                                { $gte: [{ $subtract: [new Date(), '$date'] }, 30 * 24 * 60 * 60 * 1000] },
                                '$price',
                                null
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    name: '$_id',
                    latestPrice: 1,
                    latestDate: 1,
                    price7D: 1,
                    price30D: 1,
                    diff7D: {
                        $cond: [
                            { $ifNull: ['$price7D', false] },
                            { $divide: [{ $subtract: ['$latestPrice', '$price7D'] }, '$price7D'] },
                            null
                        ]
                    },
                    diff30D: {
                        $cond: [
                            { $ifNull: ['$price30D', false] },
                            { $divide: [{ $subtract: ['$latestPrice', '$price30D'] }, '$price30D'] },
                            null
                        ]
                    }
                }
            }
        ]).toArray();

    
        if (result) {
            res.send(result);
        }
        else {
            res.status(404).send('Currency not found');
        }
        
    } catch (error) {
        res.status(500).send('Error getting currency');
    }});


//Obtener informacion de moneda (LIST)
router.post('/currency', async (req: Request, res: Response) => {
    //Obtener datos de la moneda
    const currencyList = req.body.currencyList;

    //Validar que se haya enviado la moneda
    if (!currencyList) {
        res.status(400).send('currencyList is required');
        return;
    }

    //Comunicarse con el servicio de base de datos, y realizar la consulta
    try {
        const db = getDb();
        const collection = db.collection('currencies');
        //find all currencies in the list (_id)
        const query = { _id: { $in: currencyList } };
        const result = await collection.find(query);
        if (result) {
            res.send(result);
        } else {
            res.status(404).send('Currency not found');
        }
    } catch (error) {
        res.status(500).send('Error getting currency');
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