import React from 'react';

// Definimos los tipos para las props.
// 'style' es un objeto de estilos CSS de React.
interface SkeletonProps {
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ style }) => {
  return (
    <div className="skeleton" style={style}></div>
  );
};

export default Skeleton;