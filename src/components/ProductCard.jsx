import StarRow from './StarRow';
import { INR } from '../utils/currency';

export default function ProductCard({ p, onAdd, onOpen }) {
  return (
    <div className="rounded-2xl border shadow-sm bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
      <button onClick={() => onOpen(p)} className="block w-full">
        <img src={p.img} alt={p.name} className="w-full h-48 object-cover" />
      </button>
      <div className="p-4">
        <h3 className="text-sm font-semibold line-clamp-2">{p.name}</h3>
        <div className="flex items-center justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <StarRow count={Math.min(5, p.rating)} />
            <span>({p.reviews})</span>
          </div>
          <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5">{p.category}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="text-lg font-bold text-rose-500">{INR.format(p.price)}</div>
          <button onClick={() => onAdd(p)} className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}