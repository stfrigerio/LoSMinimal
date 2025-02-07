import { DailyNoteData, NoteData } from '@/src/types/DailyNote';

export type UpdateParam = {
  type: 'booleanHabit' | 'quantifiableHabit';
  habitKey: string;
  value: number;
  date: string;
};

export type GenericUpdateParam = Partial<DailyNoteData> | UpdateParam;

export type UseDailyDataReturnType = {
  dailyData: DailyNoteData | null;
  setDailyData: React.Dispatch<React.SetStateAction<DailyNoteData | null>>;
  onUpdateDaySections: (updatedFields: Partial<NoteData>) => Promise<void>;
};

export type UseDailyDataType = (currentDate: Date, lastSubmissionTime: number) => UseDailyDataReturnType;