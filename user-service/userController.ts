import { Request, Response } from 'express';
import User, { IUser } from './userModel';

class UserController {

    // register
    public async register(req: Request, res: Response) {
        try {
            const user: IUser = new User(req.body);
            await user.save();
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // login
    public async login(req: Request, res: Response) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

}


export default UserController;
