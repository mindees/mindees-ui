import { render } from '@testing-library/react-native';

import { getComponentTag } from '../../layout-intelligence/tagged-component';
import { Accordion } from '../Display/Accordion';
import { ActivityLog } from '../Display/ActivityLog';
import { Avatar, AvatarGroup } from '../Display/Avatar';
import { Badge } from '../Display/Badge';
import { Calendar } from '../Display/Calendar';
import { Card } from '../Display/Card';
import { Carousel } from '../Display/Carousel';
import { DataGrid } from '../Display/DataGrid';
import { DescriptionList } from '../Display/DescriptionList';
import { DetailView } from '../Display/DetailView';
import { Feed } from '../Display/Feed';
import { Image } from '../Display/Image';
import { ImageGallery } from '../Display/ImageGallery';
import { KeyValueRow } from '../Display/KeyValueRow';
import { KPICard } from '../Display/KPICard';
import { List, ListItem } from '../Display/List';
import { Pill } from '../Display/Pill';
import { Progress } from '../Display/Progress';
import { Rating } from '../Display/Rating';
import { Skeleton } from '../Display/Skeleton';
import { Spinner } from '../Display/Spinner';
import { Stat } from '../Display/Stat';
import { Table } from '../Display/Table';
import { Chip, Tag } from '../Display/Tag';
import { Timeline } from '../Display/Timeline';
import { TreeView } from '../Display/TreeView';
import { Breadcrumb } from '../Nav/Breadcrumb';
import { Pagination } from '../Nav/Pagination';
import { PillTabBar } from '../Nav/PillTabBar';
import { Stepper } from '../Nav/Stepper';
import { Tabs } from '../Nav/Tabs';
import { TopBar } from '../Nav/TopBar';

describe('Phase 5 — tag identity', () => {
  it('nav tags', () => {
    expect(getComponentTag(<Tabs />)).toBe('Tabs');
    expect(
      getComponentTag(<PillTabBar items={[]} value="" onValueChange={() => undefined} />),
    ).toBe('PillTabBar');
    expect(getComponentTag(<TopBar />)).toBe('TopBar');
    expect(getComponentTag(<Breadcrumb items={[]} />)).toBe('Breadcrumb');
    expect(getComponentTag(<Pagination total={10} page={1} onPageChange={() => undefined} />)).toBe(
      'Pagination',
    );
    expect(getComponentTag(<Stepper steps={[]} current={0} />)).toBe('Stepper');
  });

  it('display tags', () => {
    expect(getComponentTag(<Card />)).toBe('Card');
    expect(getComponentTag(<Avatar />)).toBe('Avatar');
    expect(
      getComponentTag(
        <AvatarGroup>
          <Avatar />
        </AvatarGroup>,
      ),
    ).toBe('AvatarGroup');
    expect(getComponentTag(<Badge>x</Badge>)).toBe('Badge');
    expect(getComponentTag(<Tag>x</Tag>)).toBe('Tag');
    // Chip renders Tag's UI but is its own tagged component so the Layout
    // Intelligence Layer can distinguish the two.
    expect(getComponentTag(<Chip>x</Chip>)).toBe('Chip');
    expect(getComponentTag(<Image />)).toBe('Image');
    expect(getComponentTag(<List />)).toBe('List');
    expect(getComponentTag(<ListItem title="x" />)).toBe('ListItem');
    expect(getComponentTag(<Accordion title="x" />)).toBe('Accordion');
    expect(getComponentTag(<Progress value={0.5} />)).toBe('Progress');
    expect(getComponentTag(<Skeleton />)).toBe('Skeleton');
    expect(getComponentTag(<Spinner />)).toBe('Spinner');
    expect(getComponentTag(<Stat label="x" value="y" />)).toBe('Stat');
    expect(getComponentTag(<Rating value={3} />)).toBe('Rating');
    expect(getComponentTag(<Timeline items={[]} />)).toBe('Timeline');
  });
});

describe('Phase 5 — data-display primitives', () => {
  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'qty', title: 'Qty', width: 80 },
  ];
  const tableData = [
    { name: 'Apples', qty: 4 },
    { name: 'Pears', qty: 2 },
  ];
  const detailItems = [
    { label: 'Status', value: 'Active' },
    { label: 'Owner', value: 'Sam' },
  ];
  const descriptionItems = [
    { term: 'Latency', description: 'Time to first byte' },
    { term: 'Throughput', description: 'Requests per second' },
  ];
  const feedItems = [
    { id: '1', title: 'Posted update', timestamp: '2m', body: 'Shipped the release', name: 'Ada' },
    { id: '2', title: 'Closed ticket', timestamp: '5m', body: 'Resolved the bug', name: 'Lin' },
  ];
  const logItems = [
    { time: '09:00', text: 'Build started' },
    { time: '09:05', text: 'Build passed' },
  ];

  it('carries the correct tags', () => {
    expect(getComponentTag(<Table columns={[]} data={[]} />)).toBe('Table');
    expect(getComponentTag(<KPICard label="Revenue" value="$1k" />)).toBe('KPICard');
    expect(getComponentTag(<DetailView items={[]} />)).toBe('DetailView');
    expect(getComponentTag(<KeyValueRow label="k" value="v" />)).toBe('KeyValueRow');
    expect(getComponentTag(<DescriptionList items={[]} />)).toBe('DescriptionList');
    expect(getComponentTag(<Pill>label</Pill>)).toBe('Pill');
    expect(getComponentTag(<Feed items={[]} />)).toBe('Feed');
    expect(getComponentTag(<ActivityLog items={[]} />)).toBe('ActivityLog');
  });

  it('renders without throwing', () => {
    expect(() => render(<Table columns={columns} data={tableData} />)).not.toThrow();
    expect(() =>
      render(<KPICard label="Revenue" value="$1,240" delta={{ value: '+12%', direction: 'up' }} />),
    ).not.toThrow();
    expect(() => render(<DetailView items={detailItems} />)).not.toThrow();
    expect(() => render(<KeyValueRow label="Email" value="a@b.com" />)).not.toThrow();
    expect(() => render(<DescriptionList items={descriptionItems} />)).not.toThrow();
    expect(() => render(<Pill tone="success">Done</Pill>)).not.toThrow();
    expect(() => render(<Feed items={feedItems} />)).not.toThrow();
    expect(() => render(<ActivityLog items={logItems} />)).not.toThrow();
  });
});

describe('Phase 5 — data-display primitives (wave 1b)', () => {
  const gridColumns = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'qty', title: 'Qty', width: 80, sortable: true },
  ];
  const gridData = [
    { name: 'Apples', qty: 4 },
    { name: 'Pears', qty: 2 },
    { name: 'Cherries', qty: 9 },
  ];
  const galleryImages = [
    { uri: 'https://example.com/a.jpg', alt: 'A' },
    { uri: 'https://example.com/b.jpg', alt: 'B' },
  ];
  const treeData = [
    {
      id: 'root',
      label: 'Root',
      children: [
        { id: 'child-1', label: 'Child 1' },
        { id: 'child-2', label: 'Child 2', children: [{ id: 'grandchild', label: 'Grandchild' }] },
      ],
    },
  ];

  it('carries the correct tags', () => {
    expect(getComponentTag(<DataGrid columns={[]} data={[]} />)).toBe('DataGrid');
    expect(getComponentTag(<Carousel items={[]} renderItem={() => null} />)).toBe('Carousel');
    expect(getComponentTag(<ImageGallery images={[]} />)).toBe('ImageGallery');
    expect(getComponentTag(<TreeView data={[]} />)).toBe('TreeView');
    expect(getComponentTag(<Calendar />)).toBe('Calendar');
  });

  it('renders without throwing', () => {
    expect(() => render(<DataGrid columns={gridColumns} data={gridData} />)).not.toThrow();
    expect(() =>
      render(<Carousel items={gridData} renderItem={(item) => <Card>{item.name}</Card>} />),
    ).not.toThrow();
    expect(() => render(<ImageGallery images={galleryImages} columns={2} />)).not.toThrow();
    expect(() => render(<TreeView data={treeData} defaultExpanded={['root']} />)).not.toThrow();
    expect(() => render(<Calendar value={new Date(2024, 1, 29)} />)).not.toThrow();
    // Leap-day + month-boundary guard: Feb 2024 (leap) renders 29 days.
    expect(() => render(<Calendar defaultMonth={new Date(2024, 1, 1)} />)).not.toThrow();
  });
});
