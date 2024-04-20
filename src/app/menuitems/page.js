'use client';
import UserTab from "@/components/layout/usertab";
import { AdminChecker } from "../../components/AdminChecker";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

export default function MenuItemsPage() {

    const { adminInfoFetching: adminLoading, isAdmin: adminData } = AdminChecker();
    const [menuItemsList, setMenuItemsList] = useState([]);



    useEffect(() => {
        fetch('/api/menuitems').then(res => {
            res.json().then(menuitems => {
                setMenuItemsList(menuitems);
            });
        })
    }, []);

    if (adminLoading) {
        return 'Fetching Information. Wait !'
    }

    if (!adminData.admin) {
        return 'You are not an Admin';
    }



    return (
        <section className="mt-8 max-w-2xl mx-auto">
            <Toaster position="top-center" />
            <UserTab isAdmin={true} />
            <div className="mt-8 text-center">
                <Link
                    className="button"
                    href={'/menuitems/newitem'}>
                    New Menu Item
                </Link>
            </div>
            <div>
                <h2 className="text-sm text-gray-500 mt-8">Edit Menu Items</h2>
                <div className="grid grid-cols-3 gap-2">
                    {menuItemsList?.length > 0 && menuItemsList.map(item => (
                        <Link href={'/menuitems/edititem/' + item._id}
                            className="bg-gray-200 rounded-lg p-4" key={item._id}>
                            <div className="relative">
                                {item.image && (
                                    <Image className="rounded-lg w-full h-full mb-1" src={`/Images/${item.image}`} width={200} height={200} alt={'avatar'} />
                                )}
                                {!item.image && (
                                    <div className="text-center bg-gray-200 p-4 text-gray-500 rounded-lg mb-1">
                                        No image
                                    </div>
                                )}
                            </div>
                            <div className="text-center">
                                {item.itemName}
                            </div>
                            {/* <div>
                                {item.itemDesc}
                            </div> */}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}