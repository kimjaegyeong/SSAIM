import { useState, useEffect } from 'react';
import styles from './MeetingCreatePage.module.css';
import Lottie from "lottie-react";
// import micLoding from "../../../assets/meeting/micLoding.json"
import micWave from "../../../assets/meeting/micWave.json"
// import micRec from "../../../assets/meeting/micRec.json"
import stopIcon from "../../../assets/meeting/stop.png"

const MeetingCreatePage = () => {
  const [timer, setTimer] = useState({ minutes: 0, seconds: 0, milliseconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTime) => {
        let { minutes, seconds, milliseconds } = prevTime;

        milliseconds += 1;
        if (milliseconds >= 100) {
          milliseconds = 0;
          seconds += 1;
        }
        if (seconds >= 60) {
          seconds = 0;
          minutes += 1;
        }

        return { minutes, seconds, milliseconds };
      });
    }, 10); 

    return () => clearInterval(interval); 
  }, []);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <div className={styles.container}>
      <h1>{formatTime(timer.minutes)}:{formatTime(timer.seconds)}:{formatTime(timer.milliseconds)}</h1>
      {/* <Lottie animationData={micLoding} style={{ width: 300, height: 300 }}/> */}
      <Lottie animationData={micWave} style={{ width: 400, height: 400 }}/>
      {/* <Lottie animationData={micRec} style={{ width: 400, height: 400 }}/> */}
      <img src={stopIcon} alt="Stop Icon" className={styles.stopIcon}/>
    </div>
  );
};

export default MeetingCreatePage;
