const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
