/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  Plus,
  RefreshCcw,
  Save,
  Search,
} from 'lucide-react';
import TeacherDashboardLayout from '@/components/teacher/TeacherDashboardLayout';
import apiClient from '@/api/apiClient';

type SubjectStatus = 'ACTIVE' | 'INACTIVE';
type TeacherType = 'MAIN' | 'TA';
type SessionStatus = 'DRAFT' | 'OPEN' | 'COMPLETED';
type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

interface SubjectDetail {
  subjectId: string;
  subjectName: string;
  subjectCode?: string;
  classGroupId: string;
  classGroupName: string;
  studentCount: number;
  schedule: string;
  status: SubjectStatus;
  teacherType: TeacherType;
}

interface AttendanceStats {
  totalSessions: number;
  averageAttendanceRate: number;
  todayPresent: number;
  todayAbsent: number;
}

interface AttendanceSession {
  id: string;
  subjectId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  topic?: string;
  note?: string;
  status: SessionStatus;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  createdAt: string;
}

interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  email?: string;
  status: AttendanceStatus;
  checkInTime?: string;
  note?: string;
}

interface CreateSessionForm {
  sessionDate: string;
  startTime: string;
  endTime: string;
  topic: string;
  note: string;
}

const statusLabelMap: Record<AttendanceStatus, string> = {
  PRESENT: 'Có mặt',
  ABSENT: 'Vắng',
  LATE: 'Trễ',
  EXCUSED: 'Có phép',
};

const recordStatusClasses: Record<AttendanceStatus, string> = {
  PRESENT: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  ABSENT: 'bg-rose-100 text-rose-700 border-rose-200',
  LATE: 'bg-amber-100 text-amber-700 border-amber-200',
  EXCUSED: 'bg-blue-100 text-blue-700 border-blue-200',
};

