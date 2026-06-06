import { MapPin, Star } from 'lucide-react';

const CategoryCard = ({ title, description, image, rating, reviewCount, price, priceType, location }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative overflow-hidden h-48">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=' + encodeURIComponent(title);
          }}
        />
        {rating && (
          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">{rating}</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">{title}</h3>
        
        {location && (
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1">{location}</span>
          </div>
        )}
        
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        )}
        
        {reviewCount && (
          <p className="text-xs text-gray-500 mb-2">{reviewCount} reviews</p>
        )}
        
        {price && (
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-blue-600 text-lg">{price.toLocaleString()} MAD</span>
            {priceType && (
              <span className="text-xs text-gray-500">{priceType}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;