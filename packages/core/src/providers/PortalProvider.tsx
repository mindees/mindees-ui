import * as React from 'react';
import { View, StyleSheet } from 'react-native';

// Lightweight, dependency-free portal. Overlays (Modal, BottomSheet, Toast,
// Tooltip, Popover) render into named hosts so they stack predictably above
// the rest of the tree. A consumer renders `<PortalProvider>` near the root;
// `<Portal name="modal">` content is mounted at the host with that name.
//
// Why our own instead of `@gorhom/portal`: zero peer-dep cost, full control
// over named hosts + per-host z-index ordering using our `zIndex` token.

interface PortalEntry {
  readonly key: string;
  readonly node: React.ReactNode;
}
type PortalState = Record<string, PortalEntry[]>;

interface PortalContextValue {
  readonly mount: (host: string, key: string, node: React.ReactNode) => void;
  readonly unmount: (host: string, key: string) => void;
}

const PortalContext = React.createContext<PortalContextValue | undefined>(undefined);

export interface PortalProviderProps {
  readonly children: React.ReactNode;
  /** Named portal hosts in z-order; later names render on top of earlier ones. */
  readonly hosts?: readonly string[];
}

const DEFAULT_HOSTS = ['modal', 'bottom-sheet', 'popover', 'tooltip', 'toast'] as const;

export function PortalProvider({
  children,
  hosts = DEFAULT_HOSTS,
}: PortalProviderProps): React.ReactElement {
  const [state, setState] = React.useState<PortalState>({});

  const mount = React.useCallback((host: string, key: string, node: React.ReactNode) => {
    setState((prev) => {
      const list = prev[host] ?? [];
      const next = list.filter((e) => e.key !== key);
      next.push({ key, node });
      return { ...prev, [host]: next };
    });
  }, []);

  const unmount = React.useCallback((host: string, key: string) => {
    setState((prev) => {
      const list = prev[host];
      if (!list) return prev;
      const next = list.filter((e) => e.key !== key);
      if (next.length === list.length) return prev;
      return { ...prev, [host]: next };
    });
  }, []);

  const value = React.useMemo<PortalContextValue>(() => ({ mount, unmount }), [mount, unmount]);

  return (
    <PortalContext.Provider value={value}>
      <View style={styles.root} collapsable={false}>
        {children}
        {hosts.map((host) => (
          <View
            key={host}
            pointerEvents="box-none"
            style={StyleSheet.absoluteFill}
            collapsable={false}
            accessibilityElementsHidden={(state[host]?.length ?? 0) === 0}
          >
            {state[host]?.map((entry) => (
              <React.Fragment key={entry.key}>{entry.node}</React.Fragment>
            ))}
          </View>
        ))}
      </View>
    </PortalContext.Provider>
  );
}

export interface PortalProps {
  readonly children: React.ReactNode;
  /** Defaults to `modal`. */
  readonly host?: string;
  /** Optional explicit key; if omitted, a stable random key is generated. */
  readonly portalKey?: string;
}

export function Portal({ children, host = 'modal', portalKey }: PortalProps): null {
  const ctx = React.useContext(PortalContext);
  const idRef = React.useRef<string>(portalKey ?? `portal-${Math.random().toString(36).slice(2)}`);
  React.useEffect(() => {
    if (!ctx) return undefined;
    // Capture the id locally so the cleanup function references a stable
    // value (idRef.current could be reassigned between mount and unmount).
    const id = idRef.current;
    ctx.mount(host, id, children);
    return () => ctx.unmount(host, id);
  }, [ctx, host, children]);
  return null;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
