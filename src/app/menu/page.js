'use client';
import SectionHeader from "@/components/layout/sectionheaders";
import MenuItem from "@/components/menu/menuitem";
import { useEffect, useState } from "react"

export default function MenuPage() {

    const [categoryList, setCategoryList] = useState([]);
    const [menuItemsList, setMenuItemsList] = useState([]);

    useEffect(() => {
        fetch('/api/categories').then(res => {
            res.json().then(categories => {
                setCategoryList(categories);
            })
        });
        fetch('/api/menuitems').then(res => {
            res.json().then(items => {
                setMenuItemsList(items);
            })
        })
    }, []);

    return (
        <section className="mt-8">
            {categoryList.length > 0 && categoryList.map(category => (
                <div key={category._id}>
                    <div className="text-center">
                        <SectionHeader mainHeader={category.name} />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4 mt-6 mb-12">
                        {menuItemsList.filter(item => item.selectedCategory === category._id).map(item => (
                            <MenuItem key={item._id} {...item} />
                        ))}
                    </div>

                </div>
            ))}
        </section>
    )
}