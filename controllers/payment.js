const { validate, Payment } = require("../models/payment");
const CRUDController = require("./CRUD");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { checkStripeAccountValidity } = require("../services/stripe");
const { Registration } = require("../models/registration");
const { registrationState } = require("../constants/registrationEnum");

module.exports = class PaymentsController extends CRUDController {
  name = "payments";
  model = Payment;
  validate = validate;

  createRegistrationPayment = async (req, res) => {
    const { amount, user, organizer, categoryId } = req.body; // Assurez-vous de valider et de nettoyer cet input

    const feeAmount = Math.floor(amount * 0.05) + 25;

    try {
      // CREATE PAYMENT
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // Le montant en centimes
        currency: "eur", // ou la devise de votre choix
        receipt_email: user.email,
        application_fee_amount: feeAmount, // Frais d'application
        transfer_data: {
          destination: organizer.stripeAccountId, // ID du compte Stripe de l'organisateur
        },
        // Utilisez capture_method pour indiquer que la capture sera effectuée plus tard
        capture_method: "manual",
      });

      console.log(paymentIntent);

      // Créez un document Payment dans votre base de données
      const payment = new Payment({
        userId: user._id,
        amount: amount,
        paymentIntentId: paymentIntent.id,
        paymentState: paymentIntent.status,
        stripeAccountId: organizer.stripeAccountId,
      });

      await payment.save();

      console.log(payment);

      // Créez un document Registration dans votre base de données
      const registration = new Registration({
        rider: user.rider._id,
        category: categoryId,
        state: registrationState.PENDING_PAYMENT,
        paymentId: payment._id,
      });

      await registration.save();

      res.send({
        registration: registration,
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
        refresh_url: "https://firstry.fr/account",
        return_url: "https://firstry.fr/account",
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
        redirect_url: "https://firstry.fr/account", // URL optionnelle de redirection après la déconnexion
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
