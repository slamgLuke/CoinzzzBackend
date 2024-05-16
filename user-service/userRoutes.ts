import express from 'express';
import UserController from './userController';

const router = express.Router();

// Auth
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Tracking list
router.get('/tracking-list/:id', UserController.trackingList);
router.post('/tracking', UserController.trackingAdd);
router.delete('/tracking', UserController.trackingDelete);

// Portfolio Networth
router.get('/portfolio-net/:id', UserController.portfolioNet);

// Portfolio Transaction
router.get('/portfolio-transaction-list/:id', UserController.portfolio);
router.post('/portfolio-transaction', UserController.portfolioAdd);
router.put('/portfolio-transaction', UserController.portfolioUpdate);
router.delete('/portfolio-transaction', UserController.portfolioDelete);

export default router;
