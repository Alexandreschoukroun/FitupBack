// pages/api/coaches.js

import { hash } from 'bcrypt'; // Pour hasher le mot de passe
import prisma from '../../lib/prisma'; // Client Prisma

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, firstName, lastName, password } = req.body;

    try {
      // Vérifiez si un coach avec cet email existe déjà
      const existingCoach = await prisma.coach.findUnique({
        where: { email },
      });

      if (existingCoach) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      const hashedPassword = await hash(password, 10);

      const coach = await prisma.coach.create({
        data: {
          email,
          firstName,
          lastName,
          password: hashedPassword,
        },
      });

      res.status(201).json({ message: 'Coach inscrit avec succès', coach });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur du serveur' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
