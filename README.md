# Passgnaret - Secure Password Vault

A privacy-first password generator and secure vault built with Next.js, MongoDB, and client-side encryption.

## Features

### 🔐 Security
- **Client-side encryption**: All vault data is encrypted before leaving your device
- **Zero-knowledge architecture**: Server never stores plaintext passwords
- **Strong password generation**: Customizable length, character sets, and options
- **Secure authentication**: Email/password with bcrypt hashing

### 🚀 Functionality
- **Password Generator**: Length slider, character type options, strength indicator
- **Secure Vault**: Store title, username, password, URL, and notes
- **Search & Filter**: Quick search across all vault items
- **Copy to Clipboard**: Auto-clear after 15 seconds for security
- **Dark Mode**: Toggle between light and dark themes

### 🛠️ Tech Stack
- **Frontend**: Next.js 14 with TypeScript
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Encryption**: CryptoJS (AES-256 with PBKDF2)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd passgnaret
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/passgnaret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Encryption Details

**Library Used**: CryptoJS
**Algorithm**: AES-256 encryption with PBKDF2 key derivation

**Why CryptoJS?**
- Mature, well-tested JavaScript cryptography library
- Supports AES-256 encryption with PBKDF2 key derivation
- Works seamlessly in browser environments
- Provides secure random number generation for salts
- Lightweight and performant for client-side operations

**Security Implementation**:
- Each vault item is encrypted with a unique salt
- Master password is never stored or transmitted
- PBKDF2 with 10,000 iterations for key derivation
- AES-256 encryption for data protection

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── vault/         # Vault CRUD operations
│   ├── auth/              # Auth pages (signin/signup)
│   ├── dashboard/         # Main dashboard
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── PasswordGenerator.tsx
│   ├── VaultList.tsx
│   └── VaultItemForm.tsx
├── lib/                   # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── encryption.ts     # Client-side encryption
│   ├── mongodb.ts        # Database connection
│   └── password-generator.ts
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in user (via NextAuth)

### Vault Operations
- `GET /api/vault` - Get user's vault items
- `POST /api/vault` - Create new vault item
- `PUT /api/vault/[id]` - Update vault item
- `DELETE /api/vault/[id]` - Delete vault item

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Use Next.js build output
- **Railway**: Direct deployment with MongoDB Atlas
- **DigitalOcean**: App Platform with managed database

## Security Considerations

- ✅ Client-side encryption before transmission
- ✅ Secure password hashing with bcrypt
- ✅ HTTPS enforcement in production
- ✅ No sensitive data in logs
- ✅ Auto-clear clipboard after 15 seconds
- ✅ CSRF protection via NextAuth

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

---

**Note**: This is a personal password vault. Always use strong, unique master passwords and consider additional security measures for sensitive accounts.
