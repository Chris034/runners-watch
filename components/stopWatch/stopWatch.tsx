'use client ';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import './stopWatch.style.css';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AudioPaths } from '@/utility/constants';
import { convertMinToMs, formatMsToDisplay } from '@/utility/time';

export const majorTicks = ["twelve", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven"];

const stopWatchInterval = 50;

interface WatchState {
    isActive: boolean;
    isPaused: boolean;
    isWalking: boolean;
    walkLength: number;
    runLength: number;
    numberOfWalkIntervals: number;
    numberOfRunIntervals: number;
    currentWalkInterval: number;
    currentRunInterval: number;
    totalTime: number;
    currentIntervalTime: number;
    endOfLastInterval: number;
    totalWalkTime: number;
    totalRunTime: number;
    isComplete: boolean
}

export function StopWatch() {

    const audioAlarmRef = useRef<HTMLAudioElement>(null);
    const audioWalkRef = useRef<HTMLAudioElement>(null);
    const audioRunRef = useRef<HTMLAudioElement>(null);

    const [clockHandKey, setClockHandKey] = useState(0);

    const resetClockHandAnimation = () => {
        setClockHandKey(prevKey => prevKey + 1);
    };

    const [watchState, setWatchState] = useState<WatchState>({
        isActive: false,
        isPaused: false,
        isWalking: true,
        walkLength: 1,
        runLength: 1,
        numberOfWalkIntervals: 1,
        numberOfRunIntervals: 1,
        currentWalkInterval: 0,
        currentRunInterval: 0,
        totalTime: 0,
        currentIntervalTime: 0,
        endOfLastInterval: 0,
        totalWalkTime: 0,
        totalRunTime: 0,
        isComplete: false
    });

    const isAnimationPaused = watchState.isPaused || !watchState.isActive || watchState.isComplete

    useEffect(() => {
        let interval = null;
 
        if (watchState.isActive && watchState.isPaused === false && !watchState.isComplete) {
            interval = setInterval(() => {
                setWatchState((prev) => {
                    let updatedTotalWalkTime = prev.totalWalkTime;
                    let updatedTotalRunTime = prev.totalRunTime;
                    let endOfLastInterval = prev.endOfLastInterval;
                    let updatedTotalTime = prev.totalTime + stopWatchInterval;
                    let isWalking = prev.isWalking;
                    let currentWalkInterval = prev.currentWalkInterval;
                    let currentRunInterval = prev.currentRunInterval;
                    let isComplete = prev.isComplete;
                    let isActive = prev.isActive;
                    let isPaused = prev.isPaused;
                    let isIntervalSwitch = false;

                    if (prev.isWalking) {
                        updatedTotalWalkTime += stopWatchInterval;
                        const currentIntervalLength = prev.totalTime - endOfLastInterval
                        if (currentIntervalLength >= convertMinToMs(prev.walkLength)) {
                           endOfLastInterval = prev.totalTime;
                           isWalking = false;
                           isIntervalSwitch = true;
                           currentWalkInterval += 1;
                        }
                    } else {
                        updatedTotalRunTime += stopWatchInterval; 
                        const currentIntervalLength = prev.totalTime - endOfLastInterval
                        if (currentIntervalLength >= convertMinToMs(prev.runLength)) {
                            endOfLastInterval = prev.totalTime;
                            isWalking = true;
                            isIntervalSwitch = true;
                            currentRunInterval += 1;
                         }
                    }

                    if(currentWalkInterval >= prev.numberOfWalkIntervals && currentRunInterval >= prev.numberOfRunIntervals) {
                        isComplete = true;
                        isActive = false;
                        isPaused = true;
                        updatedTotalTime = prev.totalTime;
                        handlePlayCompleteAlarm();
                    }

                    if(!isComplete) {
                        if(isIntervalSwitch) {
                            if(isWalking) {
                                handlePlayWalkAlarm();
                            } else {
                                handlePlayRunAlarm();
                            }
                        }
                    }

                    return {
                        ...prev,
                        totalTime: updatedTotalTime,
                        totalWalkTime: updatedTotalWalkTime,
                        totalRunTime: updatedTotalRunTime,
                        endOfLastInterval: endOfLastInterval,
                        currentIntervalTime: currentRunInterval,
                        currentWalkInterval: currentWalkInterval,
                        currentRunInterval: currentRunInterval,
                        isWalking: isWalking,
                        isComplete: isComplete,
                        isPaused: isPaused,
                    };
                });
            }, stopWatchInterval);
        } else {
            interval && clearInterval(interval);
        }
        return () => {
            interval && clearInterval(interval);
        };
    }, [watchState.isActive, watchState.isPaused]);

    // useEffect(() => {
    //     if (watchState.isComplete) {
    //         handlePlayCompleteAlarm();
    //     }
    // }, [watchState.isComplete]);

    // useEffect(() => {
    //     if (watchState.isActive) {
    //     }
    // }, [watchState.currentRunInterval]);

    // useEffect(() => {
    //     if (watchState.isActive) {
    //         handlePlayRunAlarm();

    //     }
    // }, [watchState.currentWalkInterval]);
 
    const handleStart = () => {
        setWatchState((prev) => ({...prev, isActive: true, isPaused: false}));
        handlePlayWalkAlarm();
    };
 
    const handlePauseResume = () => {
        setWatchState((prev) => ({...prev, isActive: true, isPaused: true}));
    };
 
    const handleReset = () => {
        setWatchState((prev) => ({...prev, 
            isActive: false,
            isPaused: false,
            isWalking: true,
            currentWalkInterval: 0,
            currentRunInterval: 0,
            totalTime: 0,
            currentIntervalTime: 0,
            endOfLastInterval: 0,
            totalWalkTime: 0,
            totalRunTime: 0,
            isComplete: false

        }));
        resetClockHandAnimation();
    };

    // const handleWalkIntervalChange = (event: ChangeEvent<HTMLInputElement>) => {
    //     let newInterval = parseInt(event.target.value);
    //     if(!newInterval) newInterval = 0;
    //     setWatchState(prevState => ({
    //       ...prevState,
    //       numberOfWalkIntervals: newInterval
    //     }));
    //   };
      
      const handleIntervalChange = (event: ChangeEvent<HTMLInputElement>) => {
        let newInterval = parseInt(event.target.value);
        if(!newInterval) newInterval = 0;
        setWatchState(prevState => ({
          ...prevState,
          numberOfRunIntervals: newInterval,
          numberOfWalkIntervals: newInterval
        }));
      };
      
      const handleWalkLengthChange = (event: ChangeEvent<HTMLInputElement>) => {
        let newLength = parseInt(event.target.value);
        if(!newLength) newLength = 0;
        setWatchState(prevState => ({
          ...prevState,
          walkLength: newLength
        }));
      };
      
      const handleRunLengthChange = (event: ChangeEvent<HTMLInputElement>) => {
        let newLength = parseInt(event.target.value);
        if(!newLength) newLength = 0;
        setWatchState(prevState => ({
          ...prevState,
          runLength: newLength
        }));
      };
    

    const handlePlayCompleteAlarm = () => {
        audioAlarmRef?.current?.play();
        setTimeout(() => {
            audioAlarmRef?.current?.pause();
        }, 2000);
      };

      const handlePlayWalkAlarm = () => {
        audioWalkRef?.current?.play();
      };

      
      const handlePlayRunAlarm = () => {
        audioRunRef?.current?.play();
      };


    console.log(watchState)
    return (
        <>
            <audio ref={audioAlarmRef} src={AudioPaths.alarm} />
            <audio ref={audioRunRef} src={AudioPaths.startRunning} />
            <audio ref={audioWalkRef} src={AudioPaths.startWalking} />
            <div className="clock-container">
                <div className="clock">
                    {
                        majorTicks.map((majorTick) => {
                            return (
                                <div key={majorTick} className={`major ${majorTick}`}>
                                    <div className="minor minor-one"></div>
                                    <div className="minor minor-two"></div>
                                    <div className="minor minor-three"></div>
                                    <div className="minor minor-four"></div>
                                    <div className="minor minor-five"></div>
                                    <div className="minor minor-six"></div>
                                    <div className="minor minor-seven"></div>
                                    <div className="minor minor-eight"></div>
                                    <div className="minor minor-nine"></div>
                                </div>
                            )
                        })
                    }

                    <div className="segment twelve"> <div className="numeral"> 0</div></div>
                    <div className="segment one">    <div className="numeral"> 5</div></div>
                    <div className="segment two">    <div className="numeral">10</div></div>
                    <div className="segment three">  <div className="numeral">15</div></div>
                    <div className="segment four">   <div className="numeral">20</div></div>
                    <div className="segment five">   <div className="numeral">25</div></div>
                    <div className="segment six">    <div className="numeral">30</div></div>
                    <div className="segment seven">  <div className="numeral">35</div></div>
                    <div className="segment eight">  <div className="numeral">40</div></div>
                    <div className="segment nine">   <div className="numeral">45</div></div>
                    <div className="segment ten">    <div className="numeral">50</div></div>
                    <div className="segment eleven"> <div className="numeral">55</div></div>

                    <div className="dot"></div>
                    <div id='clock-hand' key={clockHandKey} className={`hand ${isAnimationPaused ? 'paused' : ''}`}></div>
                    <div className='timer'>{formatMsToDisplay(watchState.totalTime)}</div>
                </div>
                {watchState.isActive && (watchState.isComplete ? 'Complete': watchState.isWalking ? 'Walking' : 'Running')}
                {watchState.isActive && `Interval: ${watchState.currentWalkInterval}`}

            </div>

            <div className='button-group-container'>
                <div className='button-group'>
                    <Label htmlFor="email">Walk Length</Label>
                    <Input onChange={handleWalkLengthChange} value={watchState.walkLength} type="number" id="walk-length-button" suffix='minutes' className="walk-length-button"/>

                    {/* <Label htmlFor="email">Walk Intervals</Label>
                    <Input onChange={handleWalkIntervalChange} value={watchState.numberOfWalkIntervals} type="number" id="walk-interval-button" suffix='intervals' className="walk-interval-button"/> */}

                    <Label htmlFor="email">Run Length</Label>
                    <Input onChange={handleRunLengthChange} value={watchState.runLength} type="number" id="run-length-button" suffix='minutes' className="run-length-button"/>

                    <Label htmlFor="email">Intervals</Label>
                    <Input onChange={handleIntervalChange} value={watchState.numberOfRunIntervals} type="number" id="run-interval-button" suffix='intervals' className="run-interval-button"/>

                    <div className='toggle-buttons'>
                        <Button size={"lg"} onClick={handleStart}>Start</Button>
                        <Button size={"lg"} onClick={handlePauseResume}>Stop</Button>
                        <Button size={"lg"} onClick={handleReset}>Reset</Button>
                    </div>
                </div>
            </div>
        </>
    )

}