import React from 'react';
import './speedtest.module.scss';

/* eslint-disable-next-line */
export interface SpeedtestProps {}

export function Speedtest(props: SpeedtestProps) {
  return (
    <div>
      <h1>included component from speedtest library (libs/speedtest)</h1>
    </div>
  );
}

export default Speedtest;
