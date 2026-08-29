import { ReactNode } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { FiAlertTriangle, FiInbox } from "react-icons/fi";

export const Spinner = ({ className = "size-8" }: { className?: string }) => (
  <BiLoaderCircle
    className={`animate-spin text-blue-600 ${className}`}
    role="status"
    aria-label="Loading"
  />
);

export const CenteredSpinner = ({ label }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center gap-y-2 py-16 text-gray-500">
    <Spinner className="size-10" />
    {label && <p className="text-sm">{label}</p>}
  </div>
);

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
};

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-y-2 py-14 px-4 text-center">
    <div className="text-4xl text-gray-300">{icon ?? <FiInbox />}</div>
    <p className="text-base font-semibold text-gray-700">{title}</p>
    {description && (
      <p className="max-w-sm text-sm text-gray-500">{description}</p>
    )}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center gap-y-2 py-14 px-4 text-center">
    <FiAlertTriangle className="text-4xl text-red-400" />
    <p className="text-base font-semibold text-gray-700">Something went wrong</p>
    <p className="max-w-sm text-sm text-gray-500">
      {message || "We couldn't load this. Please try again."}
    </p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 rounded-lg border border-blue-600 px-4 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-600 hover:text-white"
      >
        Retry
      </button>
    )}
  </div>
);

/** Generic list-of-rows skeleton. */
export const RowsSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="flex flex-col gap-y-3 p-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-x-3">
        <div className="size-11 shrink-0 rounded-full skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 rounded skeleton" />
          <div className="h-3 w-2/3 rounded skeleton" />
        </div>
      </div>
    ))}
  </div>
);
