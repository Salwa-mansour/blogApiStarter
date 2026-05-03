import { useState, useEffect } from "react";
import axios from "../api/axios";

const useFetchItems = (reqData) => {
    const [items, setItems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   useEffect(() => {
    const controller = new AbortController();

    // Function is local to the effect
    const fetchItems = async (signal) => {
        setLoading(true);
        try {
            const response = await axios.get(reqData, { signal });
            setItems(response.data);
        } catch (error) {
            // handle error
        } finally {
            setLoading(false);
        }
    };

    if (reqData) fetchItems(controller.signal);

    return () => controller.abort();
}, [reqData]); // Only depends on the URL string

    // Return the function so components can call it manually
    return [items, loading, error]; 
}

export default useFetchItems;