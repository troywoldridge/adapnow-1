import React from "react";
import Head from "next/head";

interface SEOProps {
  /* Basic Meta */
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;

  /* Canonical */
  canonicalUrl?: string;

  /* Open Graph */
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogImage?: string;
  ogSiteName?: string;
  ogType?: string; // e.g. "website", "article", "product"

  /* Twitter */
  twitterCard?: string; // e.g. "summary_large_image"
  twitterSite?: string; // e.g. "@YourSiteHandle"
  twitterCreator?: string; // e.g. "@AuthorHandle"
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;

  /* Structured Data (JSON-LD) */
  structuredData?: { [key: string]: unknown };

  /* (Optional) Robots meta tag */
  // robots?: string; // e.g. "index,follow" or "noindex,nofollow"

  /* (Optional) Hreflang tags */
  // hreflang?: Array<{ hrefLang: string; href: string }>;
}

const SEO: React.FC<SEOProps> = ({
  /* Basic Meta */
  title,
  description,
  keywords,
  author,

  /* Canonical */
  canonicalUrl,

  /* Open Graph */
  ogTitle,
  ogDescription,
  ogUrl,
  ogImage,
  ogSiteName,
  ogType,

  /* Twitter */
  twitterCard,
  twitterSite,
  twitterCreator,
  twitterTitle,
  twitterDescription,
  twitterImage,

  /* Structured Data (JSON-LD) */
  structuredData,

  /* (Optional) Robots */
  // robots,

  /* (Optional) Hreflang */
  // hreflang,
}) => {
  /* ---------- 1. DEFAULT VALUES ---------- */
  const defaultTitle = "AdapNow E-Commerce";
  const defaultDescription =
    "AdapNow is your go-to e-commerce destination for high-quality print products. From business cards to banners, we've got you covered.";
  const defaultKeywords =
    "ecommerce, print products, business cards, postcards, banners, AdapNow, marketing, printing services";
  const defaultAuthor = "AdapNow";
  const defaultUrl = "https://www.adapnow.com";
  const defaultImage = "/og-image.jpg";
  const defaultSiteName = "AdapNow E-Commerce";
  const defaultTwitterCard = "summary_large_image";

  /* ---------- 2. MERGED VALUES ---------- */
  const pageTitle = title || defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageKeywords = keywords || defaultKeywords;
  const pageAuthor = author || defaultAuthor;

  const canonical = canonicalUrl || defaultUrl;

  /* Open Graph */
  const ogFullTitle = ogTitle || pageTitle;
  const ogFullDescription = ogDescription || pageDescription;
  const ogFullUrl = ogUrl || defaultUrl;
  const ogFullImage = ogImage || defaultImage;
  const ogFullSiteName = ogSiteName || defaultSiteName;
  const ogFullType = ogType || "website";

  /* Twitter */
  const twCard = twitterCard || defaultTwitterCard;
  const twSite = twitterSite || "@AdapNowOfficial";
  const twCreator = twitterCreator || "@AdapNowOfficial";
  const twTitle = twitterTitle || pageTitle;
  const twDescription = twitterDescription || pageDescription;
  const twImage = twitterImage || defaultImage;

  /* ---------- 3. STRUCTURED DATA ---------- */
  // Default organization schema
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AdapNow",
    url: defaultUrl,
    logo: `${defaultUrl}/logo.png`,
    sameAs: [
      "https://www.facebook.com/AdapNow",
      "https://www.twitter.com/AdapNow",
      "https://www.instagram.com/AdapNow",
    ],
  };

  // Merge default with any user-provided structured data
  const mergedStructuredData = structuredData
    ? { ...defaultStructuredData, ...structuredData }
    : defaultStructuredData;

  /* ---------- 4. RETURN ---------- */
  return (
    <Head>
      {/* 1. Basic Meta */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content={pageAuthor} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* 2. Canonical */}
      <link rel="canonical" href={canonical} />

      {/* 3. Open Graph */}
      <meta property="og:title" content={ogFullTitle} />
      <meta property="og:description" content={ogFullDescription} />
      <meta property="og:url" content={ogFullUrl} />
      <meta property="og:image" content={ogFullImage} />
      <meta property="og:site_name" content={ogFullSiteName} />
      <meta property="og:type" content={ogFullType} />

      {/* 4. Twitter */}
      <meta name="twitter:card" content={twCard} />
      <meta name="twitter:site" content={twSite} />
      <meta name="twitter:creator" content={twCreator} />
      <meta name="twitter:title" content={twTitle} />
      <meta name="twitter:description" content={twDescription} />
      <meta name="twitter:image" content={twImage} />

      {/* 5. (Optional) Robots */}
      {/* 
      {robots && <meta name="robots" content={robots} />} 
      */}

      {/* 6. (Optional) Hreflang */}
      {/*
      hreflang?.map(({ hrefLang, href }) => (
        <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={href} />
      ))
      */}

      {/* 7. Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(mergedStructuredData),
        }}
      />
    </Head>
  );
};

export default SEO;
