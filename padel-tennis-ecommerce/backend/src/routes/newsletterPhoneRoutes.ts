import express from 'express';
import {
  subscribePhoneToNewsletter,
  unsubscribePhoneFromNewsletter,
  getAllPhoneSubscribers
} from '../controllers/newsletterPhoneController';

const router = express.Router();

// Suscribir por teléfono
router.post('/subscribe', subscribePhoneToNewsletter);

// Desuscribir por teléfono
router.post('/unsubscribe', unsubscribePhoneFromNewsletter);

// Obtener todos los suscriptores por teléfono (admin)
router.get('/subscribers', getAllPhoneSubscribers);

export default router; 