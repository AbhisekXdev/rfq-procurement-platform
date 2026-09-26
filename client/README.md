# RFQ Marketplace SaaS - Enhanced Frontend

## Included fixes
- ESM React/Vite frontend.
- Registration requires Gmail/email OTP verification.
- Normal Buyer/Supplier login uses email + password + frontend CAPTCHA; login OTP is not required.
- Separate Admin login tab with ADMIN role validation.
- Role-specific navigation with a separate Admin console tab.
- Live RFQ CRUD integration with the current backend routes.
- RFQ details page and supplier quotation submission.
- Buyer quotation loading and viewing.
- Supplier quotation loading and quotation detail modal.
- Persistent Socket.IO chat using the backend event names: `conversation:join`, `message:send`, `message:new`, `typing:start`, `typing:stop`, `message:read`.
- Aiven-backed conversation/message history through `/api/chat`.
- Admin dashboard/users/RFQ/quotation data integration.

## Environment

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Start

```bash
npm install
npm run dev
```

> The CAPTCHA in this frontend is a UI challenge. For production-grade bot protection, add server-side CAPTCHA verification (for example hCaptcha/reCAPTCHA/Cloudflare Turnstile) and validate the token in the backend.
