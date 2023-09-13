const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "305938669830-au1p4mc48fj96l3g1um4kngh7bnk26h9.apps.googleusercontent.com"
);

app.post("/api/auth/google", async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience:
      "305938669830-au1p4mc48fj96l3g1um4kngh7bnk26h9.apps.googleusercontent.com",
  });
  const payload = ticket.getPayload();

  // À ce stade, vous avez accès aux informations de l'utilisateur. Vous pouvez maintenant
  // les utiliser pour créer ou récupérer un compte dans votre base de données.
  // Envoyez également un JWT personnalisé si nécessaire.

  res.send({
    /* réponse */
  });
});
