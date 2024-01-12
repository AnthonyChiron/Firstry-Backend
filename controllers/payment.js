const { validate, Payment } = require("../models/payment");
const CRUDController = require("./CRUD");
const stripe = require("stripe")(
  "sk_test_51OPhx3ExeV2TEn3koFSQVt3FZFYFFWwPu9U2RC1yrrfA5mXZ5IUdEcwsJnUfPoLPQzlwcLK1aZa9nBLVToh9dYB80053sqNZdH"
);
const { checkStripeAccountValidity } = require("../services/stripe");

module.exports = class PaymentsController extends CRUDController {
  name = "payments";
  model = Payment;
  validate = validate;

  createPayment = async (req, res) => {
    const { amount, user } = req.body; // Assurez-vous de valider et de nettoyer cet input

    console.log(req.body);
    try {
      console.log(user.stripeAccountId);
      console.log(Math.floor(amount * 0.04));
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // Le montant en centimes
        currency: "eur", // ou la devise de votre choix
        receipt_email: user.email,
        application_fee_amount: Math.floor(amount * 0.04), // Frais d'application
        transfer_data: {
          destination: user.organizer.stripeAccountId, // ID du compte Stripe de l'organisateur
        },
      });

      console.log(paymentIntent);

      // Créez un document Payment dans votre base de données
      const payment = new Payment({
        userId: user._id,
        amount: amount,
        paymentIntentId: paymentIntent.id,
        paymentState: paymentIntent.status,
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: error.message });
    }
  };

  createOnboardingLink = async (req, res) => {
    try {
      console.log(req.params.accountId);
      const accountLink = await stripe.accountLinks.create({
        account: req.params.accountId,
        refresh_url: "http://localhost:4200/account",
        return_url: "http://localhost:4200/account",
        type: "account_onboarding",
      });
      console.log(accountLink);
      res.send(accountLink);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  };

  createLoginLink = async (req, res) => {
    try {
      const accountId = req.params.accountId;

      const loginLink = await stripe.accounts.createLoginLink(accountId, {
        redirect_url: "http://localhost:4200/account", // URL optionnelle de redirection après la déconnexion
      });

      res.send(loginLink);
    } catch (error) {
      console.error(
        "Erreur lors de la création du lien du Dashboard Stripe:",
        error
      );
      res.status(500).send("Erreur lors de la création du lien");
    }
  };

  isStripeAccountUsable = async (req, res) => {
    res.send(await checkStripeAccountValidity(req.params.accountId));
  };
};
