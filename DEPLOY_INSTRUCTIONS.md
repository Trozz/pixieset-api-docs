# Deployment Instructions for GitHub Pages

Follow these steps to deploy the Pixieset API documentation to GitHub Pages.

## Prerequisites

- GitHub account
- Git installed locally
- Node.js installed (v18 or higher)

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `pixieset-api-docs`
3. Description: "Unofficial API documentation for Pixieset Studio and Gallery APIs"
4. Public repository (required for GitHub Pages free tier)
5. Do NOT initialize with README (we already have one)
6. Click "Create repository"

## Step 2: Initialize Git and Push Code

```bash
# Navigate to the project directory
cd /Users/trozz/Desktop/pixieset/pixieset-api-docs

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Pixieset API documentation site"

# Add GitHub repository as remote
git remote add origin https://github.com/trozz/pixieset-api-docs.git

# Push to main branch
git push -u origin main
```

## Step 3: Configure GitHub Pages

### Option A: Using GitHub Actions (Recommended)

1. The workflow file is already created at `.github/workflows/deploy.yml`
2. After pushing to GitHub, go to your repository
3. Navigate to **Settings** → **Pages**
4. Under "Build and deployment", select:
   - Source: **GitHub Actions**
5. The workflow will automatically run when you push to main branch

### Option B: Using gh-pages Branch

If you prefer the traditional approach:

1. Rename `.github/workflows/deploy-gh-pages.yml.alternative` to `.github/workflows/deploy.yml`
2. Delete the original `deploy.yml`
3. Push changes to GitHub
4. After the first deployment, go to **Settings** → **Pages**
5. Under "Build and deployment", select:
   - Source: **Deploy from a branch**
   - Branch: **gh-pages**
   - Folder: **/ (root)**

## Step 4: Verify Deployment

1. Go to the **Actions** tab in your repository
2. You should see the "Deploy to GitHub Pages" workflow running
3. Wait for it to complete (usually takes 2-3 minutes)
4. Your site will be available at: https://trozz.github.io/pixieset-api-docs/

## Step 5: Manual Deployment (Optional)

If you want to deploy manually without GitHub Actions:

```bash
# Build the site
npm run build

# Deploy to gh-pages branch
GIT_USER=trozz npm run deploy
```

## Troubleshooting

### Build Fails

- Check Node.js version: `node --version` (should be v18+)
- Clear cache: `npm run clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### 404 Error After Deployment

- Ensure the repository name in `docusaurus.config.ts` matches your GitHub repo
- Check that `baseUrl` is set correctly (`/pixieset-api-docs/`)
- Wait a few minutes for GitHub Pages to propagate

### Permission Errors

- Ensure your repository is public
- Check that GitHub Actions has proper permissions in Settings → Actions → General

## Updating Documentation

To update the documentation after initial deployment:

1. Make changes to markdown files in `docs/` directory
2. Test locally: `npm start`
3. Commit and push changes:
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push
   ```
4. GitHub Actions will automatically rebuild and deploy

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file in the `static/` directory with your domain
2. Update `docusaurus.config.ts`:
   ```typescript
   url: 'https://your-domain.com',
   baseUrl: '/',
   ```
3. Configure DNS settings with your domain provider
4. Add custom domain in GitHub Pages settings

## Support

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)