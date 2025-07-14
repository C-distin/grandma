import { BlogPost, BlogCategory } from '@/types/blog'

export const mockCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'Writing Tips',
    slug: 'writing-tips',
    description: 'Advice and techniques for better writing',
    color: '#3B82F6'
  },
  {
    id: '2',
    name: 'Book Reviews',
    slug: 'book-reviews',
    description: 'Reviews and recommendations',
    color: '#10B981'
  },
  {
    id: '3',
    name: 'Personal Stories',
    slug: 'personal-stories',
    description: 'Personal experiences and reflections',
    color: '#8B5CF6'
  },
  {
    id: '4',
    name: 'Research Insights',
    slug: 'research-insights',
    description: 'Clinical research and healthcare insights',
    color: '#F59E0B'
  }
]

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of Storytelling in Clinical Research',
    slug: 'art-of-storytelling-clinical-research',
    excerpt: 'How narrative techniques can make complex medical research more accessible and engaging for readers.',
    content: `# The Art of Storytelling in Clinical Research

Clinical research often feels dry and inaccessible to the general public. But what if we could change that through the power of storytelling?

## Why Stories Matter in Science

Stories have been humanity's primary method of sharing knowledge for millennia. When we wrap scientific findings in narrative, we make them:

- More memorable
- Easier to understand
- Emotionally engaging
- Personally relevant

## Techniques for Scientific Storytelling

### 1. Start with a Human Element
Every research study affects real people. Begin with their stories.

### 2. Use Analogies and Metaphors
Complex processes become clearer when compared to familiar concepts.

### 3. Show the Journey
Research isn't just about results—it's about the process of discovery.

## Conclusion

By combining rigorous science with compelling narrative, we can bridge the gap between research and public understanding.`,
    featuredImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
    images: [
      'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
      'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg'
    ],
    author: {
      name: 'Margaret E. Kuofie',
      avatar: '/margaret-profile.jpg'
    },
    category: 'Research Insights',
    tags: ['storytelling', 'research', 'communication', 'science'],
    status: 'published',
    publishedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    readingTime: 5,
    views: 1247,
    likes: 89
  },
  {
    id: '2',
    title: 'Finding Your Voice as a Writer',
    slug: 'finding-your-voice-as-writer',
    excerpt: 'Discovering and developing your unique writing voice is a journey of self-discovery and practice.',
    content: `# Finding Your Voice as a Writer

Your writing voice is as unique as your fingerprint. It's the distinctive way you express ideas, the rhythm of your sentences, and the personality that shines through your words.

## What is Writing Voice?

Writing voice encompasses:
- Tone and style
- Word choice and vocabulary
- Sentence structure and rhythm
- Perspective and worldview

## Developing Your Voice

### Read Widely
Exposure to different styles helps you understand what resonates with you.

### Write Regularly
Consistency in practice helps your natural voice emerge.

### Be Authentic
Don't try to imitate others—embrace what makes you unique.

## Conclusion

Your voice will evolve over time, and that's perfectly natural. The key is to keep writing and stay true to yourself.`,
    featuredImage: 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg',
    images: ['https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg'],
    author: {
      name: 'Margaret E. Kuofie',
      avatar: '/margaret-profile.jpg'
    },
    category: 'Writing Tips',
    tags: ['writing', 'voice', 'creativity', 'tips'],
    status: 'published',
    publishedAt: new Date('2024-01-20'),
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20'),
    readingTime: 4,
    views: 892,
    likes: 67
  },
  {
    id: '3',
    title: 'Behind the Scenes: Writing My Latest Book',
    slug: 'behind-scenes-writing-latest-book',
    excerpt: 'A personal look at the challenges and triumphs of writing "Behind Closed Doors: Guarding Your Dreams".',
    content: `# Behind the Scenes: Writing My Latest Book

Writing "Behind Closed Doors: Guarding Your Dreams" was both the most challenging and rewarding project I've undertaken.

## The Inspiration

The idea came from observing how people share their dreams too early, often leading to discouragement and abandoned goals.

## The Writing Process

### Research Phase
I spent months interviewing people about their experiences with sharing vs. guarding their aspirations.

### First Draft Struggles
The first draft was terrible—and that's okay! First drafts are meant to be messy.

### Revision and Refinement
The real magic happened during revision, where the core message became clear.

## Lessons Learned

- Trust the process
- Embrace imperfection
- Listen to your inner voice
- Don't rush the journey

## What's Next?

I'm already working on my next project, exploring the intersection of faith and daily decision-making.`,
    featuredImage: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg',
    images: [
      'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg',
      'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg'
    ],
    author: {
      name: 'Margaret E. Kuofie',
      avatar: '/margaret-profile.jpg'
    },
    category: 'Personal Stories',
    tags: ['writing process', 'book', 'personal', 'dreams'],
    status: 'draft',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    readingTime: 6,
    views: 0,
    likes: 0
  }
]