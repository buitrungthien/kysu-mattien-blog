// import App from 'next/app'
require('prismjs/themes/prism-tomorrow.css');
require('prismjs/plugins/line-numbers/prism-line-numbers.css');
require('prismjs/plugins/command-line/prism-command-line.css');
import '../scss/main.scss';
import 'react-awesome-button/dist/styles.css';
import { AnimatePresence } from 'framer-motion';
import DefaultLayout from '../layouts/DefaultLayout';

function MyApp({ Component, pageProps, router }) {
  const Layout = Component.Layout ? Component.Layout : DefaultLayout;

  return (
    <Layout>
      <AnimatePresence exitBeforeEnter>
        <Component {...pageProps} key={router.route} />
      </AnimatePresence>
    </Layout>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
