# LINE° — Apple Pay Domain Verification

This directory is intentionally left empty for your Apple Pay domain verification file.

## Setup Instructions

1. Go to your Paystack dashboard → Settings → Apple Pay
2. Download the domain verification file provided by Paystack
3. Place the file in this directory: `public/.well-known/[filename]`
4. Deploy to Vercel — the file will be publicly served at:
   `https://yourdomain.com/.well-known/[filename]`
5. Complete the domain verification in your Paystack dashboard

## Notes

- Do NOT rename or modify the verification file
- The file must be publicly accessible without redirects
- HTTPS is required (Vercel provides this automatically)
- Vercel is configured to serve this directory with the correct headers (see vercel.json)
