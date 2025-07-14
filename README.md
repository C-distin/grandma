# Margaret Kuofie - Author & Storyteller Website

A modern, full-stack TypeScript application built for author Margaret Kuofie, featuring a complete blog management system, book showcase, and professional portfolio.

## 🚀 Features

### Frontend
- **Modern Design**: Clean, responsive UI with Tailwind CSS
- **Smooth Animations**: Motion (motion.dev) for page transitions and micro-interactions
- **Book Showcase**: Dedicated pages for featured books with purchase links
- **Speaking Engagements**: Professional speaking portfolio and booking information
- **Contact System**: Interactive contact forms with validation

### Blog Management
- **Full CRUD Operations**: Create, read, update, and delete blog posts
- **Rich Content Editor**: Markdown support with live preview
- **Category Management**: Organize posts by categories with color coding
- **Tag System**: Flexible tagging for better content organization
- **Image Management**: Featured images and additional image uploads
- **Draft System**: Save posts as drafts before publishing
- **Analytics**: View counts, likes, and reading time estimation

### Admin Dashboard
- **Post Management**: Comprehensive dashboard for managing all blog content
- **Search & Filter**: Advanced filtering by status, category, and search terms
- **Statistics**: Overview of total posts, views, and engagement metrics
- **Responsive Design**: Mobile-friendly admin interface

## 🛠 Tech Stack

### Core Technologies
- **Next.js 15** - React framework with App Router and Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Motion (motion.dev)** - Animation library for smooth transitions

### Database & Backend
- **PostgreSQL** - Relational database
- **Supabase** - Backend-as-a-Service for auth, storage, and real-time features
- **Drizzle ORM** - Type-safe database access layer
- **Server Actions** - Next.js server-side form handling

### Form Handling & Validation
- **React Hook Form** - Performant form library
- **Zod** - Schema validation
- **@hookform/resolvers** - Form validation integration

### Development Tools
- **Biome** - Fast formatter and linter
- **TypeScript** - Static type checking
- **Drizzle Kit** - Database migrations and introspection

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd margaret-kuofie-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DATABASE_URL=your_database_url
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the migration file in your Supabase SQL editor:
     ```sql
     -- Execute the contents of supabase/migrations/create_blog_tables.sql
     ```

5. **Generate database types**
   ```bash
   npm run db:generate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗃 Database Schema

### Blog Posts Table
- **id**: UUID primary key
- **title**: Post title (max 255 chars)
- **slug**: URL-friendly identifier
- **excerpt**: Brief description (max 500 chars)
- **content**: Full post content (Markdown supported)
- **featured_image**: Optional featured image URL
- **images**: Array of additional image URLs
- **author_name**: Author name (defaults to "Margaret E. Kuofie")
- **author_avatar**: Optional author avatar URL
- **category**: Post category
- **tags**: Array of tags
- **status**: draft | published | archived
- **published_at**: Publication timestamp
- **reading_time**: Estimated reading time in minutes
- **views**: View count
- **likes**: Like count
- **created_at/updated_at**: Timestamps

### Blog Categories Table
- **id**: UUID primary key
- **name**: Category name
- **slug**: URL-friendly identifier
- **description**: Optional description
- **color**: Hex color code for UI
- **created_at/updated_at**: Timestamps

## 🔐 Security

- **Row Level Security (RLS)**: Enabled on all tables
- **Public Read Access**: Published posts are publicly readable
- **Authenticated Write Access**: Only authenticated users can manage content
- **Input Validation**: Zod schemas validate all form inputs
- **SQL Injection Protection**: Drizzle ORM provides safe query building

## 📱 Pages & Routes

### Public Pages
- `/` - Homepage with hero, featured books, and latest posts
- `/about` - Author biography and background
- `/books` - Book showcase with individual book pages
- `/books/[slug]` - Individual book details
- `/blog` - Blog listing with search and filters
- `/blog/[slug]` - Individual blog post pages
- `/speaking` - Speaking engagements and testimonials
- `/contact` - Contact form and information

### Admin Pages
- `/dashboard` - Blog management dashboard
- `/dashboard?tab=create` - Create new blog post
- `/dashboard?tab=analytics` - Blog analytics (coming soon)
- `/dashboard?tab=settings` - Blog settings (coming soon)

## 🎨 Styling & Design

### Design System
- **Colors**: Blue and purple gradient theme with semantic color usage
- **Typography**: Geist Sans and Geist Mono fonts
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable UI components with consistent styling
- **Responsive**: Mobile-first design with proper breakpoints

### Animation Guidelines
- **Page Transitions**: Smooth fade and slide animations
- **Micro-interactions**: Hover states and button feedback
- **Loading States**: Skeleton screens and spinners
- **Form Feedback**: Success and error state animations

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 📝 Content Management

### Creating Blog Posts
1. Navigate to `/dashboard`
2. Click "Create Post" or use the "New Post" button
3. Fill in title, content (Markdown supported), excerpt, and metadata
4. Add featured image and additional images as needed
5. Select category and add tags
6. Choose to save as draft or publish immediately

### Managing Categories
- Default categories are created during migration
- Categories can be managed through the database or future admin interface
- Each category has a color for visual organization

### Content Guidelines
- **Titles**: Keep under 255 characters for SEO
- **Excerpts**: Brief, engaging summaries under 500 characters
- **Content**: Use Markdown for formatting
- **Images**: Optimize images before upload
- **Tags**: Use relevant, searchable tags

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run Biome linter
- `npm run biome:ts` - Format TypeScript files
- `npm run biome:tsx` - Format TSX files
- `npm run db:generate` - Generate database types
- `npm run db:migrate` - Run database migrations

### Code Style
- **Biome**: Configured for consistent formatting and linting
- **TypeScript**: Strict mode enabled for type safety
- **Double Quotes**: Consistent string formatting
- **Semicolons**: Used as needed for clarity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and test thoroughly
4. Run linting: `npm run lint`
5. Commit your changes: `git commit -m 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

## 📄 License

This project is private and proprietary. All rights reserved.

## 📞 Support

For questions or support, please contact:
- **Email**: mkuofie@gmail.com
- **Phone**: +1 (905) 920-2488
- **Location**: Ontario, Canada

---

Built with ❤️ for Margaret E. Kuofie - Author & Storyteller