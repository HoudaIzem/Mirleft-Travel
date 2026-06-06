// hooks/useProperties.js
import { useState, useEffect } from 'react';

export default function useProperties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/properties')
            .then(res => res.json())
            .then(data => {
                setProperties(data.data ?? data);
                setLoading(false);
            });
    }, []);

    return { properties, loading };
}