"use client";

import { useState, useEffect, ReactNode } from "react";
import LoadingDB from "./LoadingDB";

interface DelayedContentProps {
  children: ReactNode;
  minDelay?: number;
}

export default function DelayedContent({
  children,
  minDelay = 2000
}: DelayedContentProps) {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, minDelay);

    return () => clearTimeout(timer);
  }, [minDelay]);

  // Only show content when both conditions are met
  if (!animationFinished) {
    return (
      <LoadingDB
        shouldFinish={minTimeElapsed}
        onFinished={() => setAnimationFinished(true)}
      />
    );
  }

  return <>{children}</>;
}
