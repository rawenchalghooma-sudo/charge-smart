// Importation de la bibliothèque jsonwebtoken
const jwt = require("jsonwebtoken");

// Fonction qui génère un token JWT pour un utilisateur connecté
const generateToken = (user) => {
  return jwt.sign(
    {
      // Données stockées dans le token
      id: user.id,
      role: user.role
    },

    // Clé secrète utilisée pour signer le token
    process.env.JWT_SECRET,

    {
      // Durée de validité du token
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

// Exportation de la fonction pour l’utiliser dans l’authentification
module.exports = generateToken;