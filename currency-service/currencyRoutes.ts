import express from 'express';
import CurrencyController from './currencyController';

const router = express.Router();

// Currency routes
router.get('/currency-list', CurrencyController.currencyList);
router.get('/currency/:id', CurrencyController.currencyDetail);
