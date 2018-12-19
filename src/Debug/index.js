import React from 'react';

const Debug = ({ pressure, lineWidth}) => (
  <code>
    Pressure: { pressure } <br/>
    lineWidth: { lineWidth }
  </code>
);

export default Debug;