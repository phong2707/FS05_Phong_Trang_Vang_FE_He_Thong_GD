export type FileType = 'LINK' | 'PDF' | 'WORD' | 'EXCEL' | 'POWERPOINT' | 'IMAGE' | 'VIDEO' | 'ZIP' | 'OTHER';

export interface TaskmanResource {
  id: string;
  title: string;
  url: string;
  fileType: FileType;
  isVisible: boolean;
  sortOrder: number;
}

export interface ChapterWithResources {
  chapterId: string;
  chapterTitle: string;
  sortOrder: number;
  resources: TaskmanResource[];
}
