import { AppProps } from 'next/app';
import Head from 'next/head';
import { AppShell, Box, MantineProvider } from '@mantine/core';

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
        <Box w="100vw" h="100vh" bg="dark">
          <Component {...pageProps} />
        </Box>
      </MantineProvider>
    </>
  );
}