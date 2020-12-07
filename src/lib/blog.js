import matter from 'gray-matter';
import { parseISO, format, isBefore } from 'date-fns';
import fs from 'fs';
import { join } from 'path';

// Add markdown files in `src/content/blog`
const postsDirectory = join(process.cwd(), 'src', 'content', 'blog');

export function getPostBySlug(slug) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const rawDate = data.date;
  const date = format(parseISO(rawDate), 'dd/MM/yyyy');

  return { slug: realSlug, frontmatter: { ...data, date, rawDate }, content };
}

export function getAllPosts() {
  const slugs = fs.readdirSync(postsDirectory);
  const posts = slugs
    .map(slug => getPostBySlug(slug))
    .sort((a, b) => {
      return isBefore(
        parseISO(a.frontmatter.rawDate),
        parseISO(b.frontmatter.rawDate)
      )
        ? 1
        : -1;
    });

  return posts;
}

export function getNextPost(currentPostSlug) {
  const allPosts = getAllPosts();
  // allPosts is already sorted
  const indexOfCurrentPost = allPosts.findIndex(post => {
    return post.slug === currentPostSlug;
  });
  return indexOfCurrentPost < allPosts.length
    ? allPosts[indexOfCurrentPost + 1]
    : null;
}

export function getPrevPost(currentPostSlug) {
  const allPosts = getAllPosts();
  //allPost is already sorted
  const indexOfCurrentPost = allPosts.findIndex(post => {
    return post.slug === currentPostSlug;
  });

  return indexOfCurrentPost > 0 ? allPosts[indexOfCurrentPost - 1] : null;
}
