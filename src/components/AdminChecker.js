import { useEffect, useState } from "react";

export function AdminChecker() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminInfoFetching, setAdminInfoFetching] = useState(false);
    useEffect(() => {
        setAdminInfoFetching(true);
        fetch('/api/userprofile').then(response => {
            response.json().then(data => {
                setIsAdmin(data);
                setAdminInfoFetching(false);
            })
        })
    }, [])

    return {adminInfoFetching, isAdmin};
}