import config from '@/config';

export default function Hero() {
  return (
    <div
      id="hero"
      className="relative"
      style={{ backgroundColor: config.bitpay.design.hero.bgColor }}
    >
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-center">
          {config.bitpay.design.hero.title}
        </h1>
        <p className="mt-6 text-xl text-white max-w-3xl text-center m-auto">
          {config.bitpay.design.hero.body}
        </p>
      </div>
    </div>
  );
}
