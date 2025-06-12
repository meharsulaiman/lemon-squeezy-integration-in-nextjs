# Next.js E-Commerce Store with Lemon Squeezy Payment Gateway (Stripe Alternative)

This project is a minimal eCommerce store built using Next.js, Prisma, and SQLite, with Lemon Squeezy for payment processing. It allows users to purchase digital products securely.

## Features

- **Next.js** for server-side rendering and frontend development.
- **Prisma** as the ORM for database management.
- **SQLite** as the lightweight database for local development.
- **Lemon Squeezy** for handling digital product sales and payments.

## Environment Variables
To run this project, create a `.env` file and add the following environment variables:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
NEXT_PUBLIC_URL="http://localhost:3000"
LEMON_SQUEEZY_API_KEY="your-lemon-squeezy-api-key"
LEMON_SQUEEZY_STORE_ID="your-lemon-squeezy-store-id"
LEMON_SQUEEZY_VARIANT_ID="your-lemon-squeezy-variant-id"
LEMON_SQUEEZY_SIGNING_SECRET="your-lemon-squeezy-signing-secret"
```

### Description of Variables
- **DATABASE_URL**: Specifies the SQLite database file path.
- **JWT_SECRET**: Secret key used for JWT authentication.
- **NEXT_PUBLIC_URL**: Base URL for the frontend.
- **LEMON_SQUEEZY_API_KEY**: API key to interact with Lemon Squeezy.
- **LEMON_SQUEEZY_STORE_ID**: Store ID associated with Lemon Squeezy.
- **LEMON_SQUEEZY_VARIANT_ID**: The product variant ID for the digital product.
- **LEMON_SQUEEZY_SIGNING_SECRET**: Secret used to verify Lemon Squeezy webhook events.

## Getting Started
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/your-repo.git
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up the database:
   ```sh
   npx prisma migrate dev --name init
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Setup Method
The project includes a setup script to automate installation and database initialization:
```json
{
  "name": "payment-setup",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "seed": "node lib/seed.js",
    "setup": "npm install && prisma migrate dev --name init && npm run seed"
  },
  "dependencies": {
    "@lemonsqueezy/lemonsqueezy.js": "^4.0.0",
    "@prisma/client": "^5.6.0",
    "axios": "^1.6.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "next": "15.2.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "15.2.3",
    "prisma": "^5.6.0",
    "tailwindcss": "^4"
  }
}
```

## License
This project is licensed under the MIT License.

