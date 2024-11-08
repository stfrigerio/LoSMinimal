import { BooleanHabitsData, BooleanHabitSetting } from '@/src/types/BooleanHabits';

export type UseBooleanHabitsReturnType = {
  habits: BooleanHabitSetting[];
  emojis: { [key: string]: string };
  handleToggle: (uiid: string, habitKey: string) => Promise<void>;
};

export type UseBooleanHabitsType = (
  data: BooleanHabitsData[] | undefined,
  date: string,
) => UseBooleanHabitsReturnType;