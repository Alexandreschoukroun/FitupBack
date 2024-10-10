import prisma from '../../lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe dans la table des utilisateurs
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Vérifier si l'utilisateur existe dans la table des coachs
    const coach = await prisma.coach.findUnique({
      where: { email },
    });

    if (user) {
      // Vérifier le mot de passe pour les utilisateurs
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        // On pourrait ajouter des données utilisateur supplémentaires si besoin
        res.status(200).json({ message: 'Connexion réussie', user, role: 'user' });
      } else {
        res.status(401).json({ message: 'Mot de passe incorrect' });
      }
    } else if (coach) {
      // Vérifier le mot de passe pour les coachs
      const isPasswordValid = await bcrypt.compare(password, coach.password);
      if (isPasswordValid) {
        // On pourrait ajouter des données coach supplémentaires si besoin
        res.status(200).json({ message: 'Connexion réussie', coach, role: 'coach' });
      } else {
        res.status(401).json({ message: 'Mot de passe incorrect' });
      }
    } else {
      res.status(404).json({ message: 'Utilisateur ou coach non trouvé' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
