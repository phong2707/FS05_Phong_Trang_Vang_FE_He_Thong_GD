/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Clock, Users, BookOpen, Search, Filter } from 'lucide-react';
import type { MockCourse } from '@/data/mockCourses';

interface CourseFilterProps {
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onLevelChange: (level: string) => void;
  onPriceChange: (priceFilter: string) => void;
  searchTerm: string;
  selectedCategory: string;
  selectedLevel: string;
  selectedPrice: string;
}

const categories = ['Frontend', 'Backend', 'Mobile', 'Tester'];
const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
const priceFilters = ['all', 'free', 'paid'];

export default function CourseFilter({
  onSearchChange,
  onCategoryChange,
  onLevelChange,
  onPriceChange,
  searchTerm,
  selectedCategory,
  selectedLevel,
  selectedPrice,
}: CourseFilterProps) {
  return (
    <aside className="w-72 space-y-6">
      {/* Search */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Filter size={18} />
          Chuyên ngành
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="category"
              value=""
              checked={selectedCategory === ''}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm text-slate-700">Tất cả</span>
          </label>
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={cat}
                checked={selectedCategory === cat}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm text-slate-700">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Level Filter */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-4">Trình độ</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="level"
              value=""
              checked={selectedLevel === ''}
              onChange={(e) => onLevelChange(e.target.value)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm text-slate-700">Tất cả</span>
          </label>
          {levels.map((level) => (
            <label key={level} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="level"
                value={level}
                checked={selectedLevel === level}
                onChange={(e) => onLevelChange(e.target.value)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm text-slate-700">
                {level === 'BEGINNER' && 'Cơ bản'}
                {level === 'INTERMEDIATE' && 'Trung cấp'}
                {level === 'ADVANCED' && 'Nâng cao'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-4">Giá</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="price"
              value="all"
              checked={selectedPrice === 'all'}
              onChange={(e) => onPriceChange(e.target.value)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm text-slate-700">Tất cả</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="price"
              value="free"
              checked={selectedPrice === 'free'}
              onChange={(e) => onPriceChange(e.target.value)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm text-slate-700">Miễn phí</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="price"
              value="paid"
              checked={selectedPrice === 'paid'}
              onChange={(e) => onPriceChange(e.target.value)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm text-slate-700">Có phí</span>
          </label>
        </div>
      </div>
    </aside>
  );
}
