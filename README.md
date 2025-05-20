# Fire Safety Inspectors Guide

A web application to help fire safety inspectors of the Bureau of Fire Protection in the Philippines. This tool is based on the Revised RA 9514 IRR 2019 (Fire Code of the Philippines).

## Features

- Select building occupancy type
- Input number of stories/floors
- Input dimensions for each floor
- Calculate occupant load automatically
- Generate fire safety requirements based on building data

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

### Running Locally

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deploying to Vercel

### Automatic Deployment

The easiest way to deploy this application is using the Vercel Platform:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project into Vercel: https://vercel.com/new
3. Vercel will detect Next.js automatically and use the optimal build settings

### Manual Deployment

You can also deploy using the Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel
```

### Using a Custom Domain

1. Go to your project dashboard in Vercel
2. Click on "Domains" in the top navigation
3. Click "Add" and enter your domain name
4. Follow the DNS configuration instructions provided by Vercel

### Troubleshooting Deployment Issues

If you encounter a 404 error (NOT_FOUND) after deployment:

1. Make sure your project has been built successfully (check build logs in Vercel dashboard)
2. Verify that the `next.config.js` and `vercel.json` files are properly configured
3. Try redeploying with the following command:

```bash
vercel --prod
```

4. If issues persist, check the Vercel deployment logs for specific error messages

For more detailed deployment instructions, see the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment on Vercel

This application is designed to be easily deployed on Vercel.

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and sign up/login.
3. Click "New Project" and import your GitHub repository.
4. Vercel will automatically detect that it's a Next.js project.
5. Click "Deploy" and your application will be live in minutes.

## About the Fire Code

The Revised Fire Code of the Philippines (RA 9514 IRR 2019) establishes requirements for fire safety in buildings based on occupancy type, building size, and other factors. This application helps inspectors determine which requirements apply to a specific building.

## Disclaimer

This tool provides general guidance based on the Fire Code of the Philippines. For comprehensive and official assessment, please consult with certified fire safety professionals or your local Bureau of Fire Protection office.
