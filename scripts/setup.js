#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔐 Passgnaret Setup Script\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local already exists');
} else {
  console.log('📝 Creating .env.local from template...');
  
  const envTemplate = `# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/passgnaret
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/passgnaret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${crypto.randomBytes(32).toString('base64')}

# For production, use a strong random secret:
# NEXTAUTH_SECRET=$(openssl rand -base64 32)
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env.local created with random NEXTAUTH_SECRET');
}

console.log('\n📋 Next steps:');
console.log('1. Update MONGODB_URI in .env.local with your MongoDB connection string');
console.log('2. Run: npm install');
console.log('3. Run: npm run dev');
console.log('4. Open http://localhost:3000');

console.log('\n🚀 For production deployment:');
console.log('1. Set up MongoDB Atlas (free tier available)');
console.log('2. Deploy to Vercel, Netlify, or your preferred platform');
console.log('3. Update environment variables in your hosting platform');

console.log('\n✨ Happy coding!');
