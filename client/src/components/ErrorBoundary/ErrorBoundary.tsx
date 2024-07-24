import React, { ErrorInfo } from "react";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};
type State = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.log("ErrorBoundary caught an error", error, info);
    this.setState({ hasError: true });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      console.log("error hai");

      if (this.props.fallback) {
        this.props.fallback;
      } else {
        return (
          <div className="text-2xl md:text-4xl font-semibold my-10 text-center flex flex-col items-center justify-center gap-y-5">
            <p> Something went Wrong !</p>
            <a
              href="/"
              className="px-2 py-0.5 bg-orange-400 text-white font-semibold mt-5"
            >
              GO Back to HomePage
            </a>
          </div>
        );
      }
    } else {
      return this.props.children;
    }
  }
}
export default ErrorBoundary;
