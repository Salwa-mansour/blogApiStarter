import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const useFetchItems = (reqData) => {
    const [items, setItems] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Create a controller to cancel the request if the component unmounts
        const controller = new AbortController();

        const fetchItems = async () => {
            setLoading(true); // Reset loading state when reqData changes
            try {
                const response = await axiosPrivate.get(reqData, {
                    signal: controller.signal,
                 
                });
                setItems(response.data);
                setError(null); // Clear previous errors on success
            } catch (error) {
                if (error.name === 'CanceledError') {
                    console.log('Request canceled');
                } else {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        if (reqData) fetchItems();

        // Cleanup function
        return () => controller.abort();

    }, []); // Now it re-fetches if the URL changes

    return [ items, loading, error ];
}

export default useFetchItems;