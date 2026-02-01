# Music ConnectZ Authentication

## Features
- ✅ Email/Password Registration & Login
- ✅ Phone Number Login
- ✅ Forgot Password (6-digit code reset)
- ✅ Social Login (Google, Facebook, GitHub)
- ✅ Guest Mode

## Social Login Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Create a new app
3. Add Facebook Login product
4. In Settings > Basic, copy App ID and App Secret
5. In Facebook Login > Settings, add valid OAuth redirect URI: `http://localhost:3000/api/auth/facebook/callback`
6. Add to `.env`:
   ```
   FACEBOOK_APP_ID=your_app_id
   FACEBOOK_APP_SECRET=your_app_secret
   ```

### GitHub OAuth
1. Go to [GitHub Settings > Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Authorization callback URL: `http://localhost:3000/api/auth/github/callback`
4. Copy Client ID and generate Client Secret
5. Add to `.env`:
   ```
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
- `PORT` - Server port (default: 3000)
- `SESSION_SECRET` - Secret for session encryption (change in production!)

Optional variables:
- `STRIPE_SECRET_KEY` - For payment processing
- OAuth credentials for social login providers

## Running the App

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start backend server:
   ```bash
   npm start
   ```

3. Start frontend (in another terminal):
   ```bash
   python -m http.server 8000
   ```

4. Open browser: `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/register` - Register with email/password
- `POST /api/login` - Login with email/password
- `POST /api/login-phone` - Login with phone/password
- `POST /api/forgot-password` - Request password reset code
- `POST /api/reset-password` - Reset password with code

### OAuth
- `GET /api/auth/google` - Initiate Google login
- `GET /api/auth/google/callback` - Google callback
- `GET /api/auth/facebook` - Initiate Facebook login
- `GET /api/auth/facebook/callback` - Facebook callback
- `GET /api/auth/github` - Initiate GitHub login
- `GET /api/auth/github/callback` - GitHub callback

### Payment
- `POST /api/create-checkout-session` - Create Stripe checkout session

## Security Notes

- Passwords are hashed with bcrypt (12 rounds)
- Reset codes expire after 15 minutes
- Social login requires OAuth apps to be configured
- Change `SESSION_SECRET` in production
- Use HTTPS in production for OAuth callbacks
