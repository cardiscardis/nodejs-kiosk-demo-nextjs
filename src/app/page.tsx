import Donation from '@/components/Donation';
import Form from '@/components/Form';
import Hero from '@/components/Hero';
import config from '@/config';

export default async function Home() {
  return (
    <>
      {config.bitpay.mode === 'standard' ? (
        <>
          <Hero />
          <div className="m-auto mt-6 max-w-3xl px-5 pb-5">
            <Form />
          </div>
        </>
      ) : (
        <Donation />
      )}
    </>
  );
}
