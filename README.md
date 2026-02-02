# Music ConnectZ v7

Music ConnectZ connects talented musicians worldwide. Build your portfolio, showcase skills, collaborate on projects, and network with fellow artists.

## Features

### Core Features
- **Artist Profiles**: Create profiles with skills, experience levels, and portfolio
- **Work Portfolio**: Upload and showcase completed projects with playback
- **Skill Management**: Define your musical skills with custom icons and proficiency levels
- **Collaboration Requests**: Send and receive collaboration proposals
- **Real-time Messaging**: Instant messaging with collaborators (Premium)
- **Advanced Discovery**: Search and filter artists by location, skills, and availability

### Premium Membership
Unlock advanced features with Music ConnectZ Premium:
- **Direct Messaging**: Real-time chat with other musicians
- **Advanced Filters**: Search by distance radius, skill proficiency, availability, and more
- **Portfolio Uploads**: Upload and manage multiple work samples
- **Featured Artist Badge**: Get highlighted in discovery feeds
- **Analytics Dashboard**: Track profile views, message activity, and collaboration trends
- **Custom Themes**: Personalize your profile with theme colors
- **Custom Skill Icons**: Upload custom images for your musical skills

## Tech Stack

**Backend**
- Node.js & Express.js
- Socket.IO for real-time messaging
- Stripe for payment processing
- Passport.js for OAuth (Google, Facebook, GitHub)

**Frontend**
- HTML5, CSS3, JavaScript (Single-Page Application)
- Socket.IO Client
- Google Maps API for location-based features
- Stripe.js for checkout

**Database**
- JSON file-based storage (users, messages, collaborations)

**Deployment**
- Render Web Service (Node.js runtime)
- Render PostgreSQL (optional, for production scaling)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/music-connectz.git
   cd music-connectz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file** (.env)
   ```
   NODE_ENV=development
   PORT=3000
   DOMAIN=http://localhost:3000
   SESSION_SECRET=your-secret-key-here
   
   # Stripe
   STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   # Google OAuth
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   
   # Facebook OAuth
   FACEBOOK_APP_ID=...
   FACEBOOK_APP_SECRET=...
   
   # GitHub OAuth
   GITHUB_CLIENT_ID=...
   GITHUB_CLIENT_SECRET=...
   
   # Google Maps
   GOOGLE_MAPS_API_KEY=...
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   Server runs on `http://localhost:3000`

## Development

### Running in Development Mode
```bash
npm start
```

### Key Endpoints

**Authentication**
- `POST /auth/signup` - Create account with email
- `GET /auth/google` - Google OAuth login
- `GET /auth/facebook` - Facebook OAuth login
- `GET /auth/github` - GitHub OAuth login
- `POST /auth/login` - Email/password login

**User Management**
- `GET /api/profile/:userId` - Get artist profile
- `PUT /api/profile` - Update own profile
- `GET /api/user-data` - Get current user data

**Collaborations**
- `GET /api/collaborations` - List all collaborations
- `POST /api/collaborations` - Create collaboration request
- `PUT /api/collaborations/:id` - Update collaboration
- `DELETE /api/collaborations/:id` - Delete collaboration

**Messaging** (Premium)
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message
- Socket.IO: `message` event for real-time chat

**Membership**
- `GET /api/membership` - Get current membership status
- `POST /api/membership/checkout` - Create Stripe checkout
- `POST /webhooks/stripe` - Stripe webhook handler

## Deployment to Render

1. **Create Render account** at [render.com](https://render.com)

2. **Create new Web Service**
   - Connect your GitHub repository
   - Select the `main` branch
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Set Environment Variables** in Render dashboard:
   - Copy all environment variables from .env
   - Paste into Render environment variables section

4. **Deploy**
   - Render will automatically deploy on git push
   - Service available at `https://your-service-name.onrender.com`

### render.yaml
The `render.yaml` file in the root directory contains deployment configuration. Render reads this automatically.

## Premium Features Implementation

### Server-Side Gating
All premium features are enforced server-side:
- Messaging checks: `isPremiumUser()` validation
- Collaboration limits: Premium users get higher request limits
- Featured status: Server-side status flag

### Premium Bypass
Special email addresses (e.g., `ctkoth@gmail.com`) receive automatic premium access on signup/login.

## Architecture

### Client-Side (index.html)
- Single-page application (SPA)
- Modular UI sections: Dashboard, Profile, Discover, Works, Collaborations, Messages
- Real-time Socket.IO event listeners
- Premium gating in UI
- Local storage for app state (skill icons, cache)

### Server-Side (server.js)
- Express API for all business logic
- Socket.IO namespace for real-time messaging
- Stripe integration for payments
- OAuth passport strategies
- JSON file persistence layer
- Premium user validation helpers

### Data Structure
- **users.json**: User accounts, profiles, authentication
- **messages.json**: Direct messages between users
- **collabs.json**: Collaboration requests and active collaborations
- **appState**: In-memory cache + localStorage for UI state

## Premium Tier Details

| Feature | Free | Premium |
|---------|------|---------|
| Profile Creation | ✓ | ✓ |
| Skill Definition | ✓ | ✓ |
| Work Portfolio | Up to 3 | Unlimited |
| Direct Messaging | ✗ | ✓ |
| Advanced Filters | ✗ | ✓ |
| Featured Badge | ✗ | ✓ |
| Analytics | ✗ | ✓ |
| Custom Themes | ✗ | ✓ |
| Custom Skill Icons | ✗ | ✓ |
| Collab Requests | 3/month | Unlimited |

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Socket.IO Connection Issues
Ensure `DOMAIN` environment variable matches your deployment URL (localhost:3000 for local, your Render URL for production).

### Stripe Webhook Failures
Verify webhook secret in Stripe dashboard and .env file match exactly.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally
4. Commit with descriptive messages
5. Push and create a pull request

## Support

For issues, feature requests, or questions, please create an issue in the GitHub repository.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Author

Created by K-Oth | [GitHub](https://github.com/ctkoth)

---

**Current Version**: 7 (bi K-Oth)  
**Last Updated**: February 2026
