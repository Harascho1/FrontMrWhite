import { useEffect, useState } from "react";
import "./TimeBar.css";
import { object } from "framer-motion/m";

function TimeBar({ timeInMS }) {
  const safeTimeInMS = timeInMS > 0 ? timeInMS : 1;
  const [remainTime, setRemainTime] = useState(timeInMS);
  const percent = (remainTime / safeTimeInMS) * 100;
  const isTimeExpired = remainTime <= 0;
  useEffect(() => {
    setRemainTime(timeInMS);
  }, [timeInMS]);
  useEffect(() => {
    if (isTimeExpired) {
      return;
    }

    const intervalID = setInterval(() => {
      setRemainTime((prevTime) => prevTime - 1000);
    }, 1000);

    return () => clearInterval(intervalID);
  }, [isTimeExpired, timeInMS]);
  let color = "#4CAF50";
  if (percent < 25) {
    color = "red";
  } else if (percent < 50) {
    color = "orange";
  }
  return (
    <>
      {!isNaN(percent) && !isTimeExpired && (
        <div className="time-bar-container">
          <div
            className="time-bar"
            style={{ width: `${percent}%`, backgroundColor: color }}
          >
            {isTimeExpired ? "" : "" /*`${Math.round(percent)}%`*/}
          </div>
        </div>
      )}

      {/*
      <p>
        Preostalo vreme:
        <span style={{ fontWeight: "bold" }}>
          {fmtTime(Math.max(0, remainTime / 1000))}
        </span>
      </p>
			*/}
    </>
  );
}

export default TimeBar;
