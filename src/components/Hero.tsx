// @ts-ignore
import dataYaml from '/public/application.yaml'

const Hero = () => {
return (
  <div id="hero" className="relative" style={{backgroundColor: dataYaml.bitpay.design.hero.bgColor}}>
    <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-center">{dataYaml.bitpay.design.hero.title}</h1>
      <p className="mt-6 text-xl text-white max-w-3xl text-center m-auto">{dataYaml.bitpay.design.hero.body}</p>
    </div>
  </div>
)}

export default Hero;