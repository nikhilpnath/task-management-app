import { Component, type ErrorInfo, type ReactNode } from "react";
import ErrorCmp from "./ErrorCmp";

type TProps = {
  children?: ReactNode;
};

type TState = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<TProps, TState> {
  constructor(props: TProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): TState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorCmp
          text="An unexpected error has occurred"
          btnText="Refresh Page"
          btnAction={() => window.location.reload()}
        />
      );
    }
    return this.props.children;
  }
}
