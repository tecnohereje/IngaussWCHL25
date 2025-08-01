import React from 'react';

// We define the types for the props.
// 'style' is a React CSSProperties object.
interface SkeletonProps {
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ style }) => {
  return (
    <div className="skeleton" style={style}></div>
  );
};

export default Skeleton;