import React, { useEffect, useState } from "react";
import { Mint } from "./Btn";

type myTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const calculateTimeLeft = (): myTime => {
  const event = +new Date(2021, 8, 23, 20, 0, 0);
  const now = +new Date();

  let difference = event - now;
  let timeLeft: myTime = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState<myTime>(calculateTimeLeft());
  const [timesUp, setTimesUp] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    setTimesUp(
      () =>
        timeLeft.days == 0 &&
        timeLeft.hours == 0 &&
        timeLeft.minutes == 0 &&
        timeLeft.seconds == 0
    );
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  });

  return timesUp ? (
    <div className="test text-4xl md:text-6xl text-center my-auto text-white">
      Reload for mint
    </div>
  ) : (
    <div className="test text-4xl md:text-6xl text-center my-auto text-white">{`${timeLeft.days} days : ${timeLeft.hours} hours : ${timeLeft.minutes} minutes : ${timeLeft.seconds} seconds`}</div>
  );
}
