"use client";
import { useState, useRef, useEffect, type ReactNode } from "react";

interface ProgressBarProps {
  max: number;
  children?: ReactNode;
}

const ProgressBarComponent = ({ max, children }: ProgressBarProps) => {
  const [counted, setCounted] = useState(0);
  const targetElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startCountup = () => {
      const intervalId = setInterval(() => {
        setCounted((prevCounted) => {
          const newCounted = prevCounted + 1;
          if (newCounted >= max) {
            clearInterval(intervalId);
          }
          return newCounted;
        });
      }, 2000 / max);
    };

    const handleIntersection = (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver,
    ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCountup();
          observer.unobserve(entry.target);
        }
      });
    };

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    // Copy ra biến local: ref.current có thể đã đổi khi cleanup chạy.
    const el = targetElement.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, [max]);

  return (
    <>
      <div
        ref={targetElement}
        className="value"
        style={{ width: `${counted}%` }}
      >
        {children}
      </div>
    </>
  );
};

export default ProgressBarComponent;
