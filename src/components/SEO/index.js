import Head from 'next/head';
import config from '../../config';

export default function SEO({ description, title, image, url }) {
  const siteTitle = config.title;

  return (
    <Head>
      <title>{`${title} | ${siteTitle}`}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:url" content={url} />
      <meta property="og:description" content={description} />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="fb:app_id" content="3364552500258287" />
      <meta
        property="og:image"
        content={
          image || 'https://toidicodedao.files.wordpress.com/2018/07/react.png'
        }
      />
      <meta
        name="google-site-verification"
        content="vuwDsOPCzcbXtX1bGByYmD1hVpkhSJhBBSc_ILG_wmo"
      />
    </Head>
  );
}
