# Google OAuth Setup Guide

To enable Google Sign-In for AstroAshi, follow these steps:

## 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one

## 2. Configure OAuth Consent Screen

1. Navigate to **APIs & Services** > **OAuth consent screen**
2. Select **External** user type
3. Fill in the required information:
   - App name: **AstroAshi**
   - User support email: Your email
   - Developer contact email: Your email
4. Under **Authorized domains**, add:
   - `czpumlrofurdktvjtibl.supabase.co`
   - `lovable.app` (if deploying to Lovable)
   - Your custom domain (if applicable)
5. Configure scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
6. Save and continue

## 3. Create OAuth Client ID

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth Client ID**
3. Select **Web application**
4. Configure:
   - **Name**: AstroAshi Web Client
   - **Authorized JavaScript origins**:
     - `https://astroashi.lovable.app` (or your domain)
     - `http://localhost:5173` (for local development)
   - **Authorized redirect URIs**:
     - `https://czpumlrofurdktvjtibl.supabase.co/auth/v1/callback`
     - `http://localhost:54321/auth/v1/callback` (for local Supabase)
5. Click **Create**
6. Copy your **Client ID** and **Client Secret**

## 4. Configure Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/czpumlrofurdktvjtibl/auth/providers)
2. Navigate to **Authentication** > **Providers**
3. Find **Google** in the list
4. Enable Google provider
5. Enter your:
   - **Client ID** (from step 3)
   - **Client Secret** (from step 3)
6. Save configuration

## 5. Test Google Sign-In

1. Go to your AstroAshi application
2. Click "Sign in with Google"
3. You should be redirected to Google's login page
4. After successful login, you'll be redirected back to AstroAshi

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Console matches exactly: `https://czpumlrofurdktvjtibl.supabase.co/auth/v1/callback`

### Error: "invalid_client"
- Verify your Client ID and Client Secret are correct in Supabase

### Welcome email not sent
- Check Supabase Edge Function logs
- Verify RESEND_API_KEY is configured
- Ensure `send-welcome-email` function is deployed

## Production Deployment

When deploying to production:

1. Update **Authorized JavaScript origins** in Google Console with your production domain
2. Update **Authorized redirect URIs** with your production Supabase URL
3. Update **Site URL** in Supabase Auth settings
4. Verify all environment variables are set

## Resources

- [Supabase Google Auth Docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
