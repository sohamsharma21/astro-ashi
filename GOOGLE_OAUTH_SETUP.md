# Google OAuth Setup Guide for Jyotisham

This guide will help you configure Google Sign-In for your Jyotisham astrology application.

## Prerequisites

- A Google Cloud account
- Access to your Supabase project dashboard
- Your application's production URL

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter project name: `Jyotisham-Auth`
4. Click **Create**

## Step 2: Configure OAuth Consent Screen

1. In Google Cloud Console, navigate to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type (unless you have Google Workspace)
3. Click **Create**

### Fill in the required information:

- **App name**: Jyotisham
- **User support email**: Your email
- **App logo**: (Optional) Upload your app logo
- **Application home page**: `https://jyotisham.lovable.app`
- **Authorized domains**: 
  - `lovable.app`
  - `supabase.co`
- **Developer contact email**: Your email

4. Click **Save and Continue**

### Configure Scopes:

1. Click **Add or Remove Scopes**
2. Add these scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
3. Click **Update** → **Save and Continue**

### Test Users (for development):

1. Add your email and any test user emails
2. Click **Save and Continue**

## Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth Client ID**
3. Select **Application type**: Web application
4. Enter **Name**: `Jyotisham Web Client`

### Configure Authorized JavaScript origins:

Add these URLs:
```
http://localhost:5173
https://jyotisham.lovable.app
https://czpumlrofurdktvjtibl.supabase.co
```

### Configure Authorized redirect URIs:

Add these URLs:
```
http://localhost:5173/auth/callback
https://jyotisham.lovable.app/auth/callback
https://czpumlrofurdktvjtibl.supabase.co/auth/v1/callback
```

5. Click **Create**
6. **Save your credentials**: Copy the Client ID and Client Secret

## Step 4: Configure Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/czpumlrofurdktvjtibl)
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and toggle it **ON**

### Enter Google OAuth credentials:

- **Client ID**: Paste the Client ID from Google Cloud Console
- **Client Secret**: Paste the Client Secret from Google Cloud Console

4. Click **Save**

## Step 5: Configure Site URL and Redirect URLs in Supabase

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**

### Set Site URL:
```
https://jyotisham.lovable.app
```

### Add Redirect URLs:
```
http://localhost:5173/**
https://jyotisham.lovable.app/**
https://czpumlrofurdktvjtibl.supabase.co/auth/v1/callback
```

2. Click **Save**

## Step 6: Test Google Sign-In

1. Open your application: `https://jyotisham.lovable.app`
2. Click on the **Sign In** or **Sign Up** button
3. Click **Sign in with Google**
4. Choose a Google account
5. Grant permissions
6. You should be redirected back to the app and logged in

## Troubleshooting

### Error: "requested path is invalid"

**Solution**: Make sure Site URL and Redirect URLs are correctly set in Supabase under **Authentication** → **URL Configuration**

### Error: "redirect_uri_mismatch"

**Solution**: 
1. Check that the redirect URI in Google Cloud Console matches exactly with Supabase's callback URL
2. Make sure to include `https://czpumlrofurdktvjtibl.supabase.co/auth/v1/callback`

### Error: "Access blocked: This app's request is invalid"

**Solution**:
1. Verify all authorized domains are added in OAuth consent screen
2. Ensure the OAuth consent screen is published (or add yourself as a test user)

### Users stuck on loading after signing in

**Solution**:
1. Check browser console for errors
2. Verify that the Site URL in Supabase matches your production URL
3. Clear browser cookies and try again

## Additional Configuration (Optional)

### Disable Email Confirmation for Faster Testing

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Scroll to **Email Auth**
3. Toggle **OFF** "Confirm email"
4. Click **Save**

**Note**: Re-enable this for production!

### Custom Domain Setup

If you're using a custom domain:

1. Update Site URL in Supabase to your custom domain
2. Add custom domain to Authorized JavaScript origins in Google Cloud Console
3. Add `https://yourdomain.com/auth/callback` to Authorized redirect URIs
4. Add `https://yourdomain.com/**` to Redirect URLs in Supabase

## Production Checklist

- [ ] OAuth consent screen is published
- [ ] Production URLs are added to Google Cloud Console
- [ ] Production URLs are added to Supabase URL Configuration
- [ ] Email confirmation is re-enabled (if disabled for testing)
- [ ] Test sign-in flow on production URL
- [ ] Test sign-out flow
- [ ] Verify user profile data is saved correctly

## Support

If you encounter issues:

1. Check [Supabase Auth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
2. Review [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
3. Check Supabase logs: **Authentication** → **Logs**
4. Check browser console for errors

---

**Last Updated**: December 2024
**Supabase Project**: czpumlrofurdktvjtibl
**Application URL**: https://jyotisham.lovable.app
