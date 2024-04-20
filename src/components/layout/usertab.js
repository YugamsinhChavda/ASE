'use client';
import Link from "next/link"
import { usePathname } from "next/navigation";

export default function UserTab({ isAdmin }) {
    const url = usePathname();
    return (
        <div className="flex justify-center gap-2 tabs mx-auto flex-wrap">
            <Link className={url === '/userProfile' ? 'active' : ''}
                href={'/userProfile'}>
                Profile
            </Link>
            {isAdmin && (
                <>
                    <Link
                        className={url === '/categories' ? 'active' : ''}
                        href={'/categories'}>
                        Categories
                    </Link>
                    <Link
                        className={url.includes('menuitems') ? 'active' : ''}
                        href={'/menuitems'}>
                        Menu Items
                    </Link>
                    <Link
                        className={url.includes('users') ? 'active' : ''}
                        href={'/users'}>
                        Users
                    </Link>
                </>
            )}
            <Link
                className={url === '/orders' ? 'active' : ''}
                href={'/orders'}>
                Orders
            </Link>
        </div>
    )
}