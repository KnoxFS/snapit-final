// Curated icon library for Icon Generator
// Icons suitable for app branding and marketing

import {
    HeartIcon,
    CommentIcon,
    TwitterIcon,
    ColorPickerIcon,
    BackgroundIcon,
    SaveIcon,
    ClipboardIcon,
    ResetIcon,
    AppleIcon,
    TurboIcon,
    PaddingIcon,
    WavesIcon,
    ThunderIcon,
} from 'ui/icons';

export const iconLibrary = [
    {
        id: 'heart',
        name: 'Heart',
        component: HeartIcon,
        keywords: ['love', 'like', 'favorite', 'social'],
        category: 'social',
    },
    {
        id: 'comment',
        name: 'Comment',
        component: CommentIcon,
        keywords: ['chat', 'message', 'talk', 'communication'],
        category: 'communication',
    },
    {
        id: 'twitter',
        name: 'Twitter',
        component: TwitterIcon,
        keywords: ['social', 'bird', 'tweet', 'x'],
        category: 'social',
    },
    {
        id: 'colorpicker',
        name: 'Color Picker',
        component: ColorPickerIcon,
        keywords: ['design', 'palette', 'art', 'creative'],
        category: 'design',
    },
    {
        id: 'background',
        name: 'Background',
        component: BackgroundIcon,
        keywords: ['image', 'photo', 'picture', 'media'],
        category: 'design',
    },
    {
        id: 'save',
        name: 'Save',
        component: SaveIcon,
        keywords: ['download', 'export', 'file', 'storage'],
        category: 'general',
    },
    {
        id: 'clipboard',
        name: 'Clipboard',
        component: ClipboardIcon,
        keywords: ['copy', 'paste', 'document', 'notes'],
        category: 'general',
    },
    {
        id: 'reset',
        name: 'Reset',
        component: ResetIcon,
        keywords: ['refresh', 'reload', 'restart', 'sync'],
        category: 'general',
    },
    {
        id: 'apple',
        name: 'Apple',
        component: AppleIcon,
        keywords: ['fruit', 'food', 'health', 'ios'],
        category: 'tech',
    },
    {
        id: 'turbo',
        name: 'Turbo',
        component: TurboIcon,
        keywords: ['fast', 'speed', 'quick', 'performance'],
        category: 'tech',
    },
    {
        id: 'padding',
        name: 'Padding',
        component: PaddingIcon,
        keywords: ['space', 'margin', 'layout', 'design'],
        category: 'design',
    },
    {
        id: 'waves',
        name: 'Waves',
        component: WavesIcon,
        keywords: ['water', 'ocean', 'sound', 'audio'],
        category: 'general',
    },
    {
        id: 'thunder',
        name: 'Thunder',
        component: ThunderIcon,
        keywords: ['lightning', 'bolt', 'power', 'energy', 'fast'],
        category: 'general',
    },
];

export const iconCategories = [
    { id: 'all', name: 'All Icons' },
    { id: 'social', name: 'Social' },
    { id: 'communication', name: 'Communication' },
    { id: 'design', name: 'Design' },
    { id: 'tech', name: 'Tech' },
    { id: 'general', name: 'General' },
];
