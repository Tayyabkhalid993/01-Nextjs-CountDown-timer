'use client'

import { useState, useRef, useEffect, ChangeEvent } from 'react';

export default function CountdownTimer() {
  const [duration, setDuration] = useState<number | string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetDuration = (): void => {
    if (typeof duration === 'number' && duration > 0) {
      setTimeLeft(duration);
      setIsActive(false);
      setIsPaused(false);
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    }
  };

  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const handlePause = (): void => {
    if (isActive) {
      setIsPaused(true);
      setIsActive(false);
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    }
  };

  const handleReset = (): void => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(typeof duration === 'number' ? duration : 0);
    if (timeRef.current) {
      clearInterval(timeRef.current);
    }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      timeRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearTimeout(timeRef.current!);
            setIsActive(false); // Ensure the countdown stops at 0
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    };
  }, [isActive, isPaused]);

  const formateTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')} | ${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || '');
  };

  return (
    <section className="main w-[90%] md:w-[50%]">
      <h1 className="text-center font-bold text-3xl">CountDown Timer</h1>
      <div className="blue-container flex flex-col md:flex-row justify-center items-center">
        {/* left side */}
        <div className="right w-full md:w-[50%] border-r-emerald-200 md:border-r">
          <div className='left-sec font-sans h-72 flex justify-center items-center overflow-auto'>
            <div className="sec1 p-5 flex-col items-center justify-center">
              <h2 className='font-bold text-lg '>Enter Time in Seconds</h2>
              <div className="inputBox flex justify-center items-center relative">
                <input
                  type="number"
                  value={duration}
                  onChange={handleDurationChange}
                />
              </div>

              <div className='flex justify-center'>
                <button
                  className="btn"
                  onClick={handleSetDuration}
                >
                  Set
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="left w-full md:w-[50%]">
          <div className="runningTime text-6xl text-center">
            {formateTime(timeLeft)}
          </div>
          <div className="time flex justify-center opacity-35">
            <span>&nbsp;&nbsp;&nbsp;min</span>
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              sec
            </span>
          </div>
          <br />

          <div className="buttons mt-4 text-center">
            <button className='btn' onClick={handleStart}>{isPaused ? 'Resume' : 'Start'}</button>
            <button className='btn' onClick={handlePause}>Pause</button>
            <button className='btn' onClick={handleReset}>Restart</button>
          </div>
        </div>
      </div>
    </section>
  );
}
