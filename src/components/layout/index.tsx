import Notification, { SHOWING_TIME } from "components/molecules/notification";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { AppStoreInterface, useAppStore } from "store";

const Layout: React.FC = ({ children }) => {
  const [{ notification }, updateStore] = useAppStore();
  const { show: showNotification, message, type } = notification;
  const [timeoutValue, setTimeoutValue] = useState<
    NodeJS.Timeout | undefined
  >();

  useEffect(() => {
    if (showNotification && type !== "pending") {
      timeoutValue && clearTimeout(timeoutValue);
      const newTimeoutValue = setTimeout(() => {
        updateStore((draft: AppStoreInterface) => {
          draft.notification = {
            show: false,
            message: "",
            type: undefined,
          };
        });
        setTimeoutValue(newTimeoutValue);
      }, SHOWING_TIME);
    }
  }, [showNotification, type]);

  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/font/tex-gyre-adventor-regular/tex-gyre-adventor-regular.woff"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/font/tex-gyre-adventor-regular/tex-gyre-adventor-regular.woff2"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/font/tex-gyre-adventor-bold/tex-gyre-adventor-bold.woff"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/font/tex-gyre-adventor-bold/tex-gyre-adventor-bold.woff2"
          as="font"
          crossOrigin=""
        />
      </Head>
      <body>
        <Notification show={showNotification} type={type} summary={message} />
        {children}
      </body>
    </>
  );
};

export default Layout;
