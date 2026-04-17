# EUE | UEL Web Dev Hub — Deployment Reference

> **DO NOT commit this file to a public repo. It contains deployment-sensitive information.**

## Accounts & Services

| Service | Account | Purpose |
|---------|---------|---------|
| **Supabase** | `moataz.samy@iamsedu.net` | Database & Auth |
| **GitHub** | `mottaz@gmail.com` (mizatrix) | Source Code |
| **Vercel** | `mottaz@gmail.com` | Hosting |

## Supabase Project

| Key | Value |
|-----|-------|
| Project Name | EUE-EUL-WEB-Project |
| Project Ref | `vpktrmqzylgtqlpuqyll` |
| Region | Europe (eu-west-1) |
| Organization | IAMS EDU (Free) |
| Dashboard | https://supabase.com/dashboard/project/vpktrmqzylgtqlpuqyll |
| API URL | `https://vpktrmqzylgtqlpuqyll.supabase.co` |
| SQL Editor | https://supabase.com/dashboard/project/vpktrmqzylgtqlpuqyll/sql |

## GitHub Repository

| Key | Value |
|-----|-------|
| SSH URL | `git@github.com:mizatrix/EUE-UEL-WEB_project.git` |
| HTTPS URL | `https://github.com/mizatrix/EUE-UEL-WEB_project` |

## Vercel Environment Variables

Set these in **Vercel → Project Settings → Environment Variables** (all environments):

```
NEXT_PUBLIC_SUPABASE_URL = https://vpktrmqzylgtqlpuqyll.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = (see .env.local)
SUPABASE_SERVICE_ROLE_KEY = (see .env.local)
```

## Quick Redeploy

```bash
# From project root:
git add -A
git commit -m "update: description"
git push origin main
# Vercel auto-deploys from main branch
```

## Email Domain Whitelist (Student Signup)

- `@eue.edu.eg`
- `@uel.eue.edu.eg`
- `@uel.ac.uk`
- `@student.uel.ac.uk`
