import React, {useEffect} from 'react';
import remark from 'remark';
import html from 'remark-html';
import {
  getPostBySlug,
  getAllPosts,
  getNextPost,
  getPrevPost,
} from '../lib/blog';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FacebookProvider, Like, Comments } from 'react-facebook';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import Author from '../components/Author';

let easing = [0.175, 0.85, 0.42, 0.96];

const imageVariants = {
  exit: { y: 150, opacity: 0, transition: { duration: 0.5, ease: easing } },
  enter: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easing,
    },
  },
};

const textVariants = {
  exit: { y: 100, opacity: 0, transition: { duration: 0.5, ease: easing } },
  enter: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.1, duration: 0.5, ease: easing },
  },
};

const backVariants = {
  exit: {
    x: 100,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: easing,
    },
  },
  enter: {
    x: 0,
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.5,
      ease: easing,
    },
  },
};

export default function BlogTemplatePost({ content, next, prev, ...rest }) {
  useEffect(() => {
    Prism.highlightAll();
  });
  //Due to a legacy bug which we must have '/' at the end to enable facebook comments loaded
  const href = `https://www.kysumattien.com/${rest.slug}/`.toLowerCase();
  return (
    <>
      <SEO
        title={rest.frontmatter.title}
        description={rest.frontmatter.description}
        image={rest.frontmatter.featuredImgUrl}
        url={href}
      />
      <FacebookProvider appId="3364552500258287">
        <article className="post">
          <motion.div initial="exit" animate="enter" exit="exit">
            <div className="post-header">
              <h1 className="post-title">{rest.frontmatter.title}</h1>
              <div className="post-info">
                <Author />
                <time>{rest.frontmatter.date}</time>
              </div>
              <div className="image-wrap">
                <motion.div variants={imageVariants}>
                  <Image
                    src={rest.frontmatter.featuredImgUrl}
                    alt={rest.frontmatter.featuredImgAlt}
                    title={rest.frontmatter.featuredImgAlt}
                    layout="responsive"
                    width={500}
                    height={500}
                  />
                </motion.div>
              </div>
            </div>
            <motion.div variants={textVariants}>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </motion.div>
            <div className="facebook-actions">
              <Like
                showFaces
                size={
                  typeof window !== 'undefined' && window.innerWidth > 768
                    ? 'large'
                    : 'small'
                }
                layout={
                  typeof window !== 'undefined' && window.innerWidth > 768
                    ? 'standard'
                    : 'button_count'
                }
                share
                href={href}
              />
              <Comments width={'100%'} href={href} target="_top" />
            </div>
            <div className="pre-next-navigator">
              {prev && (
                <Link href={prev.slug}>
                  <a className="pre-link" title={prev.frontmatter.title}>
                    {prev.frontmatter.title}
                  </a>
                </Link>
              )}
              {next && (
                <Link href={next.slug}>
                  <a className="next-link" title={next.frontmatter.title}>
                    {next.frontmatter.title}
                  </a>
                </Link>
              )}
            </div>
          </motion.div>
        </article>
      </FacebookProvider>
    </>
  );
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  const nextPost = getNextPost(params.slug);
  const prevPost = getPrevPost(params.slug);
  const markdown = await remark()
    .use(html)
    .process(post.content || '');
  const content = markdown.toString();

  return {
    props: {
      ...post,
      next: nextPost ? nextPost : null,
      prev: prevPost ? prevPost : null,
      content,
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts();

  return {
    paths: posts.map(post => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
