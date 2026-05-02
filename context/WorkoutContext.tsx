import React, { createContext, useState, useContext, useEffect } from 'react';

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
  date: string;
  duration: string;
  volume: string;
  exercises: Exercise[];
};

export type ProgressLog = {
  id: string;
  date: string;
  timestamp: number;
  weight: string;
  chest: string;
  waist: string;
  hips: string;
  photoUri?: string;
};

interface WorkoutContextType {
  history: WorkoutSession[];
  addWorkout: (session: WorkoutSession) => void;
  // Timer State
  timerTimeLeft: number;
  timerInitialTime: number;
  timerIsRunning: boolean;
  setTimerTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  setTimerInitialTime: React.Dispatch<React.SetStateAction<number>>;
  setTimerIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  // Progress State
  progressLogs: ProgressLog[];
  addProgressLog: (log: ProgressLog) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  
  // Global Timer State
  const [timerTimeLeft, setTimerTimeLeft] = useState(0);
  const [timerInitialTime, setTimerInitialTime] = useState(0);
  const [timerIsRunning, setTimerIsRunning] = useState(false);

  // Global Progress State
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);

  const addWorkout = (session: WorkoutSession) => {
    setHistory((prev) => [session, ...prev]);
  };

  const addProgressLog = (log: ProgressLog) => {
    setProgressLogs((prev) => {
      const newLogs = [...prev, log];
      // Sort by timestamp descending (newest first)
      return newLogs.sort((a, b) => b.timestamp - a.timestamp);
    });
  };

  // Global Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerIsRunning && timerTimeLeft > 0) {
      interval = setInterval(() => {
        setTimerTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerTimeLeft === 0 && timerIsRunning) {
      setTimerIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerIsRunning, timerTimeLeft]);

  return (
    <WorkoutContext.Provider value={{ 
      history, 
      addWorkout,
      timerTimeLeft,
      timerInitialTime,
      timerIsRunning,
      setTimerTimeLeft,
      setTimerInitialTime,
      setTimerIsRunning,
      progressLogs,
      addProgressLog
    }}>
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
