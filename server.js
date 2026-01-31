import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const domain = process.env.DOMAIN || `http://localhost:${port}`;
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const usersFile = process.env.USERS_FILE || path.join(process.cwd(), 'users.json');

const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

if (!stripe) {
  console.warn('⚠️ STRIPE_SECRET_KEY is missing. Stripe checkout will be disabled.');
}

// Middleware
app.use(cors({ origin: '*', credentials: false }));
app.use(express.json());

const readUsers = async () => {
  try {
    const raw = await fs.readFile(usersFile, 'utf8');
    const users = JSON.parse(raw);
    return Array.isArray(users) ? users : [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

const writeUsers = async (users) => {
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2), 'utf8');
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'healthy', time: new Date().toISOString() });
});

// Register with password
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, username } = req.body || {};
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      return res.status(400).json({ error: 'Email required' });
    }
    if (!password || String(password).length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const users = await readUsers();
    const existing = users.find((user) => user.email === normalizedEmail);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(String(password), 12);
    const newUser = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      username: username ? String(username).trim() : '',
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeUsers(users);

    res.status(201).json({ ok: true, user: { id: newUser.id, email: newUser.email, username: newUser.username } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login with password
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const users = await readUsers();
    const user = users.find((u) => u.email === normalizedEmail);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(String(password), user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ ok: true, user: { id: user.id, email: user.email, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create checkout session
app.post('/api/create-checkout', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe is not configured' });
  }

  try {
    const { amount, description, taxMode, customerEmail } = req.body || {};

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    if (!description) {
      return res.status(400).json({ error: 'Description required' });
    }

    const sessionConfig = {
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: description },
            unit_amount: Math.round(Number(amount) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/cancel`,
    };

    if (taxMode === 'automatic') {
      sessionConfig.automatic_tax = { enabled: true };
      sessionConfig.customer_update = { address: 'auto' };
    }

    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({ url: session.url, sessionId: session.id, message: 'Checkout session created' });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Basic success/cancel placeholders
app.get('/success', (req, res) => {
  res.send('<h2>Payment successful 🎉</h2>');
});

app.get('/cancel', (req, res) => {
  res.send('<h2>Payment canceled. Try again.</h2>');
});

app.listen(port, () => {
  console.log(`✅ Server running at ${domain}`);
});
