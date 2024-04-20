import Hero from "../components/layout/hero";
import Menu from "../components/layout/homemenu";
import SectionHeader from "../components/layout/sectionheaders";

export default function Home() {
  return (
    <>
      <Hero />
      <Menu />
      <section className="text-center my-16" id="about">
        <SectionHeader subHeader={'Our story'} mainHeader={'About us'} />
        <div className="text-gray-500 max-w-md mx-auto mt-4 flex flex-col gap-4">
          <p>
            Welcome to EatBuddy, where we believe that food isn't just about sustenance, but a journey of flavors, cultures, and memories served right to your doorstep.
            Born out of a love for diversity in dining and the convenience technology brings, our platform connects you with a myriad of local and international cuisines from the comfort of your home.
            Whether you're craving the warmth of homemade lasagna on a chilly evening,
            the zesty punch of street-style tacos, or the subtle sophistication of sushi, our app is your gateway to a world of culinary delights.
          </p>
          <p>At EatBuddy, we're more than just a food ordering service. We're a community that celebrates local chefs, embraces sustainable practices,
            and supports small businesses while ensuring a seamless and delightful experience for our users. Every meal ordered is a story of tradition, passion,
            and innovation, carefully prepared and delivered with care.
            Join us on this delicious adventure, where every dish tells a story and every order brings you closer to the world's flavors.
          </p>
        </div>
      </section>
      <section className="text-center my-8" id="contact">
        <SectionHeader subHeader={'Don\'t Hesitate'} mainHeader={'Contact Us'} />
        <div className="mt-8">
          <a className="text-4xl underline text-gray-500" href='tel: +1 (738)1231234'>
            +1 738 123 1234
          </a>
        </div>
      </section>
    </>
  );
}
