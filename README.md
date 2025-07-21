# Multi-Tenant SaaS Setup & Deployment Guide

## Multi-Tenancy Overview
- Each organization (tenant) is identified by a unique slug (e.g., `npo1`).
- The app supports both subdomain-based routing (e.g., `npo1.localhost.com:3000`) and header-based routing (via the `x-org-slug` header).

## Local Development
### Subdomain Testing
- Use a DNS service like `lvh.me` or `lcl.host` (e.g., `npo1.lvh.me:3000` points to `127.0.0.1`).
- Or, edit your `/etc/hosts` to map `*.localhost.com` to `127.0.0.1`.

### Header-Based Testing
- The frontend automatically sends the `x-org-slug` header if `orgSlug` is set in `localStorage`.
- After login/registration, set `localStorage.setItem('orgSlug', 'npo1')` in your browser console to test as that org.

## Production Deployment
- Set up a wildcard DNS record for your domain (e.g., `*.yourdomain.com` → your server IP).
- Ensure your reverse proxy (Nginx, etc.) and SSL certs support wildcard subdomains.
- The backend will extract the org slug from the subdomain or the `x-org-slug` header.

## Registration Flow
- On registration, users must pick a unique, DNS-safe slug (lowercase, numbers, hyphens, 2-63 chars, cannot start/end with hyphen).
- After registration, users should access their org at `https://<slug>.yourdomain.com`.

## API Calls
- All frontend API calls automatically include the `x-org-slug` header if available.
- Backend enforces tenant context for all org-specific actions.

## Testing Multi-Tenancy
- Register multiple orgs with different slugs.
- Open multiple browser sessions, set different `orgSlug` values in localStorage, and verify data isolation.

## Environment Variables
- See `.env.example` for all required variables (DB, JWT, Stripe, etc.).

---
For any issues, see the code comments or contact the maintainer.
