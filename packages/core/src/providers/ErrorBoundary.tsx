import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export interface ErrorBoundaryProps {
  readonly children: React.ReactNode;
  /** Render-prop fallback. Receives the captured error and a `retry` callback. */
  readonly fallback?: (error: Error, retry: () => void) => React.ReactNode;
  /** Reported once on error capture. */
  readonly onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  readonly error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  retry = (): void => {
    this.setState({ error: null });
  };

  override render(): React.ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(error, this.retry);
    return (
      <View style={styles.container} accessibilityRole="alert">
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>{error.message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#feb2b2',
  },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#742a2a' },
  message: { fontSize: 14, color: '#742a2a' },
});
