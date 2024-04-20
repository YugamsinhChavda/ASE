'use client';

import { cartContext } from "@/components/appcontext";
import SectionHeader from "@/components/layout/sectionheaders";
import { useContext, useEffect, useState } from "react";
import Trash from "@/components/icons/trash";
import { AdminChecker } from "@/components/AdminChecker";
import Image from "next/image";
import toast from "react-hot-toast";

export default function CartPage() {
    const { cartItems, calculateTotalPrice, removeFromCart } = useContext(cartContext);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const { adminInfoFetching: adminLoading, isAdmin: adminData } = AdminChecker();

    useEffect(() => {
        if(typeof window !== 'undefined'){
            if(window.location.href.includes('canceled=1')){
                toast.error('Payment Failed');
            }
        }
    }, []);

    useEffect(() => {
        const { phoneNumber, streetAddress, postalCode, city, country } = adminData;
        setPhoneNumber(phoneNumber);
        setStreetAddress(streetAddress);
        setPostalCode(postalCode);
        setCity(city);
        setCountry(country);
    }, [adminData])

    let totalPrice = 0;
    for (const item of cartItems) {
        totalPrice += calculateTotalPrice(item);
    }

    async function Checkout(ev) {
        ev.preventDefault();

        const promise = new Promise((resolve, reject) => {
            fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cartItems,
                    streetAddress,
                    postalCode,
                    phoneNumber,
                    city,
                    country
                })
            }).then(async (response) => {
                if(response.ok){
                    resolve();
                    window.location = await response.json();
                }
                else{
                    reject();
                }
            })
        });

        await toast.promise(promise, {
            loading: 'Processing your payment',
            success: 'Redirecting to Payment',
            error: 'Something went wrong'
        })

    }

    if(cartItems?.length == 0) {
        return (
            <section className="mt-8 text-center">
                <SectionHeader mainHeader="Cart" />
                <p className="mt-4">Your shopping cart is empty</p>
            </section>
        )
    }

    return (
        <section className="mt-8">
            <div className="text-center">
                <SectionHeader mainHeader="Cart" />
            </div>
            <div className="grid grid-cols-2 gap-8 mt-8">
                <div>
                    {cartItems?.length === 0 && (
                        <div>No products in the shopping cart</div>
                    )}
                    {cartItems?.length > 0 && cartItems.map((item, index) => (
                        <div className="flex items-center gap-4 border-b py-4">
                            <div className="w-24">
                                <Image width={240} height={240} src={`/Images/${item.image}`} alt="item.image" />
                            </div>
                            <div className="grow">
                                <h3 className="font-semibold">{item.itemName}</h3>
                                <div>
                                    {item.size && (
                                        <div className="text-sm">Size : <span>{item.size.name}</span></div>
                                    )}
                                    {item.extras?.length > 0 && (
                                        <div className="text-sm text-gray-500">
                                            {item.extras.map(extra => (
                                                <div>{extra.name} ${extra.price}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="text-lg font-semibold">
                                ${calculateTotalPrice(item)}
                            </div>
                            <div className="ml-2">
                                <button
                                    type="button"
                                    onClick={() => removeFromCart(index)}
                                    className="p-2">
                                    <Trash />
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="py-2 justify-end pr-16 flex items-center">
                        <div className="text-gray-500">
                            Subtotal : <br />
                            Delivery : <br />
                            Total :
                        </div>
                        <div className="font-semibold pl-2 text-right">
                            ${totalPrice} <br />
                            $5 <br />
                            ${totalPrice + 5}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h2>Checkout</h2>
                    <form onSubmit={Checkout}>
                        <label>Phone Number</label>
                        <input type="tel" placeholder="Phone Number"
                            value={phoneNumber} onChange={ev => setPhoneNumber(ev.target.value)}
                        ></input>
                        <label>Street Address</label>
                        <input type="text" placeholder="Street address"
                            value={streetAddress} onChange={ev => setStreetAddress(ev.target.value)}
                        ></input>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label>City</label>
                                <input type="text" placeholder="City"
                                    value={city} onChange={ev => setCity(ev.target.value)}
                                ></input>
                            </div>
                            <div>
                                <label>Postal Code</label>
                                <input type="text" placeholder="Postal Code"
                                    value={postalCode} onChange={ev => setPostalCode(ev.target.value)}
                                ></input>
                            </div>
                        </div>
                        <label>Country</label>
                        <input type="text" placeholder="Country"
                            value={country} onChange={ev => setCountry(ev.target.value)}
                        ></input>
                        <button type="submit">
                            Pay ${totalPrice + 5}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}