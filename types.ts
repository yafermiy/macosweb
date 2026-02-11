/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { LucideIcon } from 'lucide-react';

declare global {
    var html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
}

export type AppId = 
    | 'home' 
    | 'finder'
    | 'mail' 
    | 'slides' 
    | 'snake' 
    | 'folder' 
    | 'notepad'
    | 'calculator'
    | 'safari'
    | 'settings'
    | 'terminal'
    | 'photos'
    | 'calendar'
    | 'tictactoe'
    | 'minesweeper'
    | 'vscode'
    | 'messages'
    | 'maps'
    | 'music'
    | 'appstore'
    | 'weather'
    | 'tv'
    | 'facetime'
    | 'news'
    | 'contacts';

export interface DesktopItem {
    id: string;
    name: string;
    type: 'app' | 'folder';
    icon: LucideIcon | string; // Allow string URL for real icons
    appId?: AppId;
    contents?: DesktopItem[];
    bgColor?: string;
    notepadInitialContent?: string;
}

export interface Point {
    x: number;
    y: number;
}

export type Stroke = Point[];

export interface Email {
    id: number;
    from: string;
    subject: string;
    preview: string;
    body: string;
    time: string;
    unread: boolean;
    flagged?: boolean;
}

export type ToolAction = 
    | { type: 'DELETE_ITEM'; itemId: string }
    | { type: 'EXPLODE_FOLDER'; folderId: string }
    | { type: 'EXPLAIN_ITEM'; itemId: string }
    | { type: 'NONE' };

export type BootState = 'boot' | 'login' | 'desktop';