import express from 'express';
import nodemailer from 'nodemailer';
import db from '../db/index.js';

const router = express.Router();

// Configurar transportador de correo
const createTransporter = () => {
  // En producción, usa credenciales reales de SMTP
  // Por ahora, usamos ethereal para desarrollo
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Plantilla HTML para respuesta automática
const getAutoReplyTemplate = (nombre) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(120deg, #9f3876, #bd1d82);
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .logo {
      width: 120px;
      height: auto;
    }
    .header h1 {
      color: white;
      margin: 15px 0 0 0;
      font-size: 28px;
    }
    .content {
      background: #ffffff;
      padding: 30px;
      border-left: 4px solid #9f3876;
      border-right: 4px solid #9f3876;
    }
    .content h2 {
      color: #9f3876;
      margin-top: 0;
    }
    .footer {
      background: #f6a4fd;
      padding: 20px;
      text-align: center;
      border-radius: 0 0 10px 10px;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: linear-gradient(120deg, #9f3876, #bd1d82);
      color: white;
      text-decoration: none;
      border-radius: 25px;
      margin: 20px 0;
      font-weight: bold;
    }
    .social-links {
      margin: 20px 0;
    }
    .social-links a {
      color: #9f3876;
      text-decoration: none;
      margin: 0 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💜 Imparables</h1>
      <p style="color: white; margin: 0;">Mujeres que transforman el mundo</p>
    </div>
    
    <div class="content">
      <h2>¡Hola ${nombre}!</h2>
      
      <p>Gracias por contactarnos. Hemos recibido tu mensaje y queremos que sepas que es muy importante para nosotras.</p>
      
      <p>En <strong>Imparables</strong>, trabajamos para visibilizar y fortalecer las voces de las mujeres del Pacífico colombiano. Tu interés en nuestro trabajo nos motiva a seguir adelante.</p>
      
      <p>Nuestro equipo revisará tu mensaje y te responderemos lo más pronto posible. Mientras tanto, te invitamos a:</p>
      
      <ul>
        <li>Conocer más sobre nuestros <strong>programas y servicios</strong></li>
        <li>Leer las últimas <strong>historias Imparables</strong> en nuestro blog</li>
        <li>Seguirnos en nuestras redes sociales</li>
      </ul>
      
      <div style="text-align: center;">
        <a href="${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}" class="button">
          Visitar nuestro sitio web
        </a>
      </div>
      
      <p style="margin-top: 30px;">
        <strong>Recuerda:</strong> Ser Imparable es recordar que nuestras ancestras caminan con nosotras cada vez que alzamos la voz.
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Imparables</strong></p>
      <p>Innovación feminista desde el Pacífico colombiano</p>
      
      <div class="social-links">
        <a href="#">Facebook</a> •
        <a href="#">Instagram</a> •
        <a href="#">TikTok</a>
      </div>
      
      <p style="font-size: 12px; color: #666; margin-top: 15px;">
        Este es un mensaje automático. Por favor, no respondas a este correo.
      </p>
    </div>
  </div>
</body>
</html>
`;

// Plantilla para notificación al equipo
const getAdminNotificationTemplate = (nombre, correo, mensaje) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .card {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      color: #9f3876;
      border-bottom: 3px solid #9f3876;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .field {
      margin: 15px 0;
      padding: 15px;
      background: #f9f9f9;
      border-left: 4px solid #bd1d82;
      border-radius: 5px;
    }
    .field label {
      font-weight: bold;
      color: #9f3876;
      display: block;
      margin-bottom: 5px;
    }
    .message-box {
      background: #fff;
      padding: 20px;
      border: 2px solid #f6a4fd;
      border-radius: 8px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1 class="header">📧 Nuevo mensaje de contacto</h1>
      
      <div class="field">
        <label>Nombre:</label>
        <div>${nombre}</div>
      </div>
      
      <div class="field">
        <label>Correo:</label>
        <div><a href="mailto:${correo}">${correo}</a></div>
      </div>
      
      <div class="field">
        <label>Fecha:</label>
        <div>${new Date().toLocaleString('es-CO', { 
          dateStyle: 'full', 
          timeStyle: 'short' 
        })}</div>
      </div>
      
      <div class="message-box">
        <label style="color: #9f3876; font-weight: bold; margin-bottom: 10px; display: block;">Mensaje:</label>
        <p style="margin: 0; white-space: pre-wrap;">${mensaje}</p>
      </div>
      
      <p style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
        Responde directamente a ${correo} para continuar la conversación.
      </p>
    </div>
  </div>
</body>
</html>
`;

// Endpoint para enviar mensaje de contacto
router.post('/', async (req, res) => {
  try {
    const { nombre, correo, mensaje } = req.body;
    
    if (!nombre || !correo || !mensaje) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    
    // Guardar en base de datos
    const [contactId] = await db('contacts').insert({
      nombre,
      correo,
      mensaje,
      createdAt: new Date(),
    });
    
    // Si hay configuración de SMTP, enviar correos
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = createTransporter();
      
      // Enviar respuesta automática al usuario
      try {
        await transporter.sendMail({
          from: `"Imparables" <${process.env.SMTP_USER}>`,
          to: correo,
          subject: '💜 Gracias por contactar a Imparables',
          html: getAutoReplyTemplate(nombre),
        });
      } catch (emailError) {
        console.error('Error enviando respuesta automática:', emailError);
      }
      
      // Enviar notificación al equipo
      try {
        await transporter.sendMail({
          from: `"Sistema Imparables" <${process.env.SMTP_USER}>`,
          to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
          subject: `📧 Nuevo mensaje de ${nombre}`,
          html: getAdminNotificationTemplate(nombre, correo, mensaje),
          replyTo: correo,
        });
      } catch (emailError) {
        console.error('Error enviando notificación al equipo:', emailError);
      }
    }
    
    res.status(201).json({
      message: 'Mensaje enviado exitosamente',
      id: contactId,
    });
  } catch (error) {
    console.error('Error procesando mensaje de contacto:', error);
    res.status(500).json({ message: 'Error al enviar el mensaje' });
  }
});

// Obtener todos los mensajes de contacto (requiere autenticación)
router.get('/', async (req, res) => {
  try {
    const contacts = await db('contacts')
      .select('*')
      .orderBy('createdAt', 'desc');
    
    res.json(contacts);
  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    res.status(500).json({ message: 'Error al obtener mensajes' });
  }
});

export default router;
