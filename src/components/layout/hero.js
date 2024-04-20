import Image from "next/image";

export default function Hero() {
    return (
        <section className="hero md:mt-4">
            <div className="py-8 md:py-12">
            <h1 className="text-4xl font-semibold">
                Fast, Fresh<br />Flavorful<br /> - &nbsp; 
                <span className="text-primary">Your Feast Awaits</span>
            </h1>
            <p className="my-6 text-gray-500 text-sm"> 
            One cannot think well, love well, sleep well, if one has not dined well
            </p>
            <div className="flex gap-4 text-sm">
                <button className="bg-primary text-white px-8 py-2 rounded-full text-sm">
                    ORDER NOW
                </button>
                <button className="border-0 text-gray-500 font-semibold">Learn More</button>
            </div>
            </div>
            <div className="relative hidden md:block">
            <Image src={'/pizza.png'} layout={'fill'} objectFit={'contain'} alt={'Pizza'}>
            </Image>
            </div>
        </section>
    );
}