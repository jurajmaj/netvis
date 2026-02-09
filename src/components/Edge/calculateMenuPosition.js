export default function calculateMenuPosition(
  position,
  sourceX,
  sourceY,
  targetX,
  targetY,
  distance
) {
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const dirX = dx / length;
  const dirY = dy / length;

  const newPosSourceX = sourceX + dirX * distance;
  const newPosSourceY = sourceY + dirY * distance;
  const newPosTargetX = targetX - dirX * distance;
  const newPosTargetY = targetY - dirY * distance;

  return `translate(-50%, -100%) translate(${
    position === "source" ? newPosSourceX : newPosTargetX
  }px,${position === "source" ? newPosSourceY : newPosTargetY}px)`;
}
