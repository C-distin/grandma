/*
  # Create blog tables

  1. New Tables
    - `blog_categories`
      - `id` (uuid, primary key)
      - `name` (varchar, unique)
      - `slug` (varchar, unique)
      - `description` (text)
      - `color` (varchar)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (varchar)
      - `slug` (varchar, unique)
      - `excerpt` (text)
      - `content` (text)
      - `featured_image` (text)
      - `images` (text array)
      - `author_name` (varchar)
      - `author_avatar` (text)
      - `category` (varchar)
      - `tags` (text array)
      - `status` (varchar)
      - `published_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `reading_time` (integer)
      - `views` (integer)
      - `likes` (integer)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated write access
*/

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL UNIQUE,
  slug varchar(100) NOT NULL UNIQUE,
  description text,
  color varchar(7) NOT NULL DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(255) NOT NULL,
  slug varchar(255) NOT NULL UNIQUE,
  excerpt text NOT NULL,
  content text NOT NULL,
  featured_image text,
  images text[],
  author_name varchar(100) NOT NULL DEFAULT 'Margaret E. Kuofie',
  author_avatar text,
  category varchar(100) NOT NULL,
  tags text[] NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  reading_time integer NOT NULL DEFAULT 5,
  views integer NOT NULL DEFAULT 0,
  likes integer NOT NULL DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_categories
CREATE POLICY "Allow public read access to categories"
  ON blog_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage categories"
  ON blog_categories
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for blog_posts
CREATE POLICY "Allow public read access to published posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Allow authenticated users to read all posts"
  ON blog_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);

-- Insert default categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
  ('Writing Tips', 'writing-tips', 'Advice and techniques for better writing', '#3B82F6'),
  ('Book Reviews', 'book-reviews', 'Reviews and recommendations', '#10B981'),
  ('Personal Stories', 'personal-stories', 'Personal experiences and reflections', '#8B5CF6'),
  ('Research Insights', 'research-insights', 'Clinical research and healthcare insights', '#F59E0B')
ON CONFLICT (slug) DO NOTHING;