/**
 * DashboardCard Component
 * Reusable card for displaying health metrics
 */

export const DashboardCard = ({ 
  title, 
  value, 
  unit, 
  status, 
  progress = null
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col mb-2">
        <h3 className="text-gray-600 font-medium text-sm mb-2">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">{value}</span>
          {unit && <span className="text-gray-500 font-medium">{unit}</span>}
        </div>
      </div>

      {status && (
        <div className="mt-3">
          <span className="text-sm px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
            {status}
          </span>
        </div>
      )}

      {progress !== null && (
        <div className="mt-4 bg-gray-200 rounded-full h-2">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};

export const ScoreCard = ({ score, grade, message }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 shadow-lg text-white mb-8 flex flex-col md:flex-row items-center justify-between">
      <div className="text-center md:text-left mb-4 md:mb-0">
        <h2 className="text-lg font-medium text-blue-100 mb-1">Overall Health Score</h2>
        <div className="text-5xl font-bold mb-1">{score}</div>
        <div className="text-xl font-semibold text-blue-200">Grade: {grade}</div>
      </div>
      <div className="md:max-w-md text-center md:text-right">
        <p className="text-lg">{message}</p>
      </div>
    </div>
  );
};
