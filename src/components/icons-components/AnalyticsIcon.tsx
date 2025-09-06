

type Props = { isActive?: boolean; className?: string };

export function AnalyticsIcon({ isActive = false, className = "" }: Props) {
  const rootClass = `analytics-icon ${isActive ? "analytics-active" : ""} ${className}`;
  return (
    <div className={rootClass} aria-hidden>
      <div className="bars">
        <div className="bar bar-1" />
        <div className="bar bar-2" />
        <div className="bar bar-3" />
      </div>
    </div>
  );
}
