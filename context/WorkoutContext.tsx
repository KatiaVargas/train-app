import React, { createContext, useState, useContext } from 'react';

export type ExerciseSet = {
  id: string;
  kg: string;
  reps: string;
  completed: boolean;
};

export type Exercise = {
  id: string;
  name: string;
  sets: ExerciseSet[];
};

export type WorkoutSession = {
  id: string;
  title: string;
  date: string; // e.g., "02 May 2026"
  duration: string; // e.g., "1h 15m"
  volume: string; // total kg lifted
  exercises: Exercise[];
};

interface WorkoutContextType {
  history: WorkoutSession[];
  addWorkout: (session: WorkoutSession) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<WorkoutSession[]>([]);

  const addWorkout = (session: WorkoutSession) => {
    setHistory((prev) => [session, ...prev]);
  };

  return (
    <WorkoutContext.Provider value={{ history, addWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkoutContext must be used within a WorkoutProvider');
  }
  return context;
};
