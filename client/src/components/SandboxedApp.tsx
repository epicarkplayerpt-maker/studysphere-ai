import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  appName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SandboxedApp extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Sandbox crash intercepted in app "${this.props.appName}":`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-secondary/30 border border-red-500/20 rounded-2xl max-w-xl mx-auto my-12 text-center space-y-4 animate-scale-in">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-full">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-foreground">Sandbox Crash: {this.props.appName}</h3>
            <p className="text-xs text-muted leading-relaxed max-w-sm mx-auto">
              An isolated runtime crash was intercepted inside this app module. The parent StudySphere container shell is operating normally.
            </p>
            <pre className="text-[10px] font-mono text-red-400 bg-red-500/5 p-2 rounded-lg border border-red-500/10 text-left overflow-x-auto max-w-md mx-auto">
              {this.state.error?.message || 'Unknown runtime fault'}
            </pre>
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Relaunch Application</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SandboxedApp;
