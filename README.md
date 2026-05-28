# Snapfeed Ultra

Enterprise-grade real-time social communication platform inspired by Facebook Messenger, Snapchat, and Instagram.

## Features

- **Real-time Messaging** – Instant chat with socket.io, typing indicators, read receipts, delivery status
- **Video/Audio Calling** – WebRTC peer-to-peer calls with STUN/TURN, mute, camera toggle, fullscreen
- **Authentication** – JWT-based signup/login, refresh tokens, password strength meter, email validation
- **Stories** – 24-hour disappearing stories with view tracking
- **Presence** – Online/offline status, last seen
- **Notifications** – In-app notification stack
- **Dark/Light Mode** – Theme toggle with smooth transitions
- **Responsive UI** – Mobile-first, glassmorphism design with TailwindCSS + Framer Motion

## Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | React 18, Vite, TailwindCSS, Framer Motion, Zustand, Lucide Icons |
| Backend  | Node.js, Express, Socket.io, JWT, bcryptjs  |
| Database | MongoDB + Mongoose                          |
| Realtime | Socket.io, WebRTC, STUN/TURN                |

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url> snapfeed-ultra
cd snapfeed-ultra

# Install all dependencies
npm run install:all

# Or manually:
cd server && npm install
cd ../client && npm install
cd ..
```

### 2. Configure environment

```bash
cp server/.env server/.env.local
# Edit server/.env.local with your MongoDB URI and secrets
```

### 3. Seed database

```bash
npm run seed
```

This creates 4 demo users:
| Name           | Email                | Password    |
|----------------|---------------------|-------------|
| Alex Snapfeed  | alex@snapfeed.com   | password123 |
| Sam Wilson     | sam@snapfeed.com    | password123 |
| Jordan Lee     | jordan@snapfeed.com | password123 |
| Demo User      | demo@snapfeed.com   | demo123456  |

### 4. Start development

```bash
npm run dev
```

This starts both server (port 5000) and client (port 5173) concurrently via `concurrently`.

Or start separately:

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

### 5. Open the app

```
http://localhost:5173
```

## Project Structure

```
snapfeed-ultra/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── auth/          # Login/Signup forms
│   │   │   ├── chat/          # Chat bubbles, input
│   │   │   ├── layout/        # TopBar, Sidebar, AppLayout
│   │   │   ├── stories/       # Story viewer
│   │   │   ├── ui/            # Modal, Loading, Notifications
│   │   │   └── video/         # Video call controls
│   │   ├── pages/             # Route pages
│   │   ├── store/             # Zustand stores
│   │   ├── hooks/             # Custom hooks
│   │   ├── context/           # AuthContext
│   │   ├── services/          # API client (axios)
│   │   ├── socket/            # Socket.io client
│   │   ├── utils/             # Helpers & constants
│   │   └── styles/            # Global CSS
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                    # Express backend
│   ├── controllers/           # Route handlers
│   ├── models/                # Mongoose schemas
│   ├── routes/                # Express routes
│   ├── middleware/             # Auth, validation, upload
│   ├── socket/                # Socket.io event handlers
│   ├── config/                # DB, seed
│   ├── services/              # Business logic
│   ├── uploads/               # Uploaded files
│   └── server.js              # Entry point
├── .env
├── package.json
└── README.md
```

## API Endpoints

### Auth
| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| POST   | /api/auth/signup   | Register new user    |
| POST   | /api/auth/login    | Login                |
| POST   | /api/auth/logout   | Logout               |
| POST   | /api/auth/refresh  | Refresh JWT          |
| GET    | /api/auth/me       | Get current user     |
| PUT    | /api/auth/profile  | Update profile       |
| GET    | /api/auth/check-email | Check email exists |

### Users
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | /api/users/search     | Search users         |
| GET    | /api/users/online     | Get online users     |
| GET    | /api/users/:id        | Get user by ID       |

### Messages
| Method | Endpoint                    | Description            |
|--------|-----------------------------|------------------------|
| GET    | /api/messages/conversations | Get all conversations  |
| GET    | /api/messages/:id           | Get messages (paginated) |
| POST   | /api/messages               | Send message           |
| PUT    | /api/messages/:id/seen      | Mark as seen           |
| DELETE | /api/messages/:id           | Delete message         |

### Stories
| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| GET    | /api/stories          | Get active stories |
| POST   | /api/stories          | Create story       |
| POST   | /api/stories/:id/view | Mark story viewed  |
| DELETE | /api/stories/:id      | Delete story       |

## WebSocket Events

### Client → Server
| Event           | Data                        | Description          |
|-----------------|-----------------------------|----------------------|
| message:send    | { receiverId, text, ... }   | Send chat message    |
| message:typing  | { receiverId, isTyping }    | Typing indicator     |
| message:seen    | { conversationId }          | Mark messages seen   |
| call:start      | { receiverId, callType }    | Initiate call        |
| call:accept     | { callId }                  | Accept incoming call |
| call:reject     | { callId }                  | Reject call          |
| call:end        | { receiverId, duration }    | End call             |
| call:signal     | { receiverId, signal }      | WebRTC signaling     |

### Server → Client
| Event              | Data                        | Description              |
|--------------------|-----------------------------|--------------------------|
| users:online       | [userId, ...]               | List of online user IDs  |
| message:new        | message                     | New message received     |
| message:sent       | message                     | Message sent confirmation|
| message:typing     | { userId, isTyping }        | User typing status       |
| call:incoming      | { from, fromName, callType } | Incoming call           |
| call:accepted      | { callId }                  | Call was accepted        |
| call:ended         | { callId }                  | Call ended               |
| call:signal        | { signal }                  | WebRTC signal            |
| conversation:updated | conversation              | Conversation updated     |
| conversations:list | [conversation, ...]         | Full conversation list   |

## Deployment

### MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Get your connection string
3. Update `MONGO_URI` in `server/.env`

### Render (Backend)

1. Push code to GitHub
2. Create a new Web Service on Render
3. Set:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && node server.js`
   - Add environment variables from `.env`

