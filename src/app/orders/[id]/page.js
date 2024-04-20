'use client';

import { cartContext } from "@/components/appcontext";
import SectionHeader from "@/components/layout/sectionheaders";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";

export default function OrderPage() {
    const { clearCart, calculateTotalPrice } = useContext(cartContext)
    const { id } = useParams();
    const [orderData, setOrderData] = useState();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [fetchingOrder, setFetchingOrder] = useState(true);

    useEffect(() => {
        if (typeof window.console !== 'undefined') {
            if (window.location.href.includes('clear-cart=1')) {
                clearCart();
            }
        }
        if (id) {
            setFetchingOrder(true);
            fetch('/api/orders?_id=' + id).then(res => {
                res.json().then(order => {
                    setOrderData(order);
                    setFetchingOrder(false);
                    setPhoneNumber(order.phoneNumber);
                    setStreetAddress(order.streetAddress);
                    setPostalCode(order.postalCode);
                    setCity(order.city);
                    setCountry(order.country);
                })
            })
        }
    }, []);

    let totalPrice = 0;
    if (orderData?.cartItems) {
        for (const item of orderData.cartItems) {
            totalPrice += calculateTotalPrice(item);
        }
    }

    return (
        <section className="max-w-2xl mx-auto mt-8">
            <div className="text-center">
                <SectionHeader mainHeader="Order Details" />
                <div className="mt-4 mb-8">
                    <p>Thank you for ordering</p>
                    <p>We will call you when the order is on the way</p>
                </div>
            </div>
            {fetchingOrder && (
                <div>Fetching Order Detail. Please Wait</div>
            )}
            {orderData && (
                <div className="grid md:grid-cols-2 md:gap-16">
                    <div>
                        {orderData.cartItems.map(item => (
                            <div key={item._id} className="flex items-center gap-4 border-b py-4">
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
                                {/* <div className="ml-2">
                            <button
                                type="button"
                                onClick={() => removeFromCart(index)}
                                className="p-2">
                                <Trash />
                            </button>
                        </div> */}
                            </div>
                        ))}
                        <div className="text-right py-2 text-gray-500">
                            Subtotal : <span className="text-black font-bold inline-block w-8">${totalPrice}</span><br />
                            Delivery : <span className="text-black font-bold inline-block w-8">$5</span><br />
                            Total : <span className="text-black font-bold inline-block w-8">${totalPrice + 5}</span><br />
                        </div>
                    </div>
                    <div>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h2>Checkout</h2>
                            <form>
                                <label>Phone Number</label>
                                <input type="tel" placeholder="Phone Number"
                                    value={phoneNumber || ''} disabled={true} onChange={ev => setPhoneNumber(ev.target.value)}
                                ></input>
                                <label>Street Address</label>
                                <input type="text" placeholder="Street address"
                                    value={streetAddress || ''} disabled={true} onChange={ev => setStreetAddress(ev.target.value)}
                                ></input>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label>City</label>
                                        <input type="text" placeholder="City"
                                            value={city || ''} disabled={true} onChange={ev => setCity(ev.target.value)}
                                        ></input>
                                    </div>
                                    <div>
                                        <label>Postal Code</label>
                                        <input type="text" placeholder="Postal Code"
                                            value={postalCode || ''} disabled={true} onChange={ev => setPostalCode(ev.target.value)}
                                        ></input>
                                    </div>
                                </div>
                                <label>Country</label>
                                <input type="text" placeholder="Country"
                                    value={country || ''} disabled={true} onChange={ev => setCountry(ev.target.value)}
                                ></input>
                                {/* <button type="submit">
                            Pay ${totalPrice + 5}
                        </button> */}
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}