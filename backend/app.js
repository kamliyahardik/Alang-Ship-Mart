//const express = require('express');
const bodyParser = require('body-parser');

const { getStoredItems, storeItems } = require('./data/items');

// const app = express();

// app.use(bodyParser.json());

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

// app.get('/items', async (req, res) => {
//   const storedItems = await getStoredItems();
//   await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));
//   res.json({ items: storedItems });
// });

// app.get('/items/:id', async (req, res) => {
//   const storedItems = await getStoredItems();
//   const item = storedItems.find((item) => item.id === req.params.id);
//   res.json({ item })
// });

// app.post('/items', async (req, res) => {
//   const existingItems = await getStoredItems();
//   const itemData = req.body;
//   const newItem = {
//     ...itemData,
//     id: Math.random().toString(),
//   };
//   const updatedItems = [newItem, ...existingItems];
//   await storeItems(updatedItems);
//   res.status(201).json({ message: 'Stored new item.', item: newItem });
// });

// app.listen(8080);
const express = require("express");
const Collections = require("./mongo");
const Google = require("./googleschema")
//const Tokens = require("./Token");
const cors = require("cors");
const app = express();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const passport = require("passport");
const session = require("express-session");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;

const clientId = "1015432761670-fc3dv7bkhsl28nqfha2t8ah81q4ehgca.apps.googleusercontent.com";
const clientsecret = "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";

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors({ origin: "http://localhost:5173/" }));
app.use(session({
  secret: "7046590933bhavadip",
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session())

passport.use(new OAuth2Strategy({
  clientID: clientId,
  clientSecret: clientsecret,
  callbackURL: "/auth/google/callback",
  scope: ["profile", "email"]
}, async (accessToken, refreshToken, profile, done) => {
  console.log("profile", profile);
  try {
    let user = await Google.findOne({ googleId: profile.id });

    if (!user) {
      user = new Google({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        image: profile.photos[0].value
      });

      await user.save();
    }

    return done(null, user)
  } catch (error) {
    return done(error, null)
  }
}))

passport.serializeUser((user, done) => {
  done(null, user);
})

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: "http://localhost:5173/home",
  failureRedirect: "http://localhost:5173/"
}))

// Function to generate unique 8-character alphanumeric ID
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

// Function to generate unique user ID
async function generateUniqueUserId() {
  let userId = generateUniqueId();
  while (await Collections.exists({ userId })) {
    userId = generateUniqueId();
  }
  return userId;
}


async function sendConfirmationEmail(email, userId) {
  try {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "paliwalbhai503@gmail.com",
        pass: "bhai@2004",
      }
    })
    await transporter.sendMail({
      from: "paliwalbhai503@gmail.com", // Your Gmail email address
      to: email,
      subject: "Account Confirmation",
      html: `<p>Your user ID is: ${userId} Click me</p>`,
    });
    console.log("Confirmation email sent to:", email);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
}


//For the login page
app.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Collections.findOne({ email });
    const googleuser = await Google.findOne({ email });
    if (!user && !googleuser) {
      return res.json("notexist");
    }
    // Check if the provided password matches the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json("notexist");
    }
    // If both email and password are correct, respond with "exist"
    console.log("Email and password are correct");
    res.json("exist");
  } catch (error) {
    // Handle any errors that occur during the database operation
    console.error("Error:", error);
    res.status(500).json("Error occurred");
  }
});

app.get('/items', async (req, res) => {
  const storedItems = await getStoredItems();
  await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));
  res.json({ items: storedItems });
});

app.get('/items/:id', async (req, res) => {
  const storedItems = await getStoredItems();
  const item = storedItems.find((item) => item.id === req.params.id);
  res.json({ item })
});

app.post('/items', async (req, res) => {
  const existingItems = await getStoredItems();
  const itemData = req.body;
  const newItem = {
    ...itemData,
    id: Math.random().toString(),
  };
  const updatedItems = [newItem, ...existingItems];
  await storeItems(updatedItems);
  res.status(201).json({ message: 'Stored new item.', item: newItem });
});



app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userId = await generateUniqueUserId();
    console.log("Generated userId:", userId);

    let user = await Collections.findOne({ email });
    if (user) {
      return res.json("exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new Collections({ email, password: hashedPassword, userId });
    await user.save();
    await sendConfirmationEmail(email, userId);
    console.log("User registered successfully");
    res.json("notexist");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json("Error occurred");
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8000");
});
