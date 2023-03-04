import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html data-theme="winter">
      <Head />
      <body className="bg-gray-50 min-h-screen" >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
