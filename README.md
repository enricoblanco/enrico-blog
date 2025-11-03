# Enrico Cidade Blanco - Personal Blog

Personal blog by Enrico Cidade Blanco, built with Next.js 16, featuring a clean white background and black text with the Courier Prime font.

## Features

- **Classical Design**: White background, black text, Courier Prime typewriter font
- **Admin Authentication**: Mock authentication system (ready to replace with Java microservice)
- **Rich Text Editor**: Powered by Tiptap with formatting options
- **Media Management**: Upload and position images/videos using Vercel Blob Storage
- **Draft & Publish**: Save posts as drafts or publish immediately
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Vercel Postgres)
- **ORM**: Prisma
- **Storage**: Vercel Blob
- **Styling**: Tailwind CSS v4
- **Rich Text**: Tiptap
- **Authentication**: Mock JWT (temporary - will be replaced by Java microservice)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

You need a PostgreSQL database. For Vercel Postgres:

1. Go to your Vercel dashboard
2. Create a new Postgres database
3. Copy the `DATABASE_URL` connection string

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Get this from Vercel Postgres dashboard
DATABASE_URL="postgresql://..."

# Get this from Vercel Blob dashboard (or create a new Blob store)
BLOB_READ_WRITE_TOKEN="vercel_blob_..."

# Keep these for now (mock auth)
JWT_SECRET="your-secret-key-here"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$2a$10$..." # See below for generating this

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Generate Password Hash

To generate a bcrypt hash for your admin password:

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password-here', 10));"
```

Copy the output and paste it as `ADMIN_PASSWORD_HASH` in `.env.local`.

### 5. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will create the database tables.

### 6. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your blog!

## Usage

### Admin Access

1. Navigate to [http://localhost:3000/login](http://localhost:3000/login)
2. Login with your admin credentials (default: `admin` / `admin123` if no hash is set)
3. You'll be redirected to the admin dashboard

### Creating Posts

1. Click "Create New Post" in the admin dashboard
2. Fill in the title and content
3. Optionally add:
   - Excerpt (summary for blog listing)
   - Cover image URL
   - Additional media (upload images/videos)
4. Choose to save as draft or publish immediately
5. Click "Save Draft" or "Publish Post"

### Managing Media

- Upload images or videos using the media upload component
- Reorder media items using ↑ and ↓ buttons
- Add alt text for accessibility
- Remove unwanted media items

### Editing Posts

1. Click "Edit" on any post in the admin dashboard
2. Make your changes
3. Click "Save Changes"
4. Or delete the post permanently

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically:
- Set up Postgres database (if you add it)
- Set up Blob storage (if you add it)
- Run build and migrations

### Database Migrations on Vercel

After deploying, run migrations:

```bash
npx prisma migrate deploy
```

Or set up automatic migrations in your build command:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

## Replacing Mock Auth with Java Microservice

The current authentication is mocked and ready to be replaced. Here's how:

### Current Mock Auth Endpoints

- `POST /api/auth/login` - Accepts username/password, returns JWT
- `POST /api/auth/logout` - Clears auth cookie
- `GET /api/auth/session` - Returns current user session

### Integration Steps

1. Update `/lib/auth.ts` to call your Java microservice instead of mock verification
2. Keep the same JWT token format or adapt to your microservice's format
3. Update middleware in `/middleware.ts` if needed
4. The rest of the app will continue working seamlessly

## Project Structure

```
my-blog/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── posts/         # Post CRUD endpoints
│   │   └── upload/        # Media upload endpoint
│   ├── admin/             # Admin dashboard & post management
│   ├── login/             # Login page
│   ├── posts/[slug]/      # Individual post pages
│   ├── layout.tsx         # Root layout with Courier Prime font
│   ├── page.tsx           # Blog homepage
│   └── globals.css        # Global styles
├── components/
│   ├── MediaUpload.tsx    # Media upload & management
│   ├── PostCard.tsx       # Post card for homepage
│   └── PostEditor.tsx     # Rich text editor
├── lib/
│   ├── auth.ts            # Auth utilities (mock)
│   ├── blob.ts            # Vercel Blob utilities
│   └── prisma.ts          # Prisma client
├── prisma/
│   └── schema.prisma      # Database schema
└── middleware.ts          # Route protection
```

## Database Schema

### Post
- id (String, CUID)
- title (String)
- slug (String, unique)
- content (Text)
- excerpt (Text, optional)
- coverImage (String, optional)
- published (Boolean)
- publishedAt (DateTime, optional)
- createdAt (DateTime)
- updatedAt (DateTime)
- media (Media[])

### Media
- id (String, CUID)
- postId (String)
- url (String)
- type (String: 'image' or 'video')
- alt (String, optional)
- position (Int)
- createdAt (DateTime)

## Troubleshooting

### "Cannot find module '@prisma/client'"

Run:
```bash
npx prisma generate
```

### Database connection issues

Make sure your `DATABASE_URL` is correct and the database is accessible.

### Blob upload fails

Verify your `BLOB_READ_WRITE_TOKEN` is set correctly in `.env.local`.

### Login doesn't work

Check that `JWT_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD_HASH` are set in `.env.local`.

## License

MIT
