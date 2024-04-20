import toast, { Toaster } from "react-hot-toast";

export default function MenuItemTile({ handleAddToCart, ...item }) {
    const { itemName, itemDesc, itemBasePrice, itemSize, extraIngredients, image } = item;
    return (
        <div className="bg-gray-200 p-4 rounded-lg text-center group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all">
            <Toaster position="top-center" />
            <div className="text-center">
                <img src={`/Images/${image}`} className="max-h-auto max-h-24 block mx-auto" alt={image} />
            </div>
            <h4 className="font-semibold text-xl my-3">{itemName}</h4>
            <p className="text-gray-500 text-sm max-h-[60px] line-clamp-3">
                {itemDesc}
            </p>
            <button
                type="button"
                onClick={handleAddToCart}
                className="mt-4 bg-primary text-white rounded-full px-8 py-2">
                {(itemSize?.length > 0 || extraIngredients?.length > 0) ? (
                    <span>Add to Cart (from ${itemBasePrice})</span>
                ) : (
                    <span>Add to Cart ${itemBasePrice}</span>
                )}
            </button>
        </div>
    )
}