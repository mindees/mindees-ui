import { createIcon } from './createIcon';

export * from './createIcon';

// Every icon is a tree-shakeable named export so apps only pay for what they
// import. Glyphs are Feather-style: a single 24x24 stroke path, customizable
// via `size`, `color`, and `strokeWidth`.

// ---------------------------------------------------------------------------
// Starter set (shipped since 1.0.0)
// ---------------------------------------------------------------------------

export const ChevronDownIcon = createIcon({
  name: 'ChevronDown',
  viewBox: '0 0 24 24',
  path: 'M6 9l6 6 6-6',
});

export const ChevronUpIcon = createIcon({
  name: 'ChevronUp',
  viewBox: '0 0 24 24',
  path: 'M18 15l-6-6-6 6',
});

export const ChevronLeftIcon = createIcon({
  name: 'ChevronLeft',
  viewBox: '0 0 24 24',
  path: 'M15 18l-6-6 6-6',
});

export const ChevronRightIcon = createIcon({
  name: 'ChevronRight',
  viewBox: '0 0 24 24',
  path: 'M9 18l6-6-6-6',
});

export const CheckIcon = createIcon({
  name: 'Check',
  viewBox: '0 0 24 24',
  path: 'M20 6L9 17l-5-5',
});

export const CloseIcon = createIcon({
  name: 'Close',
  viewBox: '0 0 24 24',
  path: 'M18 6L6 18M6 6l12 12',
});

export const SearchIcon = createIcon({
  name: 'Search',
  viewBox: '0 0 24 24',
  path: 'M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z',
});

// ---------------------------------------------------------------------------
// Arrows
// ---------------------------------------------------------------------------

export const ArrowUpIcon = createIcon({
  name: 'ArrowUp',
  viewBox: '0 0 24 24',
  path: 'M12 19V5M5 12l7-7 7 7',
});

export const ArrowDownIcon = createIcon({
  name: 'ArrowDown',
  viewBox: '0 0 24 24',
  path: 'M12 5v14M19 12l-7 7-7-7',
});

export const ArrowLeftIcon = createIcon({
  name: 'ArrowLeft',
  viewBox: '0 0 24 24',
  path: 'M19 12H5M12 19l-7-7 7-7',
});

export const ArrowRightIcon = createIcon({
  name: 'ArrowRight',
  viewBox: '0 0 24 24',
  path: 'M5 12h14M12 5l7 7-7 7',
});

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export const PlusIcon = createIcon({
  name: 'Plus',
  viewBox: '0 0 24 24',
  path: 'M12 5v14M5 12h14',
});

export const MinusIcon = createIcon({
  name: 'Minus',
  viewBox: '0 0 24 24',
  path: 'M5 12h14',
});

export const EditIcon = createIcon({
  name: 'Edit',
  viewBox: '0 0 24 24',
  path: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
});

export const TrashIcon = createIcon({
  name: 'Trash',
  viewBox: '0 0 24 24',
  path: 'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6',
});

export const SaveIcon = createIcon({
  name: 'Save',
  viewBox: '0 0 24 24',
  path: 'M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8',
});

export const CopyIcon = createIcon({
  name: 'Copy',
  viewBox: '0 0 24 24',
  path: 'M9 9h11a2 2 0 012 2v9a2 2 0 01-2 2h-9a2 2 0 01-2-2V9zM5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1',
});

export const ShareIcon = createIcon({
  name: 'Share',
  viewBox: '0 0 24 24',
  path: 'M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98',
});

export const DownloadIcon = createIcon({
  name: 'Download',
  viewBox: '0 0 24 24',
  path: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3',
});

export const UploadIcon = createIcon({
  name: 'Upload',
  viewBox: '0 0 24 24',
  path: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12',
});

export const RefreshIcon = createIcon({
  name: 'Refresh',
  viewBox: '0 0 24 24',
  path: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15',
});

export const FilterIcon = createIcon({
  name: 'Filter',
  viewBox: '0 0 24 24',
  path: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
});

export const SortIcon = createIcon({
  name: 'Sort',
  viewBox: '0 0 24 24',
  path: 'M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 4v16',
});

export const SettingsIcon = createIcon({
  name: 'Settings',
  viewBox: '0 0 24 24',
  path: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z',
});

export const MoreHorizontalIcon = createIcon({
  name: 'MoreHorizontal',
  viewBox: '0 0 24 24',
  path: 'M13 12a1 1 0 11-2 0 1 1 0 012 0zM20 12a1 1 0 11-2 0 1 1 0 012 0zM6 12a1 1 0 11-2 0 1 1 0 012 0z',
});

export const MoreVerticalIcon = createIcon({
  name: 'MoreVertical',
  viewBox: '0 0 24 24',
  path: 'M13 12a1 1 0 11-2 0 1 1 0 012 0zM13 5a1 1 0 11-2 0 1 1 0 012 0zM13 19a1 1 0 11-2 0 1 1 0 012 0z',
});

// ---------------------------------------------------------------------------
// Navigation / UI
// ---------------------------------------------------------------------------

export const HomeIcon = createIcon({
  name: 'Home',
  viewBox: '0 0 24 24',
  path: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM9 22V12h6v10',
});

export const MenuIcon = createIcon({
  name: 'Menu',
  viewBox: '0 0 24 24',
  path: 'M3 12h18M3 6h18M3 18h18',
});

export const BellIcon = createIcon({
  name: 'Bell',
  viewBox: '0 0 24 24',
  path: 'M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0',
});

export const GridIcon = createIcon({
  name: 'Grid',
  viewBox: '0 0 24 24',
  path: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
});

export const ListIcon = createIcon({
  name: 'List',
  viewBox: '0 0 24 24',
  path: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
});

export const ExternalLinkIcon = createIcon({
  name: 'ExternalLink',
  viewBox: '0 0 24 24',
  path: 'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3',
});

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------

export const InfoIcon = createIcon({
  name: 'Info',
  viewBox: '0 0 24 24',
  path: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 16v-4M12 8h.01',
});

export const WarningIcon = createIcon({
  name: 'Warning',
  viewBox: '0 0 24 24',
  path: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
});

export const ErrorIcon = createIcon({
  name: 'Error',
  viewBox: '0 0 24 24',
  path: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 8v4M12 16h.01',
});

export const CheckCircleIcon = createIcon({
  name: 'CheckCircle',
  viewBox: '0 0 24 24',
  path: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
});

export const XCircleIcon = createIcon({
  name: 'XCircle',
  viewBox: '0 0 24 24',
  path: 'M12 22a10 10 0 100-20 10 10 0 000 20zM15 9l-6 6M9 9l6 6',
});

export const HelpIcon = createIcon({
  name: 'Help',
  viewBox: '0 0 24 24',
  path: 'M12 22a10 10 0 100-20 10 10 0 000 20zM9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01',
});

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

export const PlayIcon = createIcon({
  name: 'Play',
  viewBox: '0 0 24 24',
  path: 'M5 3l14 9-14 9V3z',
});

export const PauseIcon = createIcon({
  name: 'Pause',
  viewBox: '0 0 24 24',
  path: 'M6 4h4v16H6zM14 4h4v16h-4z',
});

export const StopIcon = createIcon({
  name: 'Stop',
  viewBox: '0 0 24 24',
  path: 'M5 5h14v14H5z',
});

export const CameraIcon = createIcon({
  name: 'Camera',
  viewBox: '0 0 24 24',
  path: 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11zM16 13a4 4 0 11-8 0 4 4 0 018 0z',
});

export const ImageIcon = createIcon({
  name: 'Image',
  viewBox: '0 0 24 24',
  path: 'M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM10 9a2 2 0 11-4 0 2 2 0 014 0zM21 15l-5-5L5 21',
});

export const VideoIcon = createIcon({
  name: 'Video',
  viewBox: '0 0 24 24',
  path: 'M23 7l-7 5 7 5V7zM14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z',
});

export const MicIcon = createIcon({
  name: 'Mic',
  viewBox: '0 0 24 24',
  path: 'M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3zM19 10v1a7 7 0 01-14 0v-1M12 18v4M8 22h8',
});

export const VolumeIcon = createIcon({
  name: 'Volume',
  viewBox: '0 0 24 24',
  path: 'M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07',
});

// ---------------------------------------------------------------------------
// Common
// ---------------------------------------------------------------------------

export const UserIcon = createIcon({
  name: 'User',
  viewBox: '0 0 24 24',
  path: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M16 7a4 4 0 11-8 0 4 4 0 018 0z',
});

export const UsersIcon = createIcon({
  name: 'Users',
  viewBox: '0 0 24 24',
  path: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M13 7a4 4 0 11-8 0 4 4 0 018 0zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
});

export const LockIcon = createIcon({
  name: 'Lock',
  viewBox: '0 0 24 24',
  path: 'M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4',
});

export const UnlockIcon = createIcon({
  name: 'Unlock',
  viewBox: '0 0 24 24',
  path: 'M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 019.9-1',
});

export const MailIcon = createIcon({
  name: 'Mail',
  viewBox: '0 0 24 24',
  path: 'M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6',
});

export const PhoneIcon = createIcon({
  name: 'Phone',
  viewBox: '0 0 24 24',
  path: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z',
});

export const CalendarIcon = createIcon({
  name: 'Calendar',
  viewBox: '0 0 24 24',
  path: 'M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18',
});

export const ClockIcon = createIcon({
  name: 'Clock',
  viewBox: '0 0 24 24',
  path: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2',
});

export const EyeIcon = createIcon({
  name: 'Eye',
  viewBox: '0 0 24 24',
  path: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
});

export const EyeOffIcon = createIcon({
  name: 'EyeOff',
  viewBox: '0 0 24 24',
  path: 'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M14.12 14.12a3 3 0 11-4.24-4.24M1 1l22 22',
});

export const HeartIcon = createIcon({
  name: 'Heart',
  viewBox: '0 0 24 24',
  path: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
});

export const StarIcon = createIcon({
  name: 'Star',
  viewBox: '0 0 24 24',
  path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
});

export const BookmarkIcon = createIcon({
  name: 'Bookmark',
  viewBox: '0 0 24 24',
  path: 'M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z',
});

export const MapIcon = createIcon({
  name: 'Map',
  viewBox: '0 0 24 24',
  path: 'M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16',
});

export const GlobeIcon = createIcon({
  name: 'Globe',
  viewBox: '0 0 24 24',
  path: 'M12 22a10 10 0 100-20 10 10 0 000 20zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z',
});
