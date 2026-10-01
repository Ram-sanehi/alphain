import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Alpha AIM Application Error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070B14] text-[#F5F1E8] flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-12 h-12 rounded-full border border-[#C9A24B]/40 flex items-center justify-center mb-6">
            <span className="font-serif text-[#C9A24B] text-xl font-bold">A</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F5F1E8] mb-3">
            Alpha Investment Management
          </h1>
          <p className="font-sans text-sm text-slate-400 max-w-md mb-8">
            An unexpected error occurred while loading this view. Please refresh the page to reconnect.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-[#C9A24B] text-[#070B14] font-sans font-semibold text-xs uppercase tracking-wider hover:bg-[#DCB862] transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
