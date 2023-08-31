const express = require("express");

const mongooseConnexion = require("./config/db");
const config = require("config");
const helmet = require("helmet");
const app = express();

app.use(helmet());
app.use(express.json());

// ROUTES
const riders = require("./routes/riders");
const contests = require("./routes/contests");

app.use("/api/riders", riders);
app.use("/api/contests", contests);

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is on port ${port}!`));
