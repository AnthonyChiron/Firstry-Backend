const { Payment } = require("../models/payment");

// Importez le package Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Votre clé secrète de webhook Stripe

// Fonction de gestion du webhook
exports.handler = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    // Vérifiez la signature du webhook pour vous assurer qu'il est valide et provient de Stripe
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    // En cas d'erreur (par exemple, signature non valide), retournez une réponse d'erreur
    console.log(`⚠️  Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const paymentIntent = event.data.object;

  // Find Payment by paymentIntentId
  const payment = await Payment.findOne({
    paymentIntentId: paymentIntent.id,
  });

  // Update Payment
  payment.paymentState = paymentIntent.status;
  await payment.save();

  // Gérez les différents types d'événements Stripe
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      // Logique à exécuter lorsque le paiement est réussi
      console.log(
        `Paiement réussi pour l'intention de paiement: ${paymentIntent.id}`
      );

      break;
    // Ajoutez des cas supplémentaires pour d'autres événements si nécessaire
    case "payment_intent.failed":
      break;
    default:
      console.log(`Événement Stripe non géré de type: ${event.type}`);
  }

  // Retournez une réponse de succès à Stripe
  res.status(200).json({ received: true });
};
