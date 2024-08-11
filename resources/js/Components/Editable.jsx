import { useState } from 'react';
import { router } from '@inertiajs/react'

export default function Editable({ valeur, id , c}) {
    console.log("Editable :", valeur, id, c);
    const [val, setVal] = useState(valeur);
    const [editing, setEditing] = useState(false);

    const handleDoubleClic = () => {
        setEditing(true);
    }

    const handleBlur = (e) => {
        router.put(route('host.update', id), {[c]: val});
        console.log("handleBlur: ", val, id);
        setEditing(false);
    }

    const handleChange = (e) => {
        setVal(e.target.value);
    };

    return (
        <>
            {editing ? (
                <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text"
                    value={val} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    />
            ):(
                <span 
                    onDoubleClick={handleDoubleClic}> 
                    {val} 
                </span>
            )}
        </>
    );
}