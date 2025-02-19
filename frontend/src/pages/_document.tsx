import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Meta Tags */}
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="American Design and Printing - High-quality print solutions." />

          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />

          {/* Google Fonts (Example: Inter) */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />

          {/* Any global scripts or styles can be included here */}
        </Head>
        <body className="bg-gray-100 text-gray-900">
          <Main /> {/* Next.js app renders here */}
          <NextScript /> {/* Loads Next.js scripts for hydration */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
