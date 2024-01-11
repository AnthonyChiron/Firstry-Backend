const stripe = require("stripe")(
  "sk_test_51OPhx3ExeV2TEn3koFSQVt3FZFYFFWwPu9U2RC1yrrfA5mXZ5IUdEcwsJnUfPoLPQzlwcLK1aZa9nBLVToh9dYB80053sqNZdH"
);

module.exports.checkStripeAccountValidity = async function (stripeAccountId) {
  try {
    const account = await stripe.accounts.retrieve(stripeAccountId);

    // Vérifie si le compte est en mesure de recevoir des paiements
    const isAccountUsable =
      account.charges_enabled && account.details_submitted;

    return isAccountUsable;
  } catch (error) {
    console.error("Erreur lors de la vérification du compte Stripe:", error);
    res.status(500).send("Erreur lors de la vérification du compte");
  }
};
