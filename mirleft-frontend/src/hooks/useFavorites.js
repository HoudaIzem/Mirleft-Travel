import { useState, useCallback } from 'react';
import { favoriteService } from '../services/services';

export function useFavorites() {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleFavorite = useCallback(async (id, type) => {
        setLoading(true);
        try {
            const response = await favoriteService.toggle({
                favorable_id: id,
                favorable_type: type,
            });
            setIsFavorite(response.data.is_favorite);
            return response.data;
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const checkFavorite = useCallback(async (id, type) => {
        try {
            const response = await favoriteService.isFavorite({
                favorable_id: id,
                favorable_type: type,
            });
            setIsFavorite(response.data.is_favorite);
        } catch (error) {
            console.error('Failed to check favorite:', error);
        }
    }, []);

    return { isFavorite, loading, toggleFavorite, checkFavorite };
}
