'use client';
import UserTab from "@/components/layout/usertab";
import { AdminChecker } from "../../components/AdminChecker";
import { useEffect, useState } from "react";
import Link from "next/link"

export default function UsersPage() {

    const { adminInfoFetching: adminLoading, isAdmin: adminData } = AdminChecker();
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        fetch('/api/users').then(res => {
            res.json().then(users => {
                setUserList(users);
            })
        })
    }, [])

    if (adminLoading) {
        return 'Fetching Information. Wait !'
    }

    if (!adminData.admin) {
        return 'You are not an Admin';
    }

    return (
        <section className="max-w-2xl mx-auto mt-8">
            <UserTab isAdmin={true} />
            <div className="mt-8">
                {userList.length > 0 && userList.map(user => (
                    <div key={user._id} className="bg-gray-100 rounded-lg mb-2 p-1 px-4 flex items-center gap-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 grow">
                            <div className="text-gray-900">
                                {!!user.name && (
                                    <span>
                                        {user.name}
                                    </span>
                                )}
                                {!user.name && (
                                    <span className="italic">
                                        No Name
                                    </span>
                                )}
                            </div>
                            <span className="text-gray-500">{user.email}</span>
                        </div>
                        <div>
                            <Link className="button" href={'/users/' + user._id}>
                                Edit
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}