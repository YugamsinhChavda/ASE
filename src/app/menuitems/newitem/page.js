'use client';
import { AdminChecker } from "../../../components/AdminChecker";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import UserTab from "@/components/layout/usertab";
import Link from "next/link";
import { redirect } from "next/navigation";
import EditImage from "../../../components/layout/editImage";
import Image from "next/image";


export default function NewMenuItemPage() {
    const { adminInfoFetching: adminLoading, isAdmin: adminData } = AdminChecker();
    const [itemName, setItemName] = useState('');
    const [image,SetImage] = useState('');
    const [itemDesc, setItemDesc] = useState('');
    const [itemBasePrice, setItemBasePrice] = useState('');
    const [redirectUrl, setRedirectUrl] = useState(false);
    const [itemSize, setItemSize] = useState([]);
    const [extraIngredients, setExtraIngredients] = useState([]);
    const [sizeToggle, setSizeToggle] = useState(false);
    const [IngredientsToggle, setIngredientsToggle] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetch('/api/categories').then(res => {
            res.json().then(categories => {
                setCategoryList(categories);
                setSelectedCategory(categories[0]._id);
            })
        })
    }, []);

    async function handleDataSubmit(ev) {
        ev.preventDefault();
        const data = { itemName, itemDesc, image, itemBasePrice, itemSize, extraIngredients, selectedCategory };
        const savingPromise = new Promise(async (resolve, reject) => {
            const response = await fetch('/api/menuitems', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok)
                resolve();
            else
                reject();
        });
        await toast.promise(savingPromise, {
            loading: 'Saving Menu Item Details',
            success: 'Details Saved Successfully',
            error: 'Error'
        })

        setRedirectUrl(true);


        // try {
        //     await toast.promise(
        //         fetch('/api/menuitems', {
        //             method: 'POST',
        //             body: JSON.stringify(data),
        //             headers: { 'Content-Type': 'application/json' },
        //         }),
        //         {
        //             loading: 'Saving Menu Item Details',
        //             success: 'Details Saved Successfully',
        //             error: (err) => `Error: ${err.toString()}`
        //         }
        //     );

        // } catch (error) {
        //     console.error('Error saving menu item:', error);
        // }

    };

    function selectSize() {
        setItemSize(oldsize => {
            return [...oldsize, { name: '', price: 0 }];
        })
    }

    function selectExtraIngredients() {
        setExtraIngredients(oldingredients => {
            return [...oldingredients, { name: '', price: 0 }];
        })
    }

    function editItemSize(ev, index, prop) {
        const newData = ev.target.value;
        setItemSize(prevSize => {
            const newSize = [...prevSize];
            newSize[index][prop] = newData;
            return newSize;
        });
    }

    function editIngredients(ev, index, prop) {
        const newData = ev.target.value;
        setExtraIngredients(prevIngr => {
            const newIngr = [...prevIngr];
            newIngr[index][prop] = newData;
            return newIngr;
        })
    }



    function deleteItemSize(indexRemove) {
        setItemSize(prev => prev.filter((v, index) => index !== indexRemove));
    }

    function deleteIngredients(indexRemove) {
        setExtraIngredients(prev => prev.filter((v, index) => index !== indexRemove));
    }

    async function handleFileChange(event) {
        const file = event.target.files[0];
        if (!file) return;
    
        const formData = new FormData();
        formData.append('file', file);
        
        await fetch('/api/uploadImages', {
            method: 'POST',
            body: formData,
        }).then(response => {
            response.json().then(data => {
                SetImage(data);
            })
        })
    }
    

    if (adminLoading) {
        return 'Fetching Information. Wait !'
    }

    if (!adminData.admin) {
        return 'You are not an Admin';
    }

    if (redirectUrl) {
        return redirect('/menuitems');
    }

    return (
        <section className="mt-8">
            <Toaster position="top-center" />
            <UserTab isAdmin={true} />
            <div className="mt-8 max-w-2xl mx-auto">
                <Link href={'/menuitems'} className="button text-center">
                    <span>Show Entire Menu</span>
                </Link>
            </div>
            <form className="mt-8 max-w-md mx-auto" onSubmit={handleDataSubmit}>
                <div className="md:grid items-start gap-4"
                    style={{ gridTemplateColumns: '.3fr .7fr' }}>
                    <div>
                        {image && (
                            <Image className="rounded-lg w-full h-full mb-1" src={`/Images/${image}`} width={250} height={250} alt={'avatar'} />
                        )}
                        {!image && (
                            <div className="text-center bg-gray-200 p-4 text-gray-500 rounded-lg mb-1">
                                No image
                            </div>
                        )}
                        <label>
                            <input type="file" className="hidden" onChange={handleFileChange} />
                            <span className="block border border-gray-300 rounded-lg p-2 text-center cursor-pointer">Change image</span>
                        </label>
                    </div>
                    <div className="grow">
                        <label>Menu Item Name</label>
                        <input type="text"
                            value={itemName}
                            onChange={ev => setItemName(ev.target.value)}>
                        </input>
                        <label>Menu Item Description</label>
                        <input type="text"
                            value={itemDesc}
                            onChange={ev => setItemDesc(ev.target.value)}>
                        </input>
                        <label>Menu Item Category</label>
                        <select value={selectedCategory} onChange={(ev) => setSelectedCategory(ev.target.value)}>
                            {categoryList?.length > 0 && categoryList.map(category => (
                                <option value={category._id}>{category.name}</option>
                            ))}
                        </select>
                        <label>Menu Item Base Price</label>
                        <input type="text"
                            value={itemBasePrice}
                            onChange={ev => setItemBasePrice(ev.target.value)}>
                        </input>
                        <div className="bg-gray-200 p-2 rounded-md mb-2">
                            <button
                                onClick={() => setSizeToggle(prev => !prev)}
                                className="inline-flex p-1 border-0" type="button">
                                {sizeToggle && (
                                    <label>Hide</label>
                                )}
                                {!sizeToggle && (
                                    <label>Expand</label>
                                )}
                                <span>Size</span>
                                <span>({itemSize?.length})</span>
                            </button>
                            <div className={sizeToggle ? 'block' : 'hidden'}>
                                {itemSize?.length > 0 && itemSize.map((size, index) => (
                                    <div className="flex gap-2 items-end">
                                        <div>
                                            <label>Size Name</label>
                                            <input type="text" placeholder="Size Name" value={size.name}
                                                onChange={ev => editItemSize(ev, index, 'name')}
                                            ></input>
                                        </div>
                                        <div>
                                            <label>Size extra price</label>
                                            <input type="text" placeholder="Extra price" value={size.price}
                                                onChange={ev => editItemSize(ev, index, 'price')}
                                            ></input>
                                        </div>
                                        <div>
                                            <button type="button"
                                                onClick={() => deleteItemSize(index)}
                                                className="bg-white mb-2">x</button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={selectSize} className="bg-white">Add Item Size</button>
                            </div>
                        </div>
                        <div className="bg-gray-200 p-2 rounded-md mb-2">
                            <button
                                onClick={() => setIngredientsToggle(prev => !prev)}
                                className="inline-flex p-1 border-0" type="button">
                                {IngredientsToggle && (
                                    <label>Hide</label>
                                )}
                                {!IngredientsToggle && (
                                    <label>Expand</label>
                                )}
                                <span>Extra Ingredients</span>
                                <span>({extraIngredients?.length})</span>
                            </button>
                            <div className={IngredientsToggle ? 'block' : 'hidden'}>
                                {extraIngredients?.length > 0 && extraIngredients.map((size, index) => (
                                    <div className="flex gap-2 items-end">
                                        <div>
                                            <label>Ingredients Name</label>
                                            <input type="text" placeholder="Size Name" value={size.name}
                                                onChange={ev => editIngredients(ev, index, 'name')}
                                            ></input>
                                        </div>
                                        <div>
                                            <label>price</label>
                                            <input type="text" placeholder="Extra price" value={size.price}
                                                onChange={ev => editIngredients(ev, index, 'price')}
                                            ></input>
                                        </div>
                                        <div>
                                            <button type="button"
                                                onClick={() => deleteIngredients(index)}
                                                className="bg-white mb-2">x</button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={selectExtraIngredients} className="bg-white">Add Extra Ingredients</button>
                            </div>
                        </div>
                        <button type="submit">Save Details</button>
                    </div>
                </div>
            </form>
        </section>
    );

}