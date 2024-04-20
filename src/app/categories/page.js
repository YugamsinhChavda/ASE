'use client';
import UserTab from "@/components/layout/usertab";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AdminChecker } from "../../components/AdminChecker";
import DeleteButton from "@/components/deleteButton";

export default function CategoryPage() {

    const [CategoryData, setCategoryData] = useState('');
    const [categoryList, setCategoryList] = useState([]);
    const { adminInfoFetching: adminLoading, isAdmin: adminData } = AdminChecker();
    const [editCategory, setEditCategory] = useState(null);

    function FetchCategoryList() {
        fetch('/api/categories').then(res => {
            res.json().then(categories => {
                setCategoryList(categories);
            })
        })
    }

    useEffect(() => {
        FetchCategoryList();
    }, []);

    async function handleDataDelete(_id) {
        const promise = new Promise(async (resolve, reject) => {
            const response = await fetch('/api/categories?_id=' + _id, {
                method: 'DELETE'
            });
            if (response.ok) {
                resolve();
                FetchCategoryList();
            }
            else {
                reject();
            }
        });

        toast.promise(promise, {
            loading: 'Deleting the Cateogry',
            success: 'Deleted successfully',
            error: 'error'
        });


    }


    async function handleSubmitData(ev) {
        ev.preventDefault();
        const promise = new Promise(async (resolve, reject) => {
            const data = { name: CategoryData };
            if (editCategory) {
                data._id = editCategory._id;
            }
            const response = await fetch('/api/categories', {
                method: editCategory ? 'PUT' : 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });
            setCategoryData('');
            FetchCategoryList();
            setEditCategory(null);
            if (response.ok) {
                resolve();
            }
            else {
                reject();
            }
        });
        await toast.promise(promise, {
            loading: editCategory ? 'Updating category data' : 'Adding new Category Data to Database',
            success: editCategory ? 'Category updated successfully' : 'Category created successfully',
            error: 'Error',
        });

    }

    if (adminLoading) {
        return 'Fetching Information. Wait !'
    }

    if(!adminData.admin){
        return 'You are not an Admin';
    }


    return (
        <section className="mt-8 max-w-2xl mx-auto">
            <Toaster position="top-center" />
            <UserTab isAdmin={true} />
            <form className="mt-8" onSubmit={handleSubmitData}>
                <div className="flex gap-2 items-end">
                    <div className="grow">
                        <label>{editCategory ? 'Update Category Detail' : 'New Category Name'}
                            {editCategory && (
                                <>:<b>{editCategory.name}</b></>
                            )}
                        </label>
                        <input type="text" value={CategoryData} onChange={ev => setCategoryData(ev.target.value)}></input>
                    </div>
                    <div className="pb-2 flex gap-2">
                        <button className="border border-primary" type="submit">
                            {editCategory ? 'Update' : 'Create'}
                        </button>
                        <button type="button" onClick={() => {
                            setCategoryData('');
                            setEditCategory(null)
                        }} >Cancel</button>
                    </div>
                </div>

            </form>
            <div>
                <h2 className="mt-8 text-sm text-gray-500">Category List</h2>
                {categoryList?.length > 0 && categoryList.map(category => (
                    <div
                        className="bg-gray-200 rounded-xl p-2 px-4 flex gap-1 mb-1 items-center" key={category._id}>
                        <div
                            className="grow">
                            {category.name}
                        </div>
                        <div className="flex gap-1">
                            <button type="button"
                                onClick={() => {
                                    setEditCategory(category);
                                    setCategoryData(category.name)
                                }}
                            >
                                Edit
                            </button>
                            <DeleteButton label="Delete" onConfirmation={() => handleDataDelete(category._id)} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}