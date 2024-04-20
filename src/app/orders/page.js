'use client';

import { AdminChecker } from "@/components/AdminChecker";
import SectionHeader from "@/components/layout/sectionheaders";
import UserTab from "@/components/layout/usertab";
import { TimeConversion } from "@/libs/dateTimeConvertor";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrdersPage() {

    const [orders, setOrder] = useState([]);
    const { adminInfoFetching: adminLoading, isAdmin: adminData } = AdminChecker();
    const [fetchingOrders, setFetchingOrders] = useState(true);
    
    useEffect(() => {
        getOrders();
    }, []);

    function getOrders(){
        setFetchingOrders(true);
        fetch('/api/orders').then(res => {
            res.json().then(orders => {
                setOrder(orders.reverse());
                setFetchingOrders(false);
            })
        })
    }

    return (
        <section className="mt-8 max-w-2xl-mx-auto">
            <UserTab isAdmin={adminData.admin} />
            <div className="mt-8">
                {fetchingOrders && (
                    <div>Fetching Orders. Please Wait</div>
                )}
                {orders?.length > 0 && orders.map(order => (
                    <div key={order._id} className="bg-gray-100 mb-2 p-4 rounded-lg flex flex-col md:flex-row items-center gap-6">
                        <div className="grow flex flex-col md:flex-row items-center gap-6">
                            <div>
                                <div className={(order.paid ? 'bg-green-500' : 'bg-red-400') + ' p-2 rounded-md text-white w-24 text-center'}>
                                    {order.paid ? 'Paid' : 'Unpaid'}
                                </div>
                            </div>
                            <div className="grow">
                                <div className="flex gap-2 items-center mb-1">
                                    <div className="grow">
                                        {order.email}
                                    </div>
                                    <div className="text-gray-500 text-sm">
                                        {TimeConversion(order.createdAt)}
                                    </div>
                                </div>
                                <div className="text-gray-500 text-xs">
                                    {order.cartItems.map(item => item.itemName).join(', ')}
                                </div>
                            </div>
                        </div>
                        <div className="justify-end flex gap-2 items-center whitespace-nowrap">
                            <Link href={"/orders/" + order._id} className="button">
                                Show Order
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}