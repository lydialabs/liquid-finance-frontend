import Layout from "components/layout";
import ThemeProvider, {
  FixedGlobalStyle,
  ThemedGlobalStyle,
} from "components/theme";
import type { AppProps } from "next/app";
import { AppStore } from "store";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AppStore.Provider>
      <FixedGlobalStyle />
      <ThemeProvider>
        <ThemedGlobalStyle />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </AppStore.Provider>
  );
};

export default MyApp;
