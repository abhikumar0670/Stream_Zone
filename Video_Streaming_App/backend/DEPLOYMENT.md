# Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "Add New..." → "Project"**
3. **Import your GitHub repository**: `https://github.com/abhikumar0670/Stream_Zone`
4. **Configure the project:**
   - Framework Preset: `Other`
   - Root Directory: `./` (leave as default)
   - Build Command: `npm install`
   - Output Directory: `./`
   - Install Command: `npm install`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel --prod
```

## Environment Variables Setup

After deploying, you need to add environment variables in Vercel:

1. **Go to your project dashboard on Vercel**
2. **Navigate to Settings → Environment Variables**
3. **Add the following variables:**

```env
MONGODB_URI=mongodb+srv://abhikumar0670:HQkGqpTUPZqy53VM@cluster0.oh97h6e.mongodb.net/video_streaming?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
JWT_EXPIRE=30d
MAX_FILE_SIZE=500000000
UPLOAD_PATH=./uploads
```

## Important Notes

1. **File Uploads**: Vercel has limitations on file uploads. For production, consider using:
   - AWS S3
   - Cloudinary
   - Google Cloud Storage

2. **Database**: MongoDB Atlas is perfect for Vercel deployments

3. **Function Timeout**: Vercel serverless functions have a 30-second timeout limit

4. **Cold Starts**: First request might be slower due to cold starts

## Testing Your Deployment

Once deployed, test these endpoints:

- `GET /` - Welcome message
- `GET /health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

## Troubleshooting

### Common Issues:

1. **Database Connection**: Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. **Environment Variables**: Double-check all env vars are set correctly
3. **Build Errors**: Check the build logs in Vercel dashboard

### Useful Commands:

```bash
# Check deployment status
vercel --prod

# View logs
vercel logs [deployment-url]

# Redeploy
vercel --prod --force
```

## Production Considerations

1. **Security**: Use strong JWT secrets in production
2. **Rate Limiting**: Already implemented with `express-rate-limit`
3. **CORS**: Configure CORS for your frontend domain
4. **Monitoring**: Consider adding error tracking (Sentry, etc.)
5. **Database Indexing**: Add appropriate indexes to MongoDB collections

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test database connectivity
4. Check GitHub repository settings