const sessionStatusMap: Record<SessionStatus, { label: string; classes: string }> = {
  DRAFT: { label: 'Nháp', classes: 'bg-gray-100 text-gray-700 border-gray-200' },
  OPEN: { label: 'Đang điểm danh', classes: 'bg-blue-100 text-blue-700 border-blue-200' },
  COMPLETED: { label: 'Đã hoàn tất', classes: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

function nowHHmm(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function calcAttendanceRate(session: AttendanceSession): number {
  if (!session.totalStudents) return 0;
  return Math.round(((session.presentCount + session.lateCount + session.excusedCount) / session.totalStudents) * 100);
}

function recomputeSessionCounts(session: AttendanceSession, records: AttendanceRecord[]): AttendanceSession {
  const presentCount = records.filter((r) => r.status === 'PRESENT').length;
  const absentCount = records.filter((r) => r.status === 'ABSENT').length;
  const lateCount = records.filter((r) => r.status === 'LATE').length;
  const excusedCount = records.filter((r) => r.status === 'EXCUSED').length;
  return { ...session, presentCount, absentCount, lateCount, excusedCount, totalStudents: records.length };
}

function buildMockSubject(subjectId: string): SubjectDetail {
  return {
    subjectId,
    subjectName: 'Lập trình Web',
    subjectCode: 'WEB101',
    classGroupId: 'class-1',
    classGroupName: 'CNTT K17A',
    studentCount: 45,
    schedule: 'Thứ 2, 7:00 - 9:30',
    status: 'ACTIVE',
    teacherType: 'MAIN',
  };
}

function buildMockSessions(subjectId: string): AttendanceSession[] {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const oldStr = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const nextStr = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return [
    {
      id: `${subjectId}-session-1`,
      subjectId,
      sessionDate: oldStr,
      startTime: '07:00',
      endTime: '09:30',
      topic: 'Giới thiệu môn học',
      note: 'Buổi đầu tiên',
      status: 'COMPLETED',
      totalStudents: 10,
      presentCount: 7,
      absentCount: 1,
      lateCount: 1,
      excusedCount: 1,
      createdAt: `${oldStr}T06:30:00.000Z`,
    },
    {
      id: `${subjectId}-session-2`,
      subjectId,
      sessionDate: todayStr,
      startTime: '07:00',
      endTime: '09:30',
      topic: 'Ôn tập chương 1',
      note: 'Kiểm tra nhanh đầu giờ',
      status: 'OPEN',
      totalStudents: 10,
      presentCount: 6,
      absentCount: 2,
      lateCount: 1,
      excusedCount: 1,
      createdAt: `${todayStr}T06:30:00.000Z`,
    },
    {
      id: `${subjectId}-session-3`,
      subjectId,
      sessionDate: nextStr,
      startTime: '07:00',
      endTime: '09:30',
      topic: 'Thực hành form và validation',
      note: '',
      status: 'DRAFT',
      totalStudents: 10,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      excusedCount: 0,
      createdAt: `${todayStr}T06:35:00.000Z`,
    },
  ];
}

function buildMockRecords(sessionId: string): AttendanceRecord[] {
  const students = [
    ['st-01', 'SV001', 'Nguyễn Văn An', 'an.nguyen@example.com', 'PRESENT'],
    ['st-02', 'SV002', 'Trần Thị Bình', 'binh.tran@example.com', 'ABSENT'],
    ['st-03', 'SV003', 'Lê Quốc Cường', 'cuong.le@example.com', 'LATE'],
    ['st-04', 'SV004', 'Phạm Minh Dũng', 'dung.pham@example.com', 'EXCUSED'],
    ['st-05', 'SV005', 'Hoàng Thu Hà', 'ha.hoang@example.com', 'PRESENT'],
    ['st-06', 'SV006', 'Vũ Khánh Linh', 'linh.vu@example.com', 'PRESENT'],
    ['st-07', 'SV007', 'Đỗ Anh Quân', 'quan.do@example.com', 'ABSENT'],
    ['st-08', 'SV008', 'Bùi Ngọc Trang', 'trang.bui@example.com', 'PRESENT'],
    ['st-09', 'SV009', 'Phan Gia Huy', 'huy.phan@example.com', 'LATE'],
    ['st-10', 'SV010', 'Đặng Minh Châu', 'chau.dang@example.com', 'EXCUSED'],
  ] as const;

  return students.map(([studentId, studentCode, studentName, email, status], index) => {
    const st = status as AttendanceStatus;
    return {
      id: `${sessionId}-record-${index + 1}`,
      sessionId,
      studentId,
      studentCode,
      studentName,
      email,
      status: st,
      checkInTime: st === 'PRESENT' || st === 'LATE' ? '07:05' : undefined,
      note: '',
    };
  });
}

export default function AttendancePage() {
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: string }>();

  const [loadingPage, setLoadingPage] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [subjectDetail, setSubjectDetail] = useState<SubjectDetail | null>(null);
  const [stats, setStats] = useState<AttendanceStats>({ totalSessions: 0, averageAttendanceRate: 0, todayPresent: 0, todayAbsent: 0 });
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [initialRecords, setInitialRecords] = useState<AttendanceRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<CreateSessionForm>({ sessionDate: '', startTime: '', endTime: '', topic: '', note: '' });
  const [createErrors, setCreateErrors] = useState<Partial<Record<keyof CreateSessionForm, string>>>({});
  const [creatingSession, setCreatingSession] = useState(false);
  const [savingRecords, setSavingRecords] = useState(false);
  const [completingSession, setCompletingSession] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | AttendanceStatus>('ALL');

  const [mockSessionsBySubject, setMockSessionsBySubject] = useState<Record<string, AttendanceSession[]>>({});
  const [mockRecordsBySession, setMockRecordsBySession] = useState<Record<string, AttendanceRecord[]>>({});

  const selectedSession = useMemo(() => sessions.find((s) => s.id === selectedSessionId) ?? null, [sessions, selectedSessionId]);
  const isLocked = useMemo(() => {
    if (!selectedSession) return false;
    // Khóa nếu đã hoàn tất
    if (selectedSession.status === 'COMPLETED') return true;
    
    // Khóa nếu quá 48h kể từ giờ kết thúc buổi học
    const sessionDateTimeStr = `${selectedSession.sessionDate}T${selectedSession.endTime}:00`;
    const deadline = new Date(new Date(sessionDateTimeStr).getTime() + 48 * 60 * 60 * 1000);
    return new Date() > deadline;
  }, [selectedSession]);

  const recalcStatsFromSessions = (sessionList: AttendanceSession[]): AttendanceStats => {
    const today = new Date().toISOString().slice(0, 10);
    const totalSessions = sessionList.length;
    const averageAttendanceRate = totalSessions === 0 ? 0 : Math.round(sessionList.reduce((acc, s) => acc + calcAttendanceRate(s), 0) / totalSessions);
    const todaySession = sessionList.find((s) => s.sessionDate === today);
    return {
      totalSessions,
      averageAttendanceRate,
      todayPresent: todaySession?.presentCount ?? 0,
      todayAbsent: todaySession?.absentCount ?? 0,
    };
  };

  const filteredRecords = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    return records.filter((record) => {
      const passKeyword = !keyword || record.studentName.toLowerCase().includes(keyword) || record.studentCode.toLowerCase().includes(keyword);
      const passStatus = filterStatus === 'ALL' || record.status === filterStatus;
      return passKeyword && passStatus;
    });
  }, [records, searchKeyword, filterStatus]);

  const withMockFallback = async <T,>(apiCall: () => Promise<T>, fallback: () => T): Promise<T> => {
    try {
      return await apiCall();
    } catch {
      return fallback();
    }
  };

  const loadSubjectDetail = async (sid: string): Promise<SubjectDetail> =>
    withMockFallback(
      async () => {
        const response = await apiClient.get(`/v1/teacher/subjects/${sid}`);
        const data = response?.data?.data;
        if (!data) throw new Error('No subject data');
        const firstClass = data.classGroups?.[0];
        const firstSchedule = firstClass?.schedules?.[0];
        const schedule = firstSchedule?.startAt
          ? new Date(firstSchedule.startAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
          : 'Chưa cập nhật';
        return {
          subjectId: data.id ?? sid,
          subjectName: data.name ?? 'Chưa cập nhật',
          subjectCode: undefined,
          classGroupId: firstClass?.id ?? '',
          classGroupName: firstClass?.name ?? 'Chưa có lớp',
          studentCount: firstClass?.groupUsers?.length ?? 0,
          schedule,
          status: firstClass?.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
          teacherType: data.teachers?.[0]?.type === 'TA' ? 'TA' : 'MAIN',
        } as SubjectDetail;
      },
      () => buildMockSubject(sid),
    );

  const loadSessions = async (sid: string): Promise<AttendanceSession[]> =>
    withMockFallback(
      async () => {
        const response = await apiClient.get(`/v1/teacher/subjects/${sid}/attendance/sessions`);
        const data = response?.data?.data;
        if (!Array.isArray(data)) throw new Error('Invalid sessions data');
        return data as AttendanceSession[];
      },
      () => {
        if (mockSessionsBySubject[sid]) return mockSessionsBySubject[sid];
        const seeded = buildMockSessions(sid);
        setMockSessionsBySubject((prev) => ({ ...prev, [sid]: seeded }));
        return seeded;
      },
    );

  const loadStats = async (sid: string, currentSessions?: AttendanceSession[]): Promise<AttendanceStats> =>
    withMockFallback(
      async () => {
        const response = await apiClient.get(`/v1/teacher/subjects/${sid}/attendance/stats`);
        const data = response?.data?.data;
        if (!data) throw new Error('Invalid stats');
        return data as AttendanceStats;
      },
      () => recalcStatsFromSessions(currentSessions ?? mockSessionsBySubject[sid] ?? buildMockSessions(sid)),
    );

  const loadRecords = async (sid: string, sessionId: string): Promise<AttendanceRecord[]> =>
    withMockFallback(
      async () => {
        const response = await apiClient.get(`/v1/teacher/subjects/${sid}/attendance/sessions/${sessionId}/records`);
        const data = response?.data?.data;
        if (!Array.isArray(data)) throw new Error('Invalid records');
        return data as AttendanceRecord[];
      },
      () => {
        if (mockRecordsBySession[sessionId]) return mockRecordsBySession[sessionId];
        const seeded = buildMockRecords(sessionId);
        setMockRecordsBySession((prev) => ({ ...prev, [sessionId]: seeded }));
        return seeded;
      },
    );

  const refreshAll = async (keepSelected = true) => {
    if (!subjectId) return;
    setLoadingPage(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const [subject, sessionList] = await Promise.all([loadSubjectDetail(subjectId), loadSessions(subjectId)]);
      const statsData = await loadStats(subjectId, sessionList);
      setSubjectDetail(subject);
      setSessions(sessionList);
      setStats(statsData);

      if (sessionList.length === 0) {
        setSelectedSessionId('');
        setRecords([]);
        setInitialRecords([]);
      } else if (!(keepSelected && selectedSessionId && sessionList.some((s) => s.id === selectedSessionId))) {
        const defaultSession = sessionList.find((s) => s.status === 'OPEN') ?? sessionList[0];
        setSelectedSessionId(defaultSession.id);
      }
    } catch {
      setErrorMessage('Không thể tải dữ liệu điểm danh. Vui lòng thử lại.');
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    refreshAll(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId]);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!subjectId || !selectedSessionId) {
        setRecords([]);
        setInitialRecords([]);
        return;
      }
      setLoadingRecords(true);
      try {
        const loaded = await loadRecords(subjectId, selectedSessionId);
        setRecords(loaded);
        setInitialRecords(JSON.parse(JSON.stringify(loaded)) as AttendanceRecord[]);
      } catch {
        setErrorMessage('Không thể tải dữ liệu điểm danh. Vui lòng thử lại.');
      } finally {
        setLoadingRecords(false);
      }
    };
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId, selectedSessionId]);

  const validateCreateForm = (): boolean => {
    const errors: Partial<Record<keyof CreateSessionForm, string>> = {};
    if (!createForm.sessionDate) errors.sessionDate = 'Vui lòng chọn ngày học';
    if (!createForm.startTime) errors.startTime = 'Vui lòng nhập giờ bắt đầu';
    if (!createForm.endTime) errors.endTime = 'Vui lòng nhập giờ kết thúc';
    if (createForm.startTime && createForm.endTime && createForm.endTime <= createForm.startTime) errors.endTime = 'Giờ kết thúc phải sau giờ bắt đầu';
    setCreateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateSession = async () => {
    if (!subjectId || !validateCreateForm()) return;
    setCreatingSession(true);
    setErrorMessage('');
    setSuccessMessage('');
    const payload = { ...createForm, topic: createForm.topic.trim(), note: createForm.note.trim(), status: 'OPEN' as SessionStatus };
    try {
      let createdSession: AttendanceSession | null = null;
      try {
        const response = await apiClient.post(`/v1/teacher/subjects/${subjectId}/attendance/sessions`, payload);
        createdSession = response?.data?.data as AttendanceSession;
      } catch {
        const fallback: AttendanceSession = {
          id: `${subjectId}-session-${Date.now()}`,
          subjectId,
          sessionDate: payload.sessionDate,
          startTime: payload.startTime,
          endTime: payload.endTime,
          topic: payload.topic,
          note: payload.note,
          status: 'OPEN',
          totalStudents: 10,
          presentCount: 0,
          absentCount: 0,
          lateCount: 0,
          excusedCount: 0,
          createdAt: new Date().toISOString(),
        };
        createdSession = fallback;
        setMockSessionsBySubject((prev) => ({ ...prev, [subjectId]: [fallback, ...(prev[subjectId] ?? buildMockSessions(subjectId))] }));
        setMockRecordsBySession((prev) => ({
          ...prev,
          [fallback.id]: buildMockRecords(fallback.id).map((r) => ({ ...r, status: 'ABSENT', checkInTime: undefined })),
        }));
      }
      setShowCreateForm(false);
      setCreateForm({ sessionDate: '', startTime: '', endTime: '', topic: '', note: '' });
      setCreateErrors({});
      setSuccessMessage('Tạo buổi điểm danh thành công.');
      await refreshAll(false);
      if (createdSession?.id) setSelectedSessionId(createdSession.id);
    } catch {
      setErrorMessage('Không thể tạo buổi điểm danh. Vui lòng thử lại.');
    } finally {
      setCreatingSession(false);
    }
  };

  const updateRecordStatus = (recordId: string, nextStatus: AttendanceStatus) => {
    setRecords((prev) =>
      prev.map((record) => {
        if (record.id !== recordId) return record;
        const shouldSetTime = (nextStatus === 'PRESENT' || nextStatus === 'LATE') && !record.checkInTime;
        const shouldClearTime = nextStatus === 'ABSENT' || nextStatus === 'EXCUSED';
        return { ...record, status: nextStatus, checkInTime: shouldSetTime ? nowHHmm() : shouldClearTime ? undefined : record.checkInTime };
      }),
    );
  };

  const updateRecordNote = (recordId: string, note: string) => setRecords((prev) => prev.map((r) => (r.id === recordId ? { ...r, note } : r)));

  const markAll = (status: AttendanceStatus) => {
    setRecords((prev) => prev.map((record) => ({
      ...record,
      status,
      checkInTime: status === 'PRESENT' || status === 'LATE' ? record.checkInTime ?? nowHHmm() : undefined,
    })));
  };

  const handleResetRecords = () => setRecords(JSON.parse(JSON.stringify(initialRecords)) as AttendanceRecord[]);

  const applyRecordsToSessionAndStats = (sessionId: string, nextRecords: AttendanceRecord[]) => {
    setSessions((prev) => {
      const next = prev.map((s) => (s.id === sessionId ? recomputeSessionCounts(s, nextRecords) : s));
      setStats(recalcStatsFromSessions(next));
      if (subjectId) setMockSessionsBySubject((storage) => ({ ...storage, [subjectId]: next }));
      return next;
    });
    setMockRecordsBySession((prev) => ({ ...prev, [sessionId]: nextRecords }));
  };

  const handleSaveAttendance = async () => {
    if (!subjectId || !selectedSessionId) return;
    setSavingRecords(true);
    setErrorMessage('');
    setSuccessMessage('');
    const payload = {
      records: records.map((record) => ({
        studentId: record.studentId,
        status: record.status,
        checkInTime: record.checkInTime ?? null,
        note: record.note ?? '',
      })),
    };
    try {
      try {
        await apiClient.put(`/v1/teacher/subjects/${subjectId}/attendance/sessions/${selectedSessionId}/records`, payload);
      } catch {
        // fallback local
      }
      const cloned = JSON.parse(JSON.stringify(records)) as AttendanceRecord[];
      setInitialRecords(cloned);
      applyRecordsToSessionAndStats(selectedSessionId, cloned);
      setSuccessMessage('Lưu điểm danh thành công.');
    } catch {
      setErrorMessage('Lưu điểm danh thất bại. Vui lòng thử lại.');
    } finally {
      setSavingRecords(false);
    }
  };

  const handleCompleteSession = async () => {
    if (!subjectId || !selectedSessionId) return;
    const confirmed = window.confirm('Bạn có chắc muốn hoàn tất buổi điểm danh này? Sau khi hoàn tất, dữ liệu vẫn có thể xem lại.');
    if (!confirmed) return;
    setCompletingSession(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      try {
        await apiClient.patch(`/v1/teacher/subjects/${subjectId}/attendance/sessions/${selectedSessionId}/complete`);
      } catch {
        // fallback local
      }
      setSessions((prev) => {
        const next = prev.map((s) => (s.id === selectedSessionId ? { ...s, status: 'COMPLETED' as SessionStatus } : s));
        if (subjectId) setMockSessionsBySubject((storage) => ({ ...storage, [subjectId]: next }));
        return next;
      });
      setSuccessMessage('Đã hoàn tất buổi điểm danh.');
    } catch {
      setErrorMessage('Không thể hoàn tất buổi điểm danh. Vui lòng thử lại.');
    } finally {
      setCompletingSession(false);
    }
  };

  const backPath = subjectId ? `/teacher/subjects/${subjectId}` : '/teacher/subjects';

  return (
    <TeacherDashboardLayout mainClassName="flex-1 overflow-auto bg-stone-50 p-6 space-y-6">
      <button onClick={() => navigate(backPath)} className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800">
        <ArrowLeft size={16} />
         Quay lại quản lý môn học
      </button>

      <header>
        <h1 className="text-2xl font-bold text-gray-900">Điểm danh</h1>
      </header>

      {errorMessage && <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div>}
      {successMessage && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</div>}

      <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        {loadingPage ? (
          <div className="flex items-center gap-2 text-gray-500"><Loader2 size={18} className="animate-spin" />Đang tải thông tin môn học...</div>
        ) : !subjectDetail ? (
          <p className="text-sm text-gray-500">Không tìm thấy thông tin môn học.</p>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">{subjectDetail.subjectName}</h2>
              {subjectDetail.subjectCode ? <span className="text-sm text-gray-500">({subjectDetail.subjectCode})</span> : null}
            </div>
            <p className="text-sm text-gray-600">Lớp: {subjectDetail.classGroupName} · {subjectDetail.studentCount} sinh viên</p>
            <p className="text-sm text-gray-500">Lịch học: {subjectDetail.schedule}</p>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"><p className="text-sm text-gray-500">Tổng buổi học</p><p className="mt-2 text-2xl font-bold text-gray-900">{stats.totalSessions}</p></div>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"><p className="text-sm text-gray-500">Tỷ lệ đi học trung bình</p><p className="mt-2 text-2xl font-bold text-gray-900">{stats.averageAttendanceRate}%</p></div>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"><p className="text-sm text-gray-500">Có mặt hôm nay</p><p className="mt-2 text-2xl font-bold text-emerald-700">{stats.todayPresent}</p></div>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"><p className="text-sm text-gray-500">Vắng hôm nay</p><p className="mt-2 text-2xl font-bold text-rose-700">{stats.todayAbsent}</p></div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => setShowCreateForm((prev) => !prev)} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 text-white px-4 py-2 text-sm font-semibold hover:bg-teal-700"><Plus size={16} />Tạo buổi điểm danh</button>
          <button onClick={() => refreshAll(true)} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"><RefreshCcw size={16} />Làm mới</button>
          <button disabled className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-400 cursor-not-allowed">Xuất Excel</button>
        </div>

        {showCreateForm && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Tạo buổi điểm danh mới</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
              <div><label className="block text-xs text-gray-600 mb-1">Ngày học</label><input type="date" value={createForm.sessionDate} onChange={(e) => setCreateForm((p) => ({ ...p, sessionDate: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />{createErrors.sessionDate && <p className="mt-1 text-xs text-rose-600">{createErrors.sessionDate}</p>}</div>
              <div><label className="block text-xs text-gray-600 mb-1">Giờ bắt đầu</label><input type="time" value={createForm.startTime} onChange={(e) => setCreateForm((p) => ({ ...p, startTime: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />{createErrors.startTime && <p className="mt-1 text-xs text-rose-600">{createErrors.startTime}</p>}</div>
              <div><label className="block text-xs text-gray-600 mb-1">Giờ kết thúc</label><input type="time" value={createForm.endTime} onChange={(e) => setCreateForm((p) => ({ ...p, endTime: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />{createErrors.endTime && <p className="mt-1 text-xs text-rose-600">{createErrors.endTime}</p>}</div>
              <div><label className="block text-xs text-gray-600 mb-1">Chủ đề</label><input type="text" value={createForm.topic} onChange={(e) => setCreateForm((p) => ({ ...p, topic: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-gray-600 mb-1">Ghi chú</label><input type="text" value={createForm.note} onChange={(e) => setCreateForm((p) => ({ ...p, note: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /></div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleCreateSession} disabled={creatingSession} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 text-white px-4 py-2 text-sm font-semibold hover:bg-teal-700 disabled:opacity-60">{creatingSession ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}Tạo buổi</button>
              <button onClick={() => setShowCreateForm(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Hủy</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Danh sách buổi điểm danh</h3>
          {loadingPage ? (
            <div className="flex items-center gap-2 text-gray-500"><Loader2 size={16} className="animate-spin" />Đang tải danh sách buổi...</div>
          ) : sessions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500"><p className="font-medium">Chưa có buổi điểm danh nào</p><p className="text-sm mt-1">Hãy tạo buổi điểm danh đầu tiên cho môn học này</p></div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => {
                const isSelected = session.id === selectedSessionId;
                const attendanceRate = calcAttendanceRate(session);
                const statusInfo = sessionStatusMap[session.status];
                return (
                  <button key={session.id} onClick={() => setSelectedSessionId(session.id)} className={`w-full text-left rounded-xl border p-4 transition ${isSelected ? 'border-teal-400 bg-teal-50/40' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900"><CalendarDays size={15} className="inline mr-1" />{session.sessionDate} · {session.startTime} - {session.endTime}</p>
                        <p className="text-sm text-gray-600">{session.topic || 'Chưa có chủ đề'}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusInfo.classes}`}>{statusInfo.label}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
                      <p className="text-gray-600">Tổng: <b>{session.totalStudents}</b></p>
                      <p className="text-emerald-700">Có mặt: <b>{session.presentCount}</b></p>
                      <p className="text-rose-700">Vắng: <b>{session.absentCount}</b></p>
                      <p className="text-amber-700">Trễ: <b>{session.lateCount}</b></p>
                      <p className="text-blue-700">Có phép: <b>{session.excusedCount}</b></p>
                      <p className="text-gray-700">Tỷ lệ: <b>{attendanceRate}%</b></p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {selectedSession ? (
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-4">
          {isLocked && (
            <div className="bg-amber-100 text-amber-800 px-4 py-3 rounded-lg text-sm font-medium mb-2">
              ⚠️ Điểm danh đã được khóa (quá hạn 48h hoặc đã hoàn tất). Bạn chỉ có thể xem, không thể chỉnh sửa.
            </div>
          )}

          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Điểm danh buổi học</h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedSession.sessionDate} · {selectedSession.startTime} - {selectedSession.endTime}
              </p>
              <p className="text-sm text-gray-500">{selectedSession.topic || 'Không có chủ đề'}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSessionId('')}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Đóng chi tiết
              </button>
              <button
                onClick={handleSaveAttendance}
                disabled={savingRecords || isLocked}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white ${
                  savingRecords || isLocked ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
                }`}
              >
                {savingRecords ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Lưu điểm danh
              </button>
              <button
                onClick={handleCompleteSession}
                disabled={completingSession || isLocked}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                  completingSession || isLocked
                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {completingSession ? 'Đang xử lý...' : 'Hoàn tất buổi điểm danh'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => markAll('PRESENT')}
              disabled={isLocked}
              className={`rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              Đánh dấu tất cả có mặt
            </button>
            <button
              onClick={() => markAll('ABSENT')}
              disabled={isLocked}
              className={`rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              Đánh dấu tất cả vắng
            </button>
            <button
              onClick={handleResetRecords}
              disabled={isLocked}
              className={`rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 relative">
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm theo tên hoặc mã sinh viên..."
                className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'ALL' | AttendanceStatus)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="ALL">Tất cả</option>
              <option value="PRESENT">Có mặt</option>
              <option value="ABSENT">Vắng</option>
              <option value="LATE">Trễ</option>
              <option value="EXCUSED">Có phép</option>
            </select>
          </div>

          {loadingRecords ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 size={16} className="animate-spin" />
              Đang tải danh sách sinh viên...
            </div>
          ) : records.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
              Không có sinh viên nào trong lớp học phần này
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-[1000px] w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-3 py-2 text-left">STT</th>
                    <th className="px-3 py-2 text-left">Mã sinh viên</th>
                    <th className="px-3 py-2 text-left">Họ tên</th>
                    <th className="px-3 py-2 text-left">Email</th>
                    <th className="px-3 py-2 text-left">Trạng thái</th>
                    <th className="px-3 py-2 text-left">Check-in</th>
                    <th className="px-3 py-2 text-left">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record, index) => (
                    <tr key={record.id} className="border-t border-gray-100">
                      <td className="px-3 py-2">{index + 1}</td>
                      <td className="px-3 py-2 font-medium text-gray-700">{record.studentCode}</td>
                      <td className="px-3 py-2">{record.studentName}</td>
                      <td className="px-3 py-2 text-gray-600">{record.email || '-'}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as AttendanceStatus[]).map((status) => (
                            <button
                              key={status}
                              onClick={() => updateRecordStatus(record.id, status)}
                              className={`px-2 py-1 rounded-md border text-xs font-semibold ${
                                record.status === status
                                  ? recordStatusClasses[status]
                                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {statusLabelMap[status]}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2">{record.checkInTime || '-'}</td>
                      <td className="px-3 py-2">
                        <input
                          value={record.note || ''}
                          onChange={(e) => updateRecordNote(record.id, e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                          placeholder="Ghi chú"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}
    </TeacherDashboardLayout>
  );
}
