import { ChevronDownIcon, ChevronRightIcon } from '@mindees/icons';
import * as React from 'react';
import { Pressable, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface TreeNode {
  readonly id: string;
  readonly label: React.ReactNode;
  readonly icon?: React.ReactNode;
  readonly children?: readonly TreeNode[];
}

export interface TreeViewProps extends Omit<ViewProps, 'style'> {
  readonly data: readonly TreeNode[];
  /** Ids expanded on first render. */
  readonly defaultExpanded?: readonly string[];
  /** Called when a node is tapped (any node, leaf or branch). */
  readonly onSelectNode?: (node: TreeNode) => void;
  readonly style?: StyleProp<ViewStyle>;
}

const INDENT_PER_DEPTH = 16;
const CHEVRON_SLOT: ViewStyle = { width: 16 };

interface TreeRowProps {
  readonly node: TreeNode;
  readonly depth: number;
  readonly expanded: ReadonlySet<string>;
  readonly onToggle: (id: string) => void;
  readonly onSelectNode?: (node: TreeNode) => void;
}

const TreeRow = React.memo(function TreeRow(props: TreeRowProps) {
  const { node, depth, expanded, onToggle, onSelectNode } = props;
  const tokens = useTokens();
  const hasChildren = !!node.children && node.children.length > 0;
  const isOpen = expanded.has(node.id);

  const onPress = React.useCallback(() => {
    if (hasChildren) onToggle(node.id);
    onSelectNode?.(node);
  }, [hasChildren, node, onToggle, onSelectNode]);

  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.space['2xs'],
    paddingVertical: tokens.space.xs,
    paddingHorizontal: tokens.space.xs,
    paddingLeft: tokens.space.xs + depth * INDENT_PER_DEPTH,
    minHeight: 40,
  };

  return (
    <View accessibilityRole="none">
      <Pressable
        accessibilityRole="button"
        accessibilityState={hasChildren ? { expanded: isOpen } : undefined}
        onPress={onPress}
        style={rowStyle}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDownIcon size={16} color={tokens.colors.text.secondary} />
          ) : (
            <ChevronRightIcon size={16} color={tokens.colors.text.secondary} />
          )
        ) : (
          <View style={CHEVRON_SLOT} />
        )}
        {node.icon ? <View accessibilityRole="none">{node.icon}</View> : null}
        {typeof node.label === 'string' ? <Text tone="primary">{node.label}</Text> : node.label}
      </Pressable>
      {hasChildren && isOpen
        ? node.children?.map((child) => (
            <TreeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              onSelectNode={onSelectNode}
            />
          ))
        : null}
    </View>
  );
});

const TreeViewImpl = React.forwardRef<View, TreeViewProps>(function TreeView(props, ref) {
  const { data, defaultExpanded, onSelectNode, style, ...rest } = props;
  const [expanded, setExpanded] = React.useState<ReadonlySet<string>>(
    () => new Set(defaultExpanded ?? []),
  );

  const onToggle = React.useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <View ref={ref} accessibilityRole="list" style={style} {...rest}>
      {data.map((node) => (
        <TreeRow
          key={node.id}
          node={node}
          depth={0}
          expanded={expanded}
          onToggle={onToggle}
          onSelectNode={onSelectNode}
        />
      ))}
    </View>
  );
});

TreeViewImpl.displayName = 'TreeView';

export const TreeView = tagComponent(TreeViewImpl, 'TreeView');
