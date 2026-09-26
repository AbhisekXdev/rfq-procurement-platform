# RFQ Marketplace SaaS — Finalized Build

## Structure
- `client/` — React + Vite frontend
- `server/` — Express + Sequelize + Socket.IO backend

## Local
### Server
1. Copy `server/.env.example` to `server/.env`.
2. Set Aiven MySQL, JWT, SMTP and frontend origin values.
3. `cd server && npm install`
4. `npm run dev`

### Client
1. Copy `client/.env.example` to `client/.env`.
2. Set `VITE_API_URL` and `VITE_SOCKET_URL`.
3. `cd client && npm install`
4. `npm run dev`

## Production
- Set `CLIENT_URL` on the server to the deployed frontend origin.
- Set `VITE_API_URL` and `VITE_SOCKET_URL` before building the frontend.
- Socket.IO must be reachable from the frontend origin.
- Keep `DB_REPAIR_ORPHANS=true` during the first repair/sync of an existing database, then set it to `false` after the schema is clean.
- The server defaults `DB_SYNC_ALTER` to enabled because this project does not include migrations. After the first successful schema sync, set `DB_SYNC_ALTER=false` for a stable production schema.

## Security
The supplied `.env` files were intentionally excluded from the final package so database, JWT and SMTP secrets are not shipped.
