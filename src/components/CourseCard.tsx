interface CourseCardProps {
  id: string;
  image: string;
  title: string;
  instructor: string;
  price: number;
  status?: 'pending' | 'active' | 'completed';
}

const statusBadgeConfig = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'Đang chờ duyệt',
  },
  active: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Đang mở',
  },
  completed: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Đã hoàn thành',
  },
};

export const CourseCard: React.FC<CourseCardProps> = ({
  image,
  title,
  instructor,
  price,
  status,
}) => {
  const statusConfig = status ? statusBadgeConfig[status] : null;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Hình ảnh */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
        {statusConfig && (
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
            {statusConfig.label}
          </div>
        )}
      </div>

      {/* Nội dung */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">{instructor}</p>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">
            ₫{price.toLocaleString('vi-VN')}
          </span>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};
