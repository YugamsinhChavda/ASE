'use client';
import { getSession, signIn, useSession } from "next-auth/react"
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import UserTab from "../../components/layout/usertab";
import { AdminChecker } from "@/components/AdminChecker";


export default function UserProfile() {
    const { adminInfoFetching: adminLoading, isAdmin: adminData } = AdminChecker();
    const userSession = useSession();
    const { status } = userSession;
    const [Name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [detailsSaved, setDetailsSaved] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profileFetched, setProfileFetched] = useState(false);

    useEffect(() => {
        if (status === 'authenticated') {
            //setName(userSession?.data?.user?.name);
            fetch('/api/userprofile').then(res => {
                res.json().then(data => {
                    setName(data.name);
                    setPhoneNumber(data.phoneNumber);
                    setStreetAddress(data.streetAddress);
                    setPostalCode(data.postalCode);
                    setCity(data.city);
                    setCountry(data.country);
                    setIsAdmin(data.admin);
                    setProfileFetched(true);
                })
            })
        }
    }, [userSession, status])

    async function handleDataSubmit(ev) {
        ev.preventDefault();
        setDetailsSaved(false);
        setSaving(true);
        const response = await fetch('/api/userprofile', {
            method: 'PUT',
            body: JSON.stringify(
                {
                    name: Name,
                    streetAddress: streetAddress,
                    postalCode: postalCode,
                    city: city,
                    phoneNumber: phoneNumber,
                    country: country
                }
            ),
            headers: { 'Content-Type': 'application/json' },
        })
        setSaving(false);
        if (response.ok) {
            setDetailsSaved(true);
        }
    }

    function handleFileChange(ev) {
        const ImageFile = ev.target.files;
        if (ImageFile?.length === 1) {
            const imgData = new FormData;
            imgData.set('ImageFile', ImageFile[0]);
            fetch('/api/uploadImages', {
                method: 'POST',
                body: imgData,
            })
        }
    }

    if (status === 'loading' || !profileFetched) {
        return 'Loading!';
    }
    if (status === 'unauthenticated') {
        return redirect('/login');
    }

    return (
        <section className="mt-8">
            <UserTab isAdmin={isAdmin}/>
            <div className="max-w-2xl mx-auto mt-8">
                {detailsSaved && (
                    <h2 className="text-center bg-green-100 p-4 rounded-lg border border-green-300">
                        Profile Details Saved
                    </h2>
                )}
                {saving && (
                    <h2 className="text-center bg-blue-100 p-4 rounded-lg border border-blue-300">
                        Details are being saved!
                    </h2>
                )}
                <div className="flex gap-2 items-center">
                    {/* <div>
                        <div className="p-2 rounded-lg relative">
                            <Image className="rounded-lg w-full h-full mb-2" src={'/pizza.png'} width={100} height={100} alt={'avatar'}>
                            </Image>
                            <label>
                                <input type="file" className="hidden" onChange={handleFileChange} />
                                <span className=" block border border-gray-300 cursor-pointer rounded-lg p-2 text-center">Change Photo</span>
                            </label>
                        </div>
                    </div> */}
                    <form className="grow" onSubmit={handleDataSubmit}>
                        <label>Full Name</label>
                        <input type="text" placeholder="Full Name"
                            value={Name || ''} onChange={ev => setName(ev.target.value)}
                        ></input>
                        <label>Email</label>
                        <input type="email" value={userSession.data?.user?.email || ''} disabled={true}></input>
                        <label>Phone Number</label>
                        <input type="tel" placeholder="Phone Number"
                            value={phoneNumber || ''} onChange={ev => setPhoneNumber(ev.target.value)}
                        ></input>
                        <label>Street Address</label>
                        <input type="text" placeholder="Street address"
                            value={streetAddress || ''} onChange={ev => setStreetAddress(ev.target.value)}
                        ></input>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label>City</label>
                                <input type="text" placeholder="City"
                                    value={city || ''} onChange={ev => setCity(ev.target.value)}
                                ></input>
                            </div>
                            <div>
                                <label>Postal Code</label>
                                <input type="text" placeholder="Postal Code"
                                    value={postalCode || ''} onChange={ev => setPostalCode(ev.target.value)}
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
                        <button type="submit">Save Details</button>
                    </form>
                </div>
            </div>
        </section>
    )
}