import Head from "next/head";

export default function Meta({ title, index }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="robots" content={index ? "index" : "noindex"} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
  );
}
