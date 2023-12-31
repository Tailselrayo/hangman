import { AppProps } from 'next/app';
import Head from 'next/head';
import {  Box, MantineProvider } from '@mantine/core';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
      >
        <Box miw="100vw" mih="100vh" bg="dark">
          <Component {...pageProps} />
        </Box>
      </MantineProvider>
    </>
  );
}