import { useState } from "react";

export default function DeleteButton({ label, onConfirmation }) {

    const [confirmation, setConfirmation] = useState(false);

    if (confirmation) {
        return (
            <div className="fixed bg-black/70 inset-0 flex items-center h-full justify-center">
                <div className="bg-white p-4 rounded-lg">
                    <div>Do you want to delete?</div>
                    <div className="flex gap-2 mt-1">
                        <button type="button" onClick={() => setConfirmation(false)}>No</button>
                        <button type="button" className="primary" onClick={() => {
                            onConfirmation();
                            setConfirmation(false)
                        }} >Yes</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <button type="button" onClick={() => setConfirmation(true)}>
            {label}
        </button>
    );
}