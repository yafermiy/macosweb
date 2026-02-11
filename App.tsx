/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { MousePointer2, PenLine, Folder, Gamepad2, Map as MapIcon, Image as ImageIcon, Video, Calendar as CalendarIcon, FileText, Tv as TvIcon, Newspaper, Settings, Calculator, Terminal as TerminalIcon, CloudRain } from 'lucide-react';
import { DesktopItem, Stroke, BootState } from './types';
import { HomeScreen } from './components/apps/HomeScreen';
import { MailApp } from './components/apps/MailApp';
import { SnakeGame } from './components/apps/SnakeGame';
import { FolderView } from './components/apps/FolderView';
import { DraggableWindow } from './components/DraggableWindow';
import { InkLayer } from './components/InkLayer';
import { NotepadApp } from './components/apps/NotepadApp';
import { AppStoreApp } from './components/apps/AppStoreApp';
import { WeatherApp, TvApp, FaceTimeApp, NewsApp, MessagesApp, MapsApp, MusicApp } from './components/apps/MacApps';
import { MenuBar } from './components/macos/MenuBar';
import { Dock } from './components/macos/Dock';
import { BootScreen } from './components/macos/BootScreen';
import { LoginScreen } from './components/macos/LoginScreen';
import { CalculatorApp } from './components/apps/CalculatorApp';
import { SafariApp } from './components/apps/SafariApp';
import { SettingsApp } from './components/apps/SettingsApp';
import { TerminalApp } from './components/apps/TerminalApp';
import { CalendarApp } from './components/apps/CalendarApp';
import { PhotosApp } from './components/apps/PhotosApp';

// Reliable Icons
const ICONS = {
    finder: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Finder_Icon_macOS_Big_Sur.png",
    safari: "https://upload.wikimedia.org/wikipedia/commons/5/52/Safari_browser_logo.svg",
    messages: "https://upload.wikimedia.org/wikipedia/commons/5/51/IMessage_logo.svg",
    mail: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Mail_%28iOS%29.svg",
    music: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Apple_Music_icon.svg",
    appstore: "https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg",
};

// Updated Item List - Using Native Icons for apps that frequently have broken URLs
const INITIAL_ALL_ITEMS: DesktopItem[] = [
    { id: 'finder', name: 'Finder', type: 'app', icon: ICONS.finder, appId: 'finder' },
    { id: 'appstore', name: 'App Store', type: 'app', icon: ICONS.appstore, appId: 'appstore' },
    { id: 'safari', name: 'Safari', type: 'app', icon: ICONS.safari, appId: 'safari' },
    { id: 'messages', name: 'Messages', type: 'app', icon: ICONS.messages, appId: 'messages' },
    { id: 'mail', name: 'Mail', type: 'app', icon: ICONS.mail, appId: 'mail' },
    
    // Native Icons (No more white squares)
    { id: 'maps', name: 'Maps', type: 'app', icon: MapIcon, appId: 'maps', bgColor: 'bg-green-100' },
    { id: 'photos', name: 'Photos', type: 'app', icon: ImageIcon, appId: 'photos', bgColor: 'bg-white' },
    { id: 'facetime', name: 'FaceTime', type: 'app', icon: Video, appId: 'facetime', bgColor: 'bg-green-500' },
    { id: 'calendar', name: 'Calendar', type: 'app', icon: CalendarIcon, appId: 'calendar', bgColor: 'bg-white' },
    { id: 'notes_app', name: 'Notes', type: 'app', icon: FileText, appId: 'notepad', bgColor: 'bg-yellow-400' },
    { id: 'tv', name: 'TV', type: 'app', icon: TvIcon, appId: 'tv', bgColor: 'bg-black' },
    { id: 'music', name: 'Music', type: 'app', icon: ICONS.music, appId: 'music' },
    { id: 'news', name: 'News', type: 'app', icon: Newspaper, appId: 'news', bgColor: 'bg-red-500' },
    { id: 'settings', name: 'Settings', type: 'app', icon: Settings, appId: 'settings', bgColor: 'bg-zinc-400' },
    { id: 'weather', name: 'Weather', type: 'app', icon: CloudRain, appId: 'weather', bgColor: 'bg-blue-400' },
    { id: 'calculator', name: 'Calculator', type: 'app', icon: Calculator, appId: 'calculator', bgColor: 'bg-orange-500' },
    { id: 'terminal', name: 'Terminal', type: 'app', icon: TerminalIcon, appId: 'terminal', bgColor: 'bg-black' },
    
    // Desktop Files
    { 
        id: 'readme', 
        name: 'Readme.txt', 
        type: 'app', 
        icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/TextEdit_Icon_macOS_Big_Sur.png/240px-TextEdit_Icon_macOS_Big_Sur.png', 
        appId: 'notepad', 
        notepadInitialContent: "GEMINI OS PRO 2.0\n\n- Fixed Close buttons\n- Removed broken white icons\n- Removed duplicate apps"
    },
    { id: 'docs', name: 'Documents', type: 'folder', icon: Folder, bgColor: 'bg-blue-400', contents: [] },
    { id: 'projects', name: 'Projects', type: 'folder', icon: Folder, bgColor: 'bg-blue-400', contents: [] }
];

