'use client';
import Image from "next/image";
import MenuItem from "../menu/menuitem";
import SectionHeader from "./sectionheaders";
import { useEffect, useState } from "react";

export default function Menu() {

    const [latestSellers, setLatestSellers] = useState([]);

    useEffect(() => {
        fetch('/api/menuitems').then(res => {
            res.json().then(menuItems => {
                const latestItems = menuItems.slice(-6);
                setLatestSellers(latestItems);
            })
        })
    },[])

    return (
        <section>
            <div className="absolute left-0 right-0 w-full justify-start">
                <div className="absolute left-0 -top-[70px] text-left -z-10">
                    <Image src={'/salad1.png'} width={109} height={189} alt={'Salad'}></Image>
                </div>
                <div className="absolute -top-[100px] right-0 -z-10">
                    <Image src={'/salad2.png'} width={107} height={195} alt={'Salad'}></Image>
                </div>
            </div>
            <div className="text-center mb-4">
                <SectionHeader subHeader={'check out'} mainHeader={'Latest Arrivals'} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
                {latestSellers.length > 0 && latestSellers.map(item => (
                    <MenuItem key={item._id} {...item} />
                ))}
            </div>
        </section>
    )
}