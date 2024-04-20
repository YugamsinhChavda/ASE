'use client';
import UserTabs from "../../../components/layout/usertab";
import { AdminChecker } from "../../../components/AdminChecker";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function EditUserPage() {

    const { adminInfoFetching: adminLoading, isAdmin: adminData } = AdminChecker();
    const [Name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const { id } = useParams();
    const [user, SetUser] = useState(null);
    const userSession = useSession();
    const { status } = userSession;
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetch('/api/users').then(res => {
            res.json().then(users => {
                const user = users.find(u => u._id === id);
                SetUser(user);
                setName(user.name);
                setEmail(user.email);
                setPhoneNumber(user.phoneNumber);
                setStreetAddress(user.streetAddress);
                setCity(user.city);
                setPostalCode(user.postalCode);
                setCountry(user.country);
                setIsAdmin(user.admin);
            })
        })
    }, [])

    async function handleDataSubmit(ev) {

        ev.preventDefault();
        const promise = new Promise(async (resolve, reject) => {
            const response = await fetch('/api/userprofile', {
                method: 'PUT',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({
                    _id: id,
                    name: Name,
                    streetAddress: streetAddress,
                    postalCode: postalCode,
                    city: city,
                    phoneNumber: phoneNumber,
                    country: country,
                    admin: isAdmin
                })
            })
            if (response.ok) {
                resolve();
            }
            else {
                reject();
            }
        });
        await toast.promise(promise, {
            loading: 'Updating user details',
            success: 'User details updated successfully',
            error: 'Error',
        });


        
        
    }


    if (adminLoading) {
        return 'Fetching Information. Wait !'
    }

    if (!adminData.admin) {
        return 'You are not an Admin';
    }

    return (
        <section className="mt-8 mx-auto max-w-2xl">
            <Toaster position="top-center" />
            <UserTabs isAdmin={true} />

            <div className="mt-8 text-center">
                <Link
                    className="button"
                    href={'/users'}>
                    Users List
                </Link>
            </div>
            <div className="mt-8">
                <div className="flex gap-2 items-center">
                    <form className="grow" onSubmit={handleDataSubmit}>
                        <label>Full Name</label>
                        <input type="text" placeholder="Full Name"
                            value={Name} onChange={ev => setName(ev.target.value)}
                        ></input>
                        <label>Email</label>
                        <input type="email" value={email} disabled={true}></input>
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
                        {adminData.admin && (
                            <div>
                                <label className="p-2 inline-flex items-center gap-2 mb-2" htmlFor="adminCheckbox">
                                    <input
                                        id="adminCheckbox" type="checkbox" value={'1'}
                                        checked={isAdmin}
                                        onChange={ev => setIsAdmin(ev.target.checked)}
                                    ></input>
                                    <span>Admin</span>
                                </label>
                            </div>
                        )}
                        <button type="submit">Update Details</button>
                    </form>
                </div>
            </div>
        </section>
    );
}