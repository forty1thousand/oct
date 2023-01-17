import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import { QueryClient, QueryClientProvider } from "react-query";


const clientSideEmotionCache = createEmotionCache();
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}


const reactQueryClient = new QueryClient();

const MyApp = (props: MyAppProps) => {
  const css = `:root {
    color-scheme: dark
  }`
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <QueryClientProvider client={reactQueryClient}>
        <CacheProvider value={emotionCache}>
          <Head>
            <style>
              {css}
            </style>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </CacheProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
