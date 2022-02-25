import React, { Component, createElement, useState, useEffect } from "react";
import ReactDOM from "react-dom";

const workouts = [
    "squats",
    "pushups",
    "pull ups",
];

const WorkoutBox: React.FC<{workout: string, isCurrent: boolean}> = ({workout, isCurrent}) => {
    const classes = isCurrent ? "workout-box current-workout" : "workout-box";
    return <div className={classes}>{workout}</div>
}

const Timer: React.FC<{startTime: number, duration: number}> = ({startTime, duration}) => {
    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const [timePaused, setTimePaused] = useState(0);
    const [paused, setPaused] = useState(true);

    const timerTextClasses = ["timer-text"];

    const updateInterval = 17;
    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = Date.now();
            const elapsedTime = currentTime - lastUpdate;
            if (paused) {
                setTimePaused(timePaused + elapsedTime);
            }
            setLastUpdate(currentTime);
        }, updateInterval);
        return () => {
            clearInterval(interval);
        };
    }, [timePaused, lastUpdate]);

    const elapsedTime = lastUpdate - startTime - timePaused;
    const secondsLeft = (duration - elapsedTime) / 1000;
    const displaySecondsLeft = secondsLeft < 0 ? 0 : secondsLeft;

    if (secondsLeft < 0) {
        timerTextClasses.push("done");
    }

    return <div>
        <div className={timerTextClasses.join(" ")}>{displaySecondsLeft.toFixed(2)}</div>
        <button onClick={() => setPaused(!paused)}>{paused ? "Start" : "Stop"}</button>
    </div>;
}

const MainDiv: React.FC<{}> = () => {
    const [currentWorkout, setCurrentWorkout] = useState(0);
    const [lastWorkoutStart, setLastWorkoutStart] = useState(Date.now());

    return <div className="main-div">
        <div className="workout-container">
            {workouts.map((workout, i) => <WorkoutBox key={workout} workout={workout} isCurrent={i == currentWorkout} />)}
        </div>
        <hr />
        <Timer startTime={lastWorkoutStart} duration={30 * 1000} />
        <br />
        <button className="button-done" disabled={currentWorkout === workouts.length - 1} onClick={() => {
            setCurrentWorkout(currentWorkout + 1);
            setLastWorkoutStart(Date.now());
        }}>Done</button>
    </div>
}

const domContainer = document.querySelector("#reactDom");
ReactDOM.render(createElement(MainDiv), domContainer);
