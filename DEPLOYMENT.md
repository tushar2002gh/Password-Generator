# Deployment Guide

## Quick Deploy to Vercel

1. **Fork this repository** to your GitHub account

2. **Set up MongoDB Atlas** (free tier available):
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Get your connection string
   - Whitelist all IPs (0.0.0.0/0) for development

3. **Deploy to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/passgnaret
     NEXTAUTH_URL=https://your-app.vercel.app
     NEXTAUTH_SECRET=your-random-secret-key
     ```
   - Deploy!

## Alternative Deployments

### Netlify
- Build command: `npm run build`
- Publish directory: `.next`
- Add environment variables in Netlify dashboard

### Railway
- Connect GitHub repository
- Add MongoDB service
- Set environment variables
- Deploy automatically

### DigitalOcean App Platform
- Connect GitHub repository
- Add MongoDB database
- Configure environment variables
- Deploy with automatic builds

## Environment Variables

### Required
- `MONGODB_URI`: Your MongoDB connection string
- `NEXTAUTH_URL`: Your app's URL (e.g., https://your-app.vercel.app)
- `NEXTAUTH_SECRET`: Random secret key for JWT signing

### Generating NEXTAUTH_SECRET
```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Configure MongoDB access controls
- [ ] Enable MongoDB authentication
- [ ] Set up proper CORS if needed
- [ ] Monitor for security updates

## Performance Optimization

- [ ] Enable Next.js compression
- [ ] Use CDN for static assets
- [ ] Optimize images
- [ ] Enable caching headers
- [ ] Monitor Core Web Vitals

## Monitoring

- Set up error tracking (Sentry, LogRocket)
- Monitor database performance
- Track user analytics (privacy-focused)
- Set up uptime monitoring
