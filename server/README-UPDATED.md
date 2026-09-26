# RFQ Marketplace SaaS Backend - Updated Authentication

Registration still uses email OTP verification.

Login now uses email + password and does not send a login OTP on every sign-in.

The login endpoint accepts an optional `role` field. The frontend sends `ADMIN` from the Admin login tab so the backend prevents a Buyer/Supplier account from using the Admin login.

The old `/auth/login/verify-otp` and `/auth/login/resend-otp` endpoints remain in the project for compatibility but are no longer used by the updated frontend login flow.
