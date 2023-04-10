import Head from 'next/head';
import config from '@/config';
import Hero from '@/components/Hero';
import Form from '@/components/Form';

export default function Home() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>{config.bitpay.design.hero.title}</title>
      </Head>
      <main>
        <Hero />
        <div className="m-auto mt-6 max-w-3xl px-5 pb-5">
          <Form />
        </div>
      </main>
    </>
  );
}
