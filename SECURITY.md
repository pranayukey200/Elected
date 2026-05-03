# Security Policy

## Supported Versions

Only the latest production build on `elected-adcd4.web.app` is supported.

## Reporting a Vulnerability

We take the security of ElectED seriously. If you believe you have found a security vulnerability, please report it via GitHub Issues or by contacting our team.

### Protections in Place
1. **Environment Variable Isolation**: Critical API keys are never exposed in client-side bundles without sanitization.
2. **CSP Headers**: Strict Content Security Policy implemented to prevent XSS.
3. **No-PII Policy**: The platform does not collect Personally Identifiable Information from users.
