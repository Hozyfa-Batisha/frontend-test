# Frontend Deployment Guide
## Hamzauy Coaching — Google Cloud Storage + CDN

> **Audience:** Developer deploying the static site (HTML/CSS/JS) for `hamzauycoach.github.io`.  
> **Current hosting:** GitHub Pages (free, zero-config).  
> **Alternative covered here:** Google Cloud Storage static website + Cloud CDN.

---

## Table of Contents

1. [Option A — Stay on GitHub Pages (recommended for free tier)](#option-a--stay-on-github-pages)
2. [Option B — Google Cloud Storage Static Hosting](#option-b--google-cloud-storage-static-hosting)
3. [Option C — Add Cloud CDN in front of GCS](#option-c--add-cloud-cdn-in-front-of-gcs)
4. [Custom Domain & HTTPS](#custom-domain--https)
5. [Deployment Checklist](#deployment-checklist)
6. [Updating the Frontend After Backend Changes](#updating-the-frontend-after-backend-changes)
7. [Cost Breakdown](#cost-breakdown)

---

## Option A — Stay on GitHub Pages

GitHub Pages is already configured and free. No changes needed unless you require a custom domain or CDN.

### Push a frontend update

```bash
# From the repo root
git add .
git commit -m "feat: add consultation booking page"
git push origin main
```

GitHub Pages rebuilds automatically within ~60 seconds.  
Site URL: `https://hamzauycoach.github.io`

### Custom domain with GitHub Pages

1. Buy a domain (e.g. `hamzauycoach.com` via Namecheap / Google Domains).
2. In your domain DNS, add:
   ```
   CNAME  www  hamzauycoach.github.io
   A      @    185.199.108.153
   A      @    185.199.109.153
   A      @    185.199.110.153
   A      @    185.199.111.153
   ```
3. In GitHub repo → **Settings → Pages → Custom domain**, enter your domain.
4. Tick **"Enforce HTTPS"** — GitHub issues a free Let's Encrypt cert automatically.

---

## Option B — Google Cloud Storage Static Hosting

Use this if you want to avoid GitHub, need fine-grained cache control, or are already on GCP.

### Prerequisites

```bash
# Install Google Cloud CLI if not already installed
# https://cloud.google.com/sdk/docs/install
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Step 1 — Create a GCS bucket

```bash
# Bucket name must match your domain exactly if you plan to use a custom domain
gsutil mb -l europe-west1 gs://hamzauycoach.com

# Enable website serving
gsutil web set -m index.html -e 404.html gs://hamzauycoach.com
```

### Step 2 — Make bucket publicly readable

```bash
gsutil iam ch allUsers:objectViewer gs://hamzauycoach.com
```

### Step 3 — Upload the frontend files

```bash
# From the extracted frontend-updated folder
gsutil -m rsync -r -d . gs://hamzauycoach.com

# Set cache headers (HTML = no-cache; assets = 1 year)
gsutil -m setmeta \
  -h "Cache-Control:no-store, no-cache, must-revalidate" \
  "gs://hamzauycoach.com/**.html"

gsutil -m setmeta \
  -h "Cache-Control:public, max-age=31536000, immutable" \
  "gs://hamzauycoach.com/**.css" \
  "gs://hamzauycoach.com/**.js"
```

### Step 4 — Access via GCS direct URL

Without a CDN or custom domain, access via:
```
https://storage.googleapis.com/hamzauycoach.com/index.html
```

### Step 5 — (Optional) Create a 404 page

Create a `404.html` file in the root with your branding, then:
```bash
gsutil cp 404.html gs://hamzauycoach.com/
```

---

## Option C — Add Cloud CDN in front of GCS

Cloud CDN adds global edge caching, HTTPS, and a clean URL.

### Step 1 — Reserve a static external IP

```bash
gcloud compute addresses create hamzauy-frontend-ip \
  --network-tier=PREMIUM \
  --ip-version=IPV4 \
  --global

# Note the IP address:
gcloud compute addresses describe hamzauy-frontend-ip --global --format="get(address)"
```

### Step 2 — Create a backend bucket

```bash
gcloud compute backend-buckets create hamzauy-frontend-backend \
  --gcs-bucket-name=hamzauycoach.com \
  --enable-cdn \
  --cache-mode=CACHE_ALL_STATIC
```

### Step 3 — Create URL map + target proxy + forwarding rule

```bash
# URL map
gcloud compute url-maps create hamzauy-frontend-urlmap \
  --default-backend-bucket=hamzauy-frontend-backend

# Target HTTP proxy (redirect to HTTPS below)
gcloud compute target-http-proxies create hamzauy-http-proxy \
  --url-map=hamzauy-frontend-urlmap

# Forwarding rule (port 80)
gcloud compute forwarding-rules create hamzauy-http-rule \
  --address=hamzauy-frontend-ip \
  --global \
  --target-http-proxy=hamzauy-http-proxy \
  --ports=80
```

### Step 4 — Enable HTTPS with a Google-managed certificate

```bash
# Create managed SSL certificate (replace with your domain)
gcloud compute ssl-certificates create hamzauy-cert \
  --domains=hamzauycoach.com,www.hamzauycoach.com \
  --global

# Target HTTPS proxy
gcloud compute target-https-proxies create hamzauy-https-proxy \
  --url-map=hamzauy-frontend-urlmap \
  --ssl-certificates=hamzauy-cert

# Forwarding rule (port 443)
gcloud compute forwarding-rules create hamzauy-https-rule \
  --address=hamzauy-frontend-ip \
  --global \
  --target-https-proxy=hamzauy-https-proxy \
  --ports=443
```

### Step 5 — HTTP → HTTPS redirect

```bash
# Create a redirect URL map
gcloud compute url-maps import hamzauy-redirect-map \
  --source /dev/stdin --global << 'EOF'
kind: compute#urlMap
name: hamzauy-redirect-map
defaultUrlRedirect:
  redirectResponseCode: MOVED_PERMANENTLY_DEFAULT
  httpsRedirect: true
EOF

gcloud compute target-http-proxies update hamzauy-http-proxy \
  --url-map=hamzauy-redirect-map
```

### Step 6 — Point DNS to the IP

In your DNS provider, add:
```
A    @    <your-reserved-IP>
A    www  <your-reserved-IP>
```

Certificate provisioning takes 10–60 minutes after DNS propagates.

---

## Custom Domain & HTTPS

| Approach | HTTPS | Cost |
|---|---|---|
| GitHub Pages + custom domain | Free (Let's Encrypt auto) | $0 |
| GCS direct URL (`storage.googleapis.com/…`) | Included | $0 |
| GCS + Cloud CDN + managed cert | Auto-provisioned | ~$0.01–0.20/month for small traffic |

---

## Deployment Checklist

Before pushing a new version of the frontend, verify:

- [ ] `API_URL` in `consultation/consultation-en.js` and `consultation/consultation-ar.js` matches your deployed backend URL
- [ ] `API_URL` in `payment/payment-en.js` and `payment/payment-ar.js` is correct
- [ ] `WHATSAPP_NUMBER` is correct in all JS files
- [ ] All links between pages use root-relative paths (`/`) for GitHub Pages, or are consistent with your hosting base URL
- [ ] `consultation/consultation-en.html` and `consultation/consultation-ar.html` both load correctly
- [ ] Free plan files (`free-plan-page/`) are still present and untouched
- [ ] Test form submission against the live backend (`POST /api/reservation`)

---

## Updating the Frontend After Backend Changes

If the backend URL changes (e.g. after redeployment):

1. Update `API_URL` in:
   - `consultation/consultation-en.js`
   - `consultation/consultation-ar.js`
   - `payment/payment-en.js`
   - `payment/payment-ar.js`
2. Re-upload via `gsutil rsync` **or** push to GitHub and let Pages rebuild.

If backend CORS settings change:
- Ensure the new frontend origin (e.g. `https://hamzauycoach.com`) is allowed in `ALLOWED_ORIGINS` env var on Cloud Run (see `backend/.env.example`).

---

## Cost Breakdown

| Service | Monthly Cost |
|---|---|
| **GitHub Pages** | **$0** (recommended) |
| GCS storage (< 1 GB HTML/CSS/JS) | ~$0.02 |
| GCS egress (first 1 GB/month free) | $0 |
| Cloud CDN (first 10 GB/month free) | $0–$0.08 |
| Static IP reservation | ~$0.01 (when attached) |
| Google-managed SSL cert | $0 |
| **Estimated total (GCS + CDN)** | **$0.03 – $0.30 / month** |

> **Tip:** For a coaching site with moderate traffic, GitHub Pages is unbeatable — it's completely free, already configured, and supports HTTPS + custom domains out of the box. Switch to GCS + Cloud CDN only if you need finer cache control, private access, or tighter GCP integration with your backend.

---

## Quick Reference — Useful Commands

```bash
# Upload entire frontend folder to GCS
gsutil -m rsync -r -d /path/to/frontend-updated gs://your-bucket-name

# Invalidate CDN cache (after deploying new HTML/JS/CSS)
gcloud compute url-maps invalidate-cdn-cache hamzauy-frontend-urlmap \
  --path "/*" --global

# Check SSL certificate status
gcloud compute ssl-certificates describe hamzauy-cert --global \
  --format="get(managed.status)"

# View backend (Cloud Run) logs
gcloud run services logs read hamzauy-backend --region=europe-west1 --limit=50
```
