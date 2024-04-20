import { useContext, useState } from "react";
import { cartContext } from "../appcontext";
import toast, { Toaster } from "react-hot-toast";
import MenuItemTile from "./menuitemtile";
import Image from "next/image";

export default function MenuItem(menuItem) {
    const { itemName, itemDesc, itemBasePrice, itemSize, extraIngredients, image } = menuItem;
    const { addToCart } = useContext(cartContext);
    const [popUp, setPopUp] = useState(false);
    const [selectedSize, setSelectedSize] = useState(itemSize?.[0] || null);
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    function handleAddToCart() {
        if (itemSize.length > 0 && extraIngredients.length > 0 && !popUp) {
            setPopUp(true);
            return;
        }

        if (popUp) {
            addToCart(menuItem, selectedSize, selectedIngredients);
        }
        else {
            addToCart(menuItem);
        }
        setPopUp(false);
        setSelectedSize(itemSize?.[0] || null);
        setSelectedIngredients([]);
        toast.success('Added to Cart!');
    }

    function handleExtraIngredients(ev, extraIngredient) {
        const checkedIngredient = ev.target.checked;
        if (checkedIngredient) {
            setSelectedIngredients(prev => [...prev, extraIngredient]);
        }
        else {
            setSelectedIngredients(prev => {
                return prev.filter(extra => extra.name !== extraIngredient.name);
            });
        }
    }

    let totalPrice = itemBasePrice;
    if (selectedSize) {
        totalPrice += selectedSize.price;
    }
    if (selectedIngredients?.length > 0) {
        for (const extra of selectedIngredients) {
            totalPrice += extra.price;
        }
    }

    return (
        <>
            {popUp && (
                <div
                    onClick={() => setPopUp(false)}
                    className="fixed inset-0 bg-black/80 flex items-center justify-center">
                    <div
                        onClick={ev => ev.stopPropagation()}
                        className="my-8 bg-white p-2 rounded-lg max-w-md">
                        <div className="overflow-y-scroll p-2"
                            style={{ maxHeight: 'calc(100vh - 100px)' }}
                        >
                            <Image
                                src={`/Images/${image}`}
                                alt={name}
                                width={300} height={200}
                                className="mx-auto" />
                            <h2 className="text-lg font-bold text-center mb-2">{itemName}</h2>
                            <p className="text-center text-gray-500 text-sm mb-2">{itemDesc}</p>
                            {itemSize?.length > 0 && (
                                <div className="py-2">
                                    <h3 className="text-center text-gray-700">Pick your size</h3>
                                    {itemSize.map(size => (
                                        <label key={size._id} className="flex items-center gap-2 p-4 border rounded-md mb-1">
                                            <input
                                                onChange={() => setSelectedSize(size)}
                                                checked={selectedSize?.name === size.name}
                                                type="radio" name="size" /> {size.name} ${itemBasePrice + size.price}
                                        </label>
                                    ))}
                                </div>
                            )}
                            {extraIngredients?.length > 0 && (
                                <div className="py-2">
                                    <h3 className="text-center text-gray-700">Pick additional ingredients</h3>
                                    {extraIngredients.map(ingredients => (
                                        <label key={ingredients._id} className="flex items-center gap-2 p-4 border rounded-md mb-1">
                                            <input
                                                onChange={ev => handleExtraIngredients(ev, ingredients)}
                                                checked={selectedIngredients.map(e => e._id).includes(ingredients._id)}
                                                type="checkbox" name={ingredients.name} /> {ingredients.name} +${ingredients.price}
                                        </label>
                                    ))}
                                </div>
                            )}
                            <button
                                onClick={handleAddToCart}
                                className="primary sticky bottom-2"
                                type="button">Add to cart ${totalPrice}
                            </button>
                            <button
                                className="mt-2"
                                onClick={() => setPopUp(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <MenuItemTile handleAddToCart={handleAddToCart}
                {...menuItem} />

        </>
    );
}