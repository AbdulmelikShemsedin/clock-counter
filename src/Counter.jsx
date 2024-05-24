import { useState, useEffect, useRef } from 'react';
import './Counter.scss';

const Counter = () => {
    const [breakTime, setBreakTime] = useState(5);
    const [sessionTime, setSessionTime] = useState(25);
    const [min, setMin] = useState(sessionTime);
    const [sec, setSec] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isSession, setIsSession] = useState(true);
    const audioRef = useRef(null);

    const handleStartStop = () => {
        if (!isRunning) {
            document.getElementById('start_stop').classList.add('btn-danger');
        } else {
            document.getElementById('start_stop').classList.remove('btn-danger');
        }
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        document.getElementById('timer-label').textContent = 'Session';
        setIsRunning(false);
        setIsSession(true);
        setMin(sessionTime);
        setSec(0);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    const breakDecrement = () => {
        setBreakTime((c) => (c > 1 ? c - 1 : c));
    };

    const breakIncrement = () => {
        setBreakTime((c) => c < 60 ? c + 1 : c);
    };

    const sessionDecrement = () => {
        setSessionTime((c) => (c > 1 ? c - 1 : c));
        setMin((c) => (c > 1 ? c - 1 : c));
    };

    const sessionIncrement = () => {
        setSessionTime((c) => c < 60 ? c + 1 : c);
        setMin((c) => c < 60 ? c + 1 : c);
    };

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                if (sec > 0) {
                    setSec((prevSec) => prevSec - 1);
                } else if (min > 0 && sec === 0) {
                    setMin((prevMin) => prevMin - 1);
                    setSec(59);
                } else if (min === 0 && sec === 0) {
                    if (isSession) {
                        setIsSession(false);
                        setMin(breakTime);
                        document.getElementById('timer-label').textContent = 'Break';
                    } else {
                        setIsSession(true);
                        setMin(sessionTime);
                        document.getElementById('timer-label').textContent = 'Session';
                    }
                    setSec(0);
                    if (audioRef.current) {
                        audioRef.current.play();
                    }
                }
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning, min, sec, isSession, breakTime, sessionTime]);

    return (
        <div className="container text-center">
            <header className="title-box">
                <h1 className="title">Counter Clock</h1>
            </header>
            <hr className="breaker-1" />
            <main>
                <div className="measures">
                    <div className="break-label measure" id="break-label">
                        <p>Break Length</p>
                        <hr className="breaker-2" />
                        <div className="break-measure">
                            <button id="break-decrement" className="btn btn-danger" onClick={breakDecrement}>-</button>
                            <input type="number" className="set-time text-center" id="break-length" value={breakTime} readOnly />
                            <button id="break-increment" className="btn btn-primary" onClick={breakIncrement}>+</button>
                        </div>
                    </div>
                    <div className="session-label measure" id="session-label">
                        <p>Session Length</p>
                        <hr className="breaker-2" />
                        <div className="session-measure">
                            <button id="session-decrement" className="btn btn-danger" onClick={sessionDecrement}>-</button>
                            <input type="number" className="set-time text-center" id="session-length" value={sessionTime} readOnly />
                            <button id="session-increment" className="btn btn-primary" onClick={sessionIncrement}>+</button>
                        </div>
                    </div>
                </div>
                <div className="display-time">
                    <h2 id="timer-label">Session</h2>
                    <hr className="breaker-2" />
                    <p id="time-left">{String(min).padStart(2, '0')}:{String(sec).padStart(2, '0')}</p>
                </div>
                <div className="control-btns">
                    <button className="btn btn-primary" id="start_stop" onClick={handleStartStop}>
                        {isRunning ? '❚❚' : '▶'}
                    </button>
                    <button className="btn btn-warning" id="reset" onClick={handleReset}>⟳</button>
                </div>
            </main>
            <footer></footer>
            <audio id='beep' ref={audioRef} src='https://www.soundjay.com/button/sounds/beep-02.mp3'><source src="buttons/sounds/beep-02.mp3" type='audio/mp3' /></audio>
        </div>
    );
};

export default Counter;