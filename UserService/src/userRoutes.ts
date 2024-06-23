//Rutas para el servicio de usuarios
import express, { Request, Response } from 'express';
import { connectToDatabase, getDb } from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userStructure = {
    "email": "",
    "password": "",
    "tracking_list": [],
    "portfolio": []
}


const router = express.Router();

//Obtener toda la informacion de un usuario
router.get('/login', async (req: Request, res: Response) => {
    //Validar que se haya enviado el usuario
    if (!req.body.email) {
        res.status(400).send('Mail is required');
        return;
    }

    if (!req.body.password) {
        res.status(400).send('Password is required');
        return;
    }

    //Encyptar
    const email = req.body.email;
    const password = req.body.password;

    //Comunicarse con el servicio de base de datos, y realizar la consulta
    try {
        const db = getDb();
        const collection = db.collection('users');
        const query = { "email" : email };
        //Obtener json con los datos del usuario
        const result = await collection.findOne(query);
        if (result) {
            if (result.password !== password) {
                res.status(401).send('Invalid password');
                return;
            }
            const tracking_list = result.tracking_list;
            const portfolio = result.portfolio;
            console.log(new Date().toISOString(), "User logged in.")
            res.send({ "tracking_list": tracking_list, "portfolio": portfolio });
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).send('Error getting user');
    }
});

//Crear un usuario basado en un json
router.post('/register', async (req: Request, res: Response) => {    
    //Verificar que se haya enviado el correo
    if (!req.body.email) {
        res.status(400).send('User mail is required');
        return;
    }
    if (!req.body.password) {
        res.status(400).send('User password is required');
        return;
    }

    //Obtener datos del usuario
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password, 10);

    //Utilizar la plantilla json para crear el usuario
    const newUser = {...userStructure, email : email, password: password};
    
    //Añadir a la base de datos
    try {
        const db = getDb();
        const collection = db.collection('users');
        const result = await collection.insertOne(newUser);
        console.log(new Date().toISOString(), "User created.")
        res.send(result);
    }catch (error) {
        res.status(500).send('Error creating user');
    }
});

export default router;