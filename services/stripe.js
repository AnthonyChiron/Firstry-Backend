const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/payment");

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

module.exports.confirmPaymentIntent = async function (paymentIntentId) {
  try {
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
    // Mise à jour de l'état du paiement dans votre base de données, si nécessaire
    // Par exemple, enregistrer le paiement comme 'succeeded'
    await Payment.findOneAndUpdate(
      { paymentIntentId },
      { paymentState: paymentIntent.status }
    );

    console.log("Paiement confirmé avec succès");
  } catch (error) {
    console.error("Erreur lors de la confirmation du paiement", error);
  }
};

module.exports.refusePaymentIntent = async function (paymentIntentId) {
  try {
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
    // Mise à jour de l'état du paiement dans votre base de données, si nécessaire
    // Par exemple, enregistrer le paiement comme 'canceled'
    await Payment.findOneAndUpdate(
      { paymentIntentId },
      { paymentState: paymentIntent.status }
    );

    console.log("Paiement refusé avec succès");
  } catch (error) {
    console.error("Erreur lors du refus du paiement", error);
  }
};
