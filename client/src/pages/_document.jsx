import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>WhatsApp</title>
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <div id="photo-picker-element">
          
        </div>
      </body>
    </Html>
  );
}
