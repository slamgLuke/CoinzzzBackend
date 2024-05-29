//Rutas para el servicio de usuarios

import express, { Request, Response } from 'express';
import { connectToDatabase, getDb } from './db';

const userStructure = {
    "email": "",
    "password": "",
    "tracking_list": [],
    "portfolio": []
}


const router = express.Router();

//Obtener toda la informacion de un usuario
router.get('/user', async (req: Request, res: Response) => {
    //Obtener datos del usuario
    const userId = req.body.userId;

    //Validar que se haya enviado el usuario
    if (!userId) {
        res.status(400).send('User is required');
        return;
    }

    //Comunicarse con el servicio de base de datos, y realizar la consulta
    try {
        const db = getDb();
        const collection = db.collection('users');
        const query = { userId: userId };
        //Obtener json con los datos del usuario
        const result = await collection.findOne(query);
        if (result) {
            res.send(result);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).send('Error getting user');
    }
});    

//Crear un usuario basado en un json
router.post('/user', async (req: Request, res: Response) => {
    //Obtener datos del usuario
    const user_mail = req.body.user_mail;
    const user_password = req.body.user_password; //TODO: encriptar
    
    //Verificar que se haya enviado el correo
    if (!user_mail) {
        res.status(400).send('User mail is required');
        return;
    }
    if (!user_password) {
        res.status(400).send('User password is required');
        return;
    }

    //Utilizar la plantilla json para crear el usuario
    const newUser = {...userStructure, email: user_mail, password: user_password};
    
    //Añadir a la base de datos
    try {
        const db = getDb();
        const collection = db.collection('users');
        const result = await collection.insertOne(newUser);
        res.send(result);
    }catch (error) {
        res.status(500).send('Error creating user');
    }
});
export default router;