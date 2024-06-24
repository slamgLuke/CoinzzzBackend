//Rutas para el servicio de usuarios
import express, { Request, Response } from 'express';
import { getDb } from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userStructure = {
    "email": "",
    "password": "",
    "tracking_list": [],
    "portfolio": []
}

const  JWT_SECRET = 'zzznioc';
const router = express.Router();

//Obtener toda la informacion de un usuario
router.post('/login', async (req: Request, res: Response) => {

    console.log("Login request received.")
    if (!req.body.email) {
        res.status(400).send('User mail is required');
        return;
    }
    if (!req.body.password) {
        res.status(400).send('User password is required');
        return;
    }



    try {
        const db = getDb();
        const collection = db.collection('users');

        // Buscar usuario por email
        const user = await collection.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Email or password is wrong');

        // Verificar contraseña
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send('Email or password is wrong');

        console.log(new Date().toISOString(), "User login.")
        // Crear y asignar token JWT
        const token = jwt.sign({ _id: user._id }, JWT_SECRET);
        console.log(new Date().toISOString(), "Token created.", token)
        res.header('Authorization', token).send({token});
    } catch (error) {
        res.status(500).send('Error logging in');
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