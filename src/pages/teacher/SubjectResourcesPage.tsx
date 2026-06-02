/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  FileText,
  Link2,
  Image,
  Video,
  Archive,
  LayoutGrid,
  Monitor,
  File,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  X,
} from 'lucide-react';
import { fetchSubjectResources, uploadResourceFile, addResourceLink, updateResourceVisibility, deleteResource, withMockFallback } from '@/services/taskmanService';
import type { TaskmanResource, ChapterWithResources } from '@/types/taskman';
import TeacherDashboardLayout from '@/components/teacher/TeacherDashboardLayout';

// ============================================
// TYPES
// ============================================

type FileType = 'LINK' | 'PDF' | 'WORD' | 'EXCEL' | 'POWERPOINT'
              | 'IMAGE' | 'VIDEO' | 'ZIP' | 'OTHER';

// TaskmanResource and ChapterWithResources types imported from /src/types/taskman

// ============================================
// HELPER FUNCTIONS
// ============================================

// NOTE: withMockFallback được import từ service

// Mock data
const getMockChaptersData = (): ChapterWithResources[] => [
  {
    chapterId: 'chapter-1',
    chapterTitle: 'Chương 1: Giới thiệu',
    sortOrder: 1,
    resources: [
      {
        id: 'r-1',
        title: 'Slide bài giảng tuần 1',
        url: 'uploads/slide1.pdf',
        fileType: 'PDF',
        isVisible: true,
        sortOrder: 1,
      },
      {
        id: 'r-2',
        title: 'Video hướng dẫn cài đặt',
        url: 'https://youtube.com/watch?v=abc',
        fileType: 'LINK',
        isVisible: true,
        sortOrder: 2,
      },
    ],
  },
  {
    chapterId: 'chapter-2',
    chapterTitle: 'Chương 2: Thực hành',
    sortOrder: 2,
    resources: [
      {
        id: 'r-3',
        title: 'Bài tập thực hành',
        url: 'uploads/exercise.docx',
        fileType: 'WORD',
        isVisible: false,
        sortOrder: 1,
      },
    ],
  },
];

// Map fileType to icon
const getIconForFileType = (fileType: FileType) => {
  const iconProps = 'w-4 h-4';
  switch (fileType) {
    case 'PDF':
      return <FileText className={`${iconProps} text-rose-600`} />;
    case 'WORD':
      return <FileText className={`${iconProps} text-blue-600`} />;
    case 'EXCEL':
      return <LayoutGrid className={`${iconProps} text-green-600`} />;
    case 'POWERPOINT':
      return <Monitor className={`${iconProps} text-orange-600`} />;
    case 'IMAGE':
      return <Image className={`${iconProps} text-purple-600`} />;
    case 'VIDEO':
      return <Video className={`${iconProps} text-pink-600`} />;
    case 'ZIP':
      return <Archive className={`${iconProps} text-gray-600`} />;
    case 'LINK':
      return <Link2 className={`${iconProps} text-teal-600`} />;
    default:
      return <File className={`${iconProps} text-gray-500`} />;
  }
};

