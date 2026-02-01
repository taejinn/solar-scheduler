import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface AppLayoutProps {
    children: ReactNode;
    onCreateClick?: () => void;
    onSearchClick?: () => void;
    currentView?: string;
    onViewChange?: (view: string) => void;
}

export default function AppLayout({ children, onCreateClick, onSearchClick, currentView, onViewChange }: AppLayoutProps) {
    return (
        <div className="flex h-screen w-full bg-white dark:bg-[#191919] text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans">
            <Sidebar
                onCreateClick={onCreateClick}
                onSearchClick={onSearchClick}
                currentView={currentView}
                onViewChange={onViewChange}
            />
            <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                {children}
            </div>
        </div>
    );
}
