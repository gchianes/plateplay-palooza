
import React from 'react';
import { statesPaths } from '@/utils/statesPaths';

interface USAMapProps {
  spottedStates: string[];
  onStateClick: (stateId: string) => void;
}

const USAMap: React.FC<USAMapProps> = ({ spottedStates, onStateClick }) => {
  return (
    <div className="usa-map-container relative w-full aspect-[1.6/1]">
      <svg
        viewBox="0 0 959 593"
        className="w-full h-full"
      >
        <g className="states-group">
          {Object.entries(statesPaths).map(([stateId, pathData]) => (
            <path
              key={stateId}
              d={pathData.path}
              className={`state-path ${
                spottedStates.includes(stateId)
                  ? 'fill-accent stroke-accent-foreground'
                  : 'fill-muted stroke-border hover:fill-muted-foreground/20'
              } cursor-pointer transition-colors duration-200`}
              onClick={() => onStateClick(stateId)}
            >
              <title>{pathData.name}</title>
            </path>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default USAMap;
