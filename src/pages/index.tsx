import Head from 'next/head'
// @ts-ignore
import dataYaml from '/public/application.yaml'
import HeaderForm from "@/components/HeaderForm";
import Hero from "@/components/Hero";
import Error from "@/components/Error";
import Form from "@/components/Form";

export default function Home() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge"/>
        <title>{dataYaml.bitpay.design.hero.title}</title>
      </Head>
      <HeaderForm/>
      <main>
        <Hero/>
        <div className="m-auto mt-6 max-w-3xl px-5 pb-5">
          <Error/>
          <Form/>
        </div>
      </main>
    </>
  )
}

