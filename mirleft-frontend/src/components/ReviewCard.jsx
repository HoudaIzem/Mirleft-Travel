import { Star, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ReviewCard({ review }) {
  return (
    <div className="border-b py-4 last:border-b-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <User size={20} className="text-gray-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{review.user?.name}</p>
            <p className="text-sm text-gray-600">
              {review.created_at &&
                formatDistanceToNow(new Date(review.created_at), {
                  addSuffix: true,
                })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
      </div>
      {review.title && (
        <h4 className="font-semibold text-gray-800 mb-1">{review.title}</h4>
      )}
      <p className="text-gray-700">{review.text}</p>
    </div>
  );
}
