import React, { ProfilerOnRenderCallback, ProfilerProps } from "react";

type MyProfilerProps = {
  metaData?: any;
  phases?: ("mount" | "update")[];
} & Omit<ProfilerProps, "onRender">;

let queue: unknown[] = [];

const sendProfileQueue = () => {
  if (!queue.length) {
    return;
  }
  const queueToSend = [...queue];
  queue = [];
  console.log(queueToSend);
};
setInterval(sendProfileQueue, 5000);

export const MyProfiler = ({ metaData, phases, ...props }: MyProfilerProps) => {
  const reportProfile: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) => {
    //不传phases记录，命中phases记录
    if (!phases || phases.includes(phase)) {
      queue.push({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
        metaData,
      });
    }
  };

  return <React.Profiler onRender={reportProfile} {...props} />;
};