// Get badge color for fileType
const getBadgeColor = (fileType: FileType): string => {
  switch (fileType) {
    case 'PDF':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'WORD':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'EXCEL':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'POWERPOINT':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'IMAGE':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'VIDEO':
      return 'bg-pink-100 text-pink-700 border-pink-200';
    case 'ZIP':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'LINK':
      return 'bg-teal-100 text-teal-700 border-teal-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

// ============================================
// MODAL: Add Resource
// ============================================

interface AddResourceModalProps {
  isOpen: boolean;
  chapterId: string;
  onClose: () => void;
  onAddResource: (resource: TaskmanResource) => void;
}

const AddResourceModal = ({
  isOpen,
  chapterId,
  onClose,
  onAddResource,
}: AddResourceModalProps) => {
  const [tab, setTab] = useState<'file' | 'link'>('file');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Validate URL
  const isValidUrl = (urlStr: string): boolean => {
    try {
      const urlObj = new URL(urlStr);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Handle submit file
  const handleSubmitFile = async () => {
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Vui lòng nhập tiêu đề tài liệu');
      return;
    }

    if (!file) {
      setErrorMessage('Vui lòng chọn file để tải lên');
      return;
    }

    setLoading(true);
    try {
      const newResource = await uploadResourceFile(chapterId, file, title);

      if (newResource) {
        onAddResource(newResource);
        setTitle('');
        setFile(null);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || err?.response?.data?.message || 'Lỗi khi tải file lên');
    } finally {
      setLoading(false);
    }
  };

  // Handle submit link
  const handleSubmitLink = async () => {
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Vui lòng nhập tiêu đề liên kết');
      return;
    }

    if (!url.trim()) {
      setErrorMessage('Vui lòng nhập URL');
      return;
    }

    if (!isValidUrl(url)) {
      setErrorMessage('URL phải bắt đầu bằng http:// hoặc https://');
      return;
    }

    setLoading(true);
    try {
      const newResource = await addResourceLink(chapterId, title, url);

      if (newResource) {
        onAddResource(newResource);
        setTitle('');
        setUrl('');
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || err?.response?.data?.message || 'Lỗi khi thêm liên kết');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Thêm tài liệu</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setTab('file')}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
              tab === 'file'
                ? 'border-b-2 border-teal-600 text-teal-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tải file lên
          </button>
          <button
            onClick={() => setTab('link')}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
              tab === 'link'
                ? 'border-b-2 border-teal-600 text-teal-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Thêm link
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error message */}
          {errorMessage && (
            <div className="mb-4 flex items-start gap-3 rounded-lg bg-red-50 p-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}

          {tab === 'file' ? (
            // Tab: Tải file lên
            <div className="space-y-4">
              {/* Title input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiêu đề tài liệu
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Slide bài giảng"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              {/* File input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chọn file
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif,.mp4,.zip,.rar"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Định dạng hỗ trợ: PDF, Word, Excel, PowerPoint, Image, Video, ZIP (tối đa 10MB)
                </p>
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmitFile}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Đang tải...' : 'Tải lên'}
              </button>
            </div>
          ) : (
            // Tab: Thêm link
            <div className="space-y-4">
              {/* Title input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiêu đề liên kết
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Video bài giảng"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              {/* URL input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/resource"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmitLink}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Đang thêm...' : 'Thêm liên kết'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function SubjectResourcesPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();

  const [chapters, setChapters] = useState<ChapterWithResources[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    chapterId: string;
  }>({ isOpen: false, chapterId: '' });

  const successTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  // Fetch chapters on mount
  useEffect(() => {
    fetchChapters();
  }, [subjectId]);

  const fetchChapters = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const data = await withMockFallback(
        () => fetchSubjectResources(subjectId || ''),
        () => getMockChaptersData()
      );

      setChapters(data || []);

      // Mặc định expand tất cả chapter
      const allChapterIds = new Set(
        (data || []).map((ch: ChapterWithResources) => ch.chapterId)
      );
      setExpandedChapters(allChapterIds);
    } catch (err: any) {
      setErrorMessage('Không thể tải danh sách tài liệu. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle chapter expand/collapse
  const toggleChapterExpand = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  // Handle toggle visibility
  const handleToggleVisibility = async (resource: TaskmanResource) => {
    const newVisibility = !resource.isVisible;

    // Optimistic update
    setChapters((prev) =>
      prev.map((chapter) => ({
        ...chapter,
        resources: chapter.resources.map((r) =>
          r.id === resource.id ? { ...r, isVisible: newVisibility } : r
        ),
      }))
    );

    try {
      await updateResourceVisibility(resource.id, newVisibility);
    } catch (err) {
      // Rollback on error
      setChapters((prev) =>
        prev.map((chapter) => ({
          ...chapter,
          resources: chapter.resources.map((r) =>
            r.id === resource.id ? { ...r, isVisible: resource.isVisible } : r
          ),
        }))
      );
      setErrorMessage('Không thể cập nhật trạng thái tài liệu');
    }
  };

  // Handle delete resource
  const handleDeleteResource = async (resource: TaskmanResource) => {
    if (!window.confirm(`Bạn có chắc muốn xóa "${resource.title}"?`)) {
      return;
    }

    try {
      await deleteResource(resource.id);

      // Remove from state
      setChapters((prev) =>
        prev.map((chapter) => ({
          ...chapter,
          resources: chapter.resources.filter((r) => r.id !== resource.id),
        }))
      );

      setSuccessMessage('Xóa tài liệu thành công');
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = window.setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Không thể xóa tài liệu'
      );
    }
  };

  // Handle add resource from modal
  const handleAddResource = (newResource: TaskmanResource) => {
    setChapters((prev) =>
      prev.map((chapter) => {
        if (chapter.chapterId === modalState.chapterId) {
          return {
            ...chapter,
            resources: [...chapter.resources, newResource],
          };
        }
        return chapter;
      })
    );

    setSuccessMessage('Thêm tài liệu thành công');
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    successTimeoutRef.current = window.setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <TeacherDashboardLayout>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="mx-auto max-w-4xl px-4">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Tài liệu học tập</h1>
          </div>

          {/* Messages */}
          {errorMessage && (
            <div className="mb-4 flex items-start gap-3 rounded-lg bg-red-50 p-4 border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-700">{errorMessage}</p>
                <button
                  onClick={fetchChapters}
                  className="mt-2 inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 flex items-start gap-3 rounded-lg bg-green-50 p-4 border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-3" />
              <p className="text-gray-600">Đang tải tài liệu...</p>
            </div>
          ) : chapters.length === 0 ? (
            // Empty state
            <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-semibold mb-1">
                Chưa có tài liệu nào
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Bắt đầu bằng cách thêm tài liệu vào chương học
              </p>
            </div>
          ) : (
            // Chapters list
            <div className="space-y-3">
              {chapters.map((chapter) => (
                <div
                  key={chapter.chapterId}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  {/* Chapter header */}
                  <button
                    onClick={() => toggleChapterExpand(chapter.chapterId)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {expandedChapters.has(chapter.chapterId) ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">
                          {chapter.chapterTitle}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {chapter.resources.length} tài liệu
                        </p>
                      </div>
                    </div>

                    {/* Right side: Badge + Add button */}
                    <div className="flex items-center gap-2 ml-4">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold border border-teal-200">
                        {chapter.resources.length}
                      </span>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalState({
                            isOpen: true,
                            chapterId: chapter.chapterId,
                          });
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition"
                      >
                        <Plus className="w-4 h-4" />
                        Thêm
                      </div>
                    </div>
                  </button>

                  {/* Chapter resources */}
                  {expandedChapters.has(chapter.chapterId) && (
                    <div className="border-t border-gray-200 px-5 py-3 bg-gray-50">
                      {chapter.resources.length === 0 ? (
                        <p className="py-4 text-center text-sm text-gray-500">
                          Chưa có tài liệu nào trong chương này
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {chapter.resources.map((resource) => (
                            <div
                              key={resource.id}
                              className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-100 hover:border-gray-300 transition group"
                            >
                              {/* Left: Icon + Title + Badge */}
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                {/* Icon */}
                                <div className="flex-shrink-0">
                                  {getIconForFileType(resource.fileType)}
                                </div>

                                {/* Title + Badge */}
                                <div className="flex-1 min-w-0">
                                  <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-semibold text-gray-900 hover:text-teal-600 truncate block"
                                  >
                                    {resource.title}
                                  </a>
                                  <div className="mt-1">
                                    <span
                                      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border ${getBadgeColor(
                                        resource.fileType
                                      )}`}
                                    >
                                      {resource.fileType}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Right: Actions */}
                              <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                                {/* Visibility toggle */}
                                <button
                                  onClick={() =>
                                    handleToggleVisibility(resource)
                                  }
                                  className="inline-flex items-center justify-center rounded p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition"
                                  title={
                                    resource.isVisible
                                      ? 'Ẩn tài liệu'
                                      : 'Hiển thị tài liệu'
                                  }
                                >
                                  {resource.isVisible ? (
                                    <Eye className="w-4 h-4" />
                                  ) : (
                                    <EyeOff className="w-4 h-4" />
                                  )}
                                </button>

                                {/* Delete button */}
                                <button
                                  onClick={() => handleDeleteResource(resource)}
                                  className="inline-flex items-center justify-center rounded p-1.5 text-gray-500 hover:bg-red-100 hover:text-red-600 transition opacity-0 group-hover:opacity-100"
                                  title="Xóa tài liệu"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={modalState.isOpen}
        chapterId={modalState.chapterId}
        onClose={() => setModalState({ isOpen: false, chapterId: '' })}
        onAddResource={handleAddResource}
      />
    </TeacherDashboardLayout>
  );
}
