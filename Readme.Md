<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AgriTrust - Decentralized Agricultural Data Platform

This is a blockchain-inspired agricultural data management platform that provides secure, transparent, and tamper-proof data storage for farmers and researchers.

## Features

- **Blockchain-Inspired Security**: Cryptographic hashing and content addressing for data immutability
- **12-Word Authentication**: Decentralized authentication using mnemonic phrases
- **Dual Portal System**: Separate interfaces for farmers and researchers
- **Data Verification**: Independent verification of agricultural data authenticity
- **Transparent Records**: All data entries are cryptographically secured and traceable
- **Visual Analytics**: Interactive charts for monitoring agricultural trends

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file (at the repository root or inside `server/`) with your database settings, for example:
   ```
   PORT=5000
   CLIENT_ORIGINS=http://localhost:5173
   DB_HOST=localhost
   DB_PORT=27017
   DB_NAME=agritrust
   ```

3. Seed the database using the scripts in `database/` if you have not already done so (see `database/README.md`).

4. Start the API server:
   ```bash
   npm run server
   ```

5. In a separate terminal, run the frontend:
   ```bash
   npm run dev
   ```

## Authentication Options

- **Traditional Login**: Email and password authentication
- **Decentralized Login**: 12-word mnemonic phrase authentication (blockchain-inspired)

## Portals

- **Farmer Portal**: Submit and manage agricultural data with blockchain-inspired security
- **Researcher Portal**: Verify data authenticity and access transparent records

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, MongoDB
- **Blockchain Tools**: Ethers.js for cryptographic functions
- **Security**: bcrypt.js for password hashing, cryptographic hashing for data integrity

## Development

To build for production:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```