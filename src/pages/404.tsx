import { useRouter } from "next/router";
import { useEffect } from "react";
import ErrorPage from "next/error";

export default function Custom404() {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 1000);
  });
  return <ErrorPage statusCode={404} />;
}