interface OpenWindow {
    id: string;
    item: DesktopItem;
    zIndex: number;
    pos: { x: number, y: number };
    size: { width: number, height: number };
    minimized: boolean;
    isMobileMaximized?: boolean;
}

export const App: React.FC = () => {
    // Curated Dock List (Only functional, icon-ready apps)
    const DOCK_IDS = [
        'finder', 'appstore', 'safari', 'messages', 'mail', 'maps', 'photos', 'facetime', 
        'calendar', 'notes_app', 'tv', 'music', 
        'news', 'settings', 'calculator', 'terminal'
    ];
    
    const [bootState, setBootState] = useState<BootState>('boot');
    const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
    const [focusedId, setFocusedId] = useState<string | null>(null);
    const [nextZIndex, setNextZIndex] = useState(100);
    const [inkMode, setInkMode] = useState(false);
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const [allItems, setAllItems] = useState<DesktopItem[]>(INITIAL_ALL_ITEMS);
    const [wallpaperUrl, setWallpaperUrl] = useState<string>('https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070');
    const [notesData, setNotesData] = useState<any[]>([]);

    const dockItems = DOCK_IDS.map(id => allItems.find(i => i.id === id)).filter(Boolean) as DesktopItem[];
    const desktopRenderItems = allItems.filter(item => !DOCK_IDS.includes(item.id));

    useEffect(() => {
        if (bootState === 'boot') {
            const timer = setTimeout(() => setBootState('login'), 2000);
            return () => clearTimeout(timer);
        }
    }, [bootState]);

    const handleLaunch = (item: DesktopItem) => {
        if (inkMode) return;
        const existing = openWindows.find(w => w.id === item.id);
        if (existing) {
            if (existing.minimized) {
                setOpenWindows(prev => prev.map(w => w.id === item.id ? { ...w, minimized: false, zIndex: nextZIndex } : w));
                setNextZIndex(z => z + 1);
            }
            setFocusedId(item.id);
            return;
        }

        const isMobile = window.innerWidth < 768;
        let size = { width: 850, height: 550 };
        
        if (!isMobile) {
            if (item.appId === 'calculator') size = { width: 320, height: 480 };
            if (item.appId === 'calendar') size = { width: 1000, height: 650 };
            if (item.appId === 'notepad') size = { width: 800, height: 550 };
            if (item.appId === 'settings') size = { width: 980, height: 650 };
            if (item.appId === 'finder') size = { width: 960, height: 600 };
            if (item.appId === 'mail') size = { width: 1000, height: 650 };
            if (item.appId === 'weather') size = { width: 900, height: 620 };
            if (item.appId === 'appstore') size = { width: 1050, height: 750 };
            if (item.appId === 'photos') size = { width: 980, height: 650 };
            if (item.appId === 'tv') size = { width: 1000, height: 650 };
            if (item.appId === 'news') size = { width: 1000, height: 700 };
            if (item.appId === 'music') size = { width: 1000, height: 650 };
            if (item.appId === 'facetime') size = { width: 700, height: 500 };
            if (item.appId === 'messages') size = { width: 800, height: 550 };
        }

        const newWin: OpenWindow = {
            id: item.id,
            item,
            zIndex: nextZIndex,
            pos: isMobile ? { x: 0, y: 0 } : { x: 80 + (openWindows.length * 30), y: 60 + (openWindows.length * 30) },
            size,
            minimized: false,
            isMobileMaximized: isMobile
        };

        setOpenWindows(prev => [...prev, newWin]);
        setNextZIndex(z => z + 1);
        setFocusedId(item.id);
    };

    const handleFileOpen = (fileName: string, type: 'file' | 'folder') => {
        let appIdToLaunch = 'notepad'; 
        const lower = fileName.toLowerCase();
        if (lower.endsWith('.jpg') || lower.endsWith('.png') || lower.endsWith('.svg')) appIdToLaunch = 'photos';
        else if (lower.endsWith('.mp3') || lower.endsWith('.wav')) appIdToLaunch = 'music';
        else if (lower.endsWith('.pdf')) appIdToLaunch = 'safari';
        
        const appItem = allItems.find(i => i.appId === appIdToLaunch) || allItems.find(i => i.id === 'notes_app');
        if (appItem) handleLaunch(appItem);
    };

    const closeWindow = (id: string) => {
        setOpenWindows(prev => prev.filter(w => w.id !== id));
        if (focusedId === id) setFocusedId(null);
    };

    const focusWindow = (id: string | null) => {
        if (!id) { setFocusedId(null); return; }
        setFocusedId(id);
        setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZIndex } : w));
        setNextZIndex(z => z + 1);
    };

    const activeAppName = focusedId ? openWindows.find(w => w.id === focusedId)?.item.name : 'Finder';

    if (bootState === 'boot') return <BootScreen />;
    if (bootState === 'login') return <LoginScreen onLogin={() => setBootState('desktop')} wallpaper={wallpaperUrl} />;

    return (
        <div 
            className="h-full w-full bg-cover bg-center overflow-hidden relative transition-all duration-700 select-none antialiased font-sans" 
            style={{ backgroundImage: `url(${wallpaperUrl})` }}
            onPointerDown={() => focusWindow(null)}
        >
            <MenuBar activeAppName={activeAppName} />
            
             <div id="control-bar" className="fixed top-12 right-6 flex flex-col items-center gap-3 p-1.5 bg-black/30 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-2xl z-[5000]">
                <button onClick={() => setInkMode(false)} className={`p-2.5 rounded-xl transition-all duration-300 ${!inkMode ? 'bg-white/90 text-black shadow-lg scale-110' : 'text-white/80 hover:bg-white/10'}`}><MousePointer2 size={18} /></button>
                <button onClick={() => setInkMode(true)} className={`p-2.5 rounded-xl transition-all duration-300 ${inkMode ? 'bg-blue-500 text-white shadow-lg scale-110' : 'text-white/80 hover:bg-white/10'}`}><PenLine size={18} /></button>
            </div>

            <div className="h-full w-full relative pt-7 pb-24">
                 <HomeScreen items={desktopRenderItems} onLaunch={handleLaunch} />

                {openWindows.map(win => {
                    if (win.minimized) return null; 
                    
                    let content = null;
                    let useUnifiedTitleBar = false;
                    let windowBgType: 'default' | 'transparent' = 'default';

                    switch(win.item.appId) {
                        case 'finder': 
                            content = <FolderView folder={win.item} onOpenFile={handleFileOpen} />; 
                            useUnifiedTitleBar = true;
                            break;
                        case 'folder': 
                            content = <FolderView folder={win.item} onOpenFile={handleFileOpen} />; 
                            useUnifiedTitleBar = true;
                            break;
                        case 'notepad': 
                            content = <NotepadApp initialContent={win.item.notepadInitialContent} persistenceId={win.id} savedData={notesData} setSavedData={setNotesData} />; 
                            useUnifiedTitleBar = true;
                            break;
                        case 'settings': 
                            content = <SettingsApp onWallpaperChange={setWallpaperUrl} />; 
                            useUnifiedTitleBar = true;
                            break;
                        case 'mail': 
                            content = <MailApp emails={[]} />; 
                            useUnifiedTitleBar = true;
                            break;
                        case 'appstore': 
                            content = <AppStoreApp />; 
                            useUnifiedTitleBar = true;
                            break;
                        case 'weather': 
                            content = <WeatherApp />; 
                            useUnifiedTitleBar = true;
                            windowBgType = 'transparent';
                            break;
                        case 'photos': 
                            content = <PhotosApp />; 
                            useUnifiedTitleBar = true;
                            break;
                        case 'music': 
                            content = <MusicApp />; 
                            useUnifiedTitleBar = true;
                            break;
                        case 'tv': 
                            content = <TvApp />; 
                            useUnifiedTitleBar = true;
                            break;
                        case 'facetime': 
                            content = <FaceTimeApp />; 
                            useUnifiedTitleBar = true;
                            break;
                        case 'news': 
                            content = <NewsApp />; 
                            useUnifiedTitleBar = true;
                            break;
                        case 'messages': 
                            content = <MessagesApp />; 
                            useUnifiedTitleBar = true;
                            break;
                        case 'maps': 
                            content = <MapsApp />; 
                            useUnifiedTitleBar = true;
                            break;
                        case 'safari': content = <SafariApp />; break;
                        case 'calculator': content = <CalculatorApp />; break;
                        case 'snake': content = <SnakeGame />; break;
                        case 'calendar': content = <CalendarApp />; break;
                        case 'terminal': content = <TerminalApp />; break;
                        default: content = <div className="p-10 text-center">App not installed</div>;
                    }

                    return (
                        <DraggableWindow
                            key={win.id}
                            id={win.id}
                            title={win.item.name}
                            icon={typeof win.item.icon === 'string' ? undefined : win.item.icon}
                            initialPos={win.pos}
                            initialSize={win.size}
                            zIndex={win.zIndex}
                            isActive={focusedId === win.id}
                            onClose={() => closeWindow(win.id)}
                            onFocus={() => focusWindow(win.id)}
                            onMinimize={() => setOpenWindows(prev => prev.map(w => w.id === win.id ? { ...w, minimized: true } : w))}
                            isMobileMaximized={win.isMobileMaximized}
                            unifiedTitleBar={useUnifiedTitleBar}
                            bgType={windowBgType}
                        >
                            {content}
                        </DraggableWindow>
                    );
                })}
                
                <InkLayer active={inkMode} strokes={strokes} setStrokes={setStrokes} isProcessing={false} />
            </div>

            <Dock items={dockItems} openAppIds={openWindows.map(w => w.id)} onLaunch={handleLaunch} />
        </div>
    );
};