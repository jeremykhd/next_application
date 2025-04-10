# Next.js Application

A modern Next.js application with Docker and GitHub Actions CI/CD setup, featuring robust security measures and modular architecture.

## Architecture Overview

### Core Components

1. **Application Layer**

   - Next.js 14 with App Router
   - TypeScript for type safety
   - Zustand for state management
   - Modular component structure

2. **Security Layer**

   - Middleware-based security headers
   - Rate limiting with Redis
   - Environment variable validation
   - Content Security Policy (CSP)
   - XSS and CSRF protection

3. **Infrastructure Layer**
   - Docker containerization
   - GitHub Actions CI/CD
   - Ionos deployment
   - Redis for rate limiting
   - Supabase for backend services

### Security Features

1. **Request Protection**

   - Rate limiting (10 requests per 10 seconds)
   - IP-based request tracking
   - Request header validation
   - Security headers middleware

2. **Content Security**

   - Strict CSP policies
   - Nonce-based script execution
   - Frame protection
   - Mixed content blocking
   - Referrer policy control

3. **Environment Security**

   - Type-safe environment variables
   - Runtime validation
   - Secure secret management
   - Development/production separation

4. **CI/CD Security**
   - Automated vulnerability scanning
   - Dependency auditing
   - Docker image scanning
   - OWASP compliance checks

## Prerequisites

- Node.js 18.x or later
- Docker
- GitHub account
- Ionos hosting account
- Redis instance (Upstash recommended)

## Environment Setup

Required environment variables:

```bash
NODE_ENV=development|production|test
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

## Local Development

1. Clone the repository:

```bash
git clone <repository-url>
cd next_application
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with your environment variables:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
```

## Docker Development

1. Build the Docker image:

```bash
docker build -t next-app .
```

2. Run the container:

```bash
docker run -p 3000:3000 next-app
```

### Docker Compose

For local development with Docker Compose:

```bash
docker-compose up
```

Features:

- Health checks (available at `/api/health`)
- Automatic container restart
- Volume mounting for hot reloading
- Environment variable support

## Security Implementation

### Middleware Security

The application implements several security measures through middleware:

1. **Security Headers**

   - Content Security Policy (CSP)
   - X-Frame-Options
   - X-Content-Type-Options
   - Referrer Policy
   - Permissions Policy

2. **Rate Limiting**
   - Redis-based rate limiting
   - IP-based tracking
   - Configurable limits
   - Analytics support

### Environment Security

Environment variables are validated using Zod:

- Type checking
- Required field validation
- URL validation
- Enum validation

### CI/CD Security

The GitHub Actions workflow includes:

1. Security scanning

   - npm audit
   - Snyk vulnerability scanning
   - OWASP Dependency Check
   - Trivy container scanning

2. Testing

   - Unit tests
   - Integration tests
   - Build verification

3. Deployment
   - Secure image building
   - Vulnerability scanning
   - Automated deployment

## Testing

Run tests locally:

```bash
npm test
```

The CI/CD pipeline includes automated testing:

- Unit tests
- Build verification
- Health check monitoring

## Deployment

The application is automatically deployed to Ionos using GitHub Actions when changes are pushed to the main branch.

### Required GitHub Secrets

Add the following secrets to your GitHub repository:

- `IONOS_HOST`: Your Ionos server hostname
- `IONOS_USERNAME`: Your Ionos SSH username
- `IONOS_PASSWORD`: Your Ionos SSH password
- `SNYK_TOKEN`: Your Snyk API token

### Manual Deployment

1. Build and push the Docker image:

```bash
docker build -t ghcr.io/<username>/<repository>:latest .
docker push ghcr.io/<username>/<repository>:latest
```

2. SSH into your Ionos server and run:

```bash
docker pull ghcr.io/<username>/<repository>:latest
docker run -d -p 3000:3000 ghcr.io/<username>/<repository>:latest
```

## CI/CD Pipeline

The GitHub Actions workflow:

1. Security scanning
   - Dependency audit
   - Vulnerability scanning
   - Container scanning
2. Testing
   - Unit tests
   - Build verification
3. Build and deploy
   - Docker image building
   - Image scanning
   - Deployment to Ionos

## License

MIT

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
