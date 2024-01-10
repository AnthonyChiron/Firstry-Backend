const { validate, Payment } = require("../models/payment");
const CRUDController = require("./CRUD");
const stripe = require("stripe")(
  "sk_test_51OPhx3ExeV2TEn3koFSQVt3FZFYFFWwPu9U2RC1yrrfA5mXZ5IUdEcwsJnUfPoLPQzlwcLK1aZa9nBLVToh9dYB80053sqNZdH"
);

module.exports = class PaymentsController extends CRUDController {
  name = "payments";
  model = Payment;
  validate = validate;

  createPayment = async (req, res) => {
    const { amount, user } = req.body; // Assurez-vous de valider et de nettoyer cet input

    console.log(req.body);
    try {
      const paymentIntent = await stripe.paymentIntents.create(
        {
          amount: amount, // Le montant en centimes
          currency: "eur", // ou la devise de votre choix
          receipt_email: user.email,
          application_fee_amount: amount * 0.04,
        },
        {
          stripeAccount: user.stripeAccountId,
        }
      );

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

  createLoginLink = async (req, res) => {
    console.log(req.params.id);
    try {
      const accountLink = await stripe.accountLinks.create({
        account: req.params.id,
        refresh_url: "https://votre-site.com/reauth",
        return_url: "https://votre-site.com/return",
        type: "account_onboarding",
      });
      console.log(accountLink);
      res.send(accountLink);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
};