### Vercel (Frontend)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the `client/` directory
3. Set environment variables in Vercel dashboard

### Railway (Full Stack)

1. Push to GitHub
2. Create project on Railway
3. Connect repo, add MongoDB plugin
4. Set start command: `npm run dev:server`

## TURN Server Setup (Optional)

For reliable calls behind strict NATs, set up a TURN server:

Using [coturn](https://github.com/coturn/coturn):

```bash
# Install
apt install coturn

# Configure /etc/turnserver.conf
listening-port=3478
fingerprint
lt-cred-mech
user=snapfeed:ultra-secret
realm=snapfeed.com

# Start
turnserver -o -a -f -r snapfeed.com
```

Update `RTC_CONFIG` in `client/src/utils/constants.js`:

```js
{
  urls: 'turn:your-server.com:3478',
  username: 'snapfeed',
  credential: 'ultra-secret',
}
```

## Production Optimization

- Enable MongoDB indexes (auto-created)
- Set `NODE_ENV=production`
- Use Redis for Socket.io adapter in multi-process mode
- Enable HTTP/2 for better WebSocket performance
- Use CDN for static assets
- Implement rate limiting (built-in)
- Enable CORS for your domain only
- Use HTTPS with Let's Encrypt

## Troubleshooting

### MongoDB connection fails
- Ensure MongoDB is running: `mongod --dbpath /data/db`
- Check `MONGO_URI` in `.env`
- For Atlas, whitelist your IP

### WebRTC calls fail
- Ensure both users are on the same network or configure TURN
- Check browser permissions for camera/mic
- Open browser console for ICE connection state

### Socket.io disconnects
- Check Vite proxy config in `vite.config.js`
- Ensure server CORS allows client origin
- Check for firewall blocking WebSocket upgrades

### Build fails
- Clear cache: `rm -rf node_modules && npm run install:all`
- Update Node.js to 18+
- For client build: `cd client && npm run build`

## License

MIT © Snapfeed Ultra
