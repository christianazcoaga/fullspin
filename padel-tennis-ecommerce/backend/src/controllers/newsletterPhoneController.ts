import { Request, Response } from 'express';
import NewsletterPhoneSubscriber from '../models/NewsletterPhoneSubscriber';

export const subscribePhoneToNewsletter = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    // Validar que el teléfono esté presente
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'El número de teléfono es requerido'
      });
    }

    // Validar formato del teléfono (solo números, mínimo 10 dígitos)
    const phoneRegex = /^\d{10,20}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'El número de teléfono debe tener entre 10 y 20 dígitos'
      });
    }

    // Limpiar el teléfono (remover espacios y caracteres especiales)
    const cleanPhone = phone.replace(/\s/g, '');

    // Verificar si ya existe
    const existingSubscriber = await NewsletterPhoneSubscriber.findOne({
      where: { phone: cleanPhone }
    });

    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        return res.status(400).json({
          success: false,
          message: 'Este número ya está suscrito al newsletter'
        });
      } else {
        // Reactivar suscripción
        await existingSubscriber.update({ is_active: true });
        return res.status(200).json({
          success: true,
          message: 'Suscripción reactivada exitosamente'
        });
      }
    }

    // Crear nueva suscripción
    await NewsletterPhoneSubscriber.create({
      phone: cleanPhone,
      is_active: true
    });

    res.status(201).json({
      success: true,
      message: 'Suscripción por teléfono exitosa'
    });

  } catch (error) {
    console.error('Error al suscribir por teléfono:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const unsubscribePhoneFromNewsletter = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'El número de teléfono es requerido'
      });
    }

    const cleanPhone = phone.replace(/\s/g, '');

    const subscriber = await NewsletterPhoneSubscriber.findOne({
      where: { phone: cleanPhone }
    });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Suscripción no encontrada'
      });
    }

    await subscriber.update({ is_active: false });

    res.status(200).json({
      success: true,
      message: 'Desuscripción exitosa'
    });

  } catch (error) {
    console.error('Error al desuscribir por teléfono:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getAllPhoneSubscribers = async (req: Request, res: Response) => {
  try {
    const subscribers = await NewsletterPhoneSubscriber.findAll({
      where: { is_active: true },
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: subscribers
    });

  } catch (error) {
    console.error('Error al obtener suscriptores por teléfono:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}; 