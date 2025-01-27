import React, { useEffect, useRef } from "react";

const DAYS_TO_COUNT = 30;

export default function Countdown() {
  const countdownRef = useRef(null);

  useEffect(() => {
    const startDate = new Date(2025, 0, 27, 20, 16, 0).getTime();

    const targetDate = startDate + DAYS_TO_COUNT * 24 * 60 * 60 * 1000;

    function updateCountdown() {
      const now = new Date().getTime();
      const timeLeft = targetDate - now;

      if (timeLeft <= 0) {
        if (countdownRef.current) {
          countdownRef.current.textContent = "Tempo esgotado!";
        }
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);

      if (countdownRef.current) {
        countdownRef.current.textContent =
          `${days} dias, ${hours} horas, ` +
          `${minutes} minutos, ${seconds} segundos`;
      }
    }

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <h1>O tempo tá correndo, Macaco Loko!</h1>
      <div ref={countdownRef} />
    </div>
  );
}
