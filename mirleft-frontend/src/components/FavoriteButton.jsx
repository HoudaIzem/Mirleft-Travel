import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoriteService } from '../services/services';
import { useAuth } from '../hooks/useAuth';

export default function FavoriteButton({ id, type, className = '' }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !id) return;
    favoriteService
      .isFavorite({ favorable_id: id, favorable_type: type })
      .then((res) => setActive(res.data.is_favorite))
      .catch(() => {});
  }, [id, type, isAuthenticated]);

  const toggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setBusy(true);
    try {
      const res = await favoriteService.toggle({ favorable_id: id, favorable_type: type });
      setActive(res.data.is_favorite);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
      disabled={busy}
      onClick={toggle}
      className={`rounded-full bg-white/95 p-2 shadow-md transition hover:scale-105 disabled:opacity-60 ${className}`}
    >
      <Heart
        className={`h-5 w-5 ${active ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
      />
    </button>
  );
}
