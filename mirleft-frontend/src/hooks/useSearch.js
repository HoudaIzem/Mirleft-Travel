import { useState, useCallback } from 'react';
import { propertyService, restaurantService, activityService } from '../services/services';

export function useSearch() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const search = useCallback(async (query, type = 'properties') => {
        setLoading(true);
        setError(null);
        try {
            let response;
            if (type === 'properties') {
                response = await propertyService.search({ q: query });
            } else if (type === 'restaurants') {
                response = await restaurantService.search({ q: query });
            } else if (type === 'activities') {
                response = await activityService.search({ q: query });
            }
            setResults(response.data.results);
        } catch (err) {
            setError(err.message);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return { results, loading, error, search };
}
