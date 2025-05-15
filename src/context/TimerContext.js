import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';

const TimerContext = createContext();

const initialState = {
  timers: [],
  completedTimers: [],
};

const timerReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TIMER':
      return {
        ...state,
        timers: [...state.timers, { ...action.payload, id: Date.now() }],
      };
    case 'UPDATE_TIMER':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload.id ? { ...timer, ...action.payload } : timer
        ),
      };
    case 'DELETE_TIMER':
      return {
        ...state,
        timers: state.timers.filter((timer) => timer.id !== action.payload),
      };
    case 'COMPLETE_TIMER':
      const completedTimer = state.timers.find((timer) => timer.id === action.payload);
      return {
        ...state,
        timers: state.timers.filter((timer) => timer.id !== action.payload),
        completedTimers: [...state.completedTimers, { ...completedTimer, completedAt: new Date() }],
      };
    case 'LOAD_TIMERS':
      return {
        ...state,
        timers: action.payload.timers || [],
        completedTimers: action.payload.completedTimers || [],
      };
    default:
      return state;
  }
};

export const TimerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const intervals = useRef({});
  const timersRef = useRef(state.timers);

  useEffect(() => {
    timersRef.current = state.timers;
  }, [state.timers]);

  useEffect(() => {
    const savedState = localStorage.getItem('timerState');
    if (savedState) {
      dispatch({ type: 'LOAD_TIMERS', payload: JSON.parse(savedState) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('timerState', JSON.stringify(state));
  }, [state]);

  // Timer logic
  const startTimer = (timer) => {
    if (intervals.current[timer.id] || timer.status === 'running') return;
    dispatch({ type: 'UPDATE_TIMER', payload: { ...timer, status: 'running' } });
    intervals.current[timer.id] = setInterval(() => {
      // Always get the latest timer state from timersRef
      const currentTimer = timersRef.current.find((t) => t.id === timer.id);
      if (!currentTimer || currentTimer.status !== 'running') {
        clearInterval(intervals.current[timer.id]);
        delete intervals.current[timer.id];
        return;
      }
      if (currentTimer.remainingTime <= 1) {
        clearInterval(intervals.current[timer.id]);
        delete intervals.current[timer.id];
        dispatch({ type: 'COMPLETE_TIMER', payload: timer.id });
      } else {
        dispatch({
          type: 'UPDATE_TIMER',
          payload: {
            ...currentTimer,
            remainingTime: currentTimer.remainingTime - 1,
            status: 'running',
          },
        });
      }
    }, 1000);
  };

  const pauseTimer = (timer) => {
    if (intervals.current[timer.id]) {
      clearInterval(intervals.current[timer.id]);
      delete intervals.current[timer.id];
    }
    dispatch({ type: 'UPDATE_TIMER', payload: { ...timer, status: 'paused' } });
  };

  const resetTimer = (timer) => {
    if (intervals.current[timer.id]) {
      clearInterval(intervals.current[timer.id]);
      delete intervals.current[timer.id];
    }
    dispatch({
      type: 'UPDATE_TIMER',
      payload: { ...timer, remainingTime: timer.duration, status: 'idle' },
    });
  };

  const addTimer = (timer) => {
    dispatch({ type: 'ADD_TIMER', payload: timer });
  };

  const updateTimer = (timer) => {
    dispatch({ type: 'UPDATE_TIMER', payload: timer });
  };

  const deleteTimer = (id) => {
    if (intervals.current[id]) {
      clearInterval(intervals.current[id]);
      delete intervals.current[id];
    }
    dispatch({ type: 'DELETE_TIMER', payload: id });
  };

  const completeTimer = (id) => {
    if (intervals.current[id]) {
      clearInterval(intervals.current[id]);
      delete intervals.current[id];
    }
    dispatch({ type: 'COMPLETE_TIMER', payload: id });
  };

  return (
    <TimerContext.Provider
      value={{
        timers: state.timers,
        completedTimers: state.completedTimers,
        addTimer,
        updateTimer,
        deleteTimer,
        completeTimer,
        startTimer,
        pauseTimer,
        resetTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}; 