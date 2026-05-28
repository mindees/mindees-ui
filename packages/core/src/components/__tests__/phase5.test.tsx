import { getComponentTag } from '../../layout-intelligence/tagged-component';
import { Accordion } from '../Display/Accordion';
import { Avatar, AvatarGroup } from '../Display/Avatar';
import { Badge } from '../Display/Badge';
import { Card } from '../Display/Card';
import { Image } from '../Display/Image';
import { List, ListItem } from '../Display/List';
import { Progress } from '../Display/Progress';
import { Rating } from '../Display/Rating';
import { Skeleton } from '../Display/Skeleton';
import { Spinner } from '../Display/Spinner';
import { Stat } from '../Display/Stat';
import { Chip, Tag } from '../Display/Tag';
import { Timeline } from '../Display/Timeline';
import { Breadcrumb } from '../Nav/Breadcrumb';
import { Pagination } from '../Nav/Pagination';
import { Stepper } from '../Nav/Stepper';
import { PillTabBar } from '../Nav/PillTabBar';
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
