import '@/styles/bootstrap.min.css';
import 'nprogress/nprogress.css'
import Layout from '@/components/Layout'
import Router from 'next/router'
import { useState, useEffect } from 'react'
import NProgress from 'nprogress';
import Script from 'next/script';
import '@/styles/globals.css'

NProgress.configure({ showSpinner: false });

export default function App({ Component, pageProps }) {
    useEffect(() => {
      const start = () => {
        NProgress.start();
      };
      const end = () => {
        NProgress.done();
      };

      Router.events.on("routeChangeStart", start);
      Router.events.on("routeChangeComplete", end);
      Router.events.on("routeChangeError", end);

      return () => {
        Router.events.off("routeChangeStart", start);
        Router.events.off("routeChangeComplete", end);
        Router.events.off("routeChangeError", end);
      };
    }, [])

    return (
        <>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </>
      )
}