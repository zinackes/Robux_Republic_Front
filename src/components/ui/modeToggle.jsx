// src/components/ModeToggle.jsx
import React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from "@/lib/theme-provider.jsx"; // Ton provider actuel
import { ThemeToggler } from '@/components/animate-ui/primitives/effects/theme-toggler'; // Ton chemin vers l'effet

export const ModeToggle = () => {
    const { theme, resolvedTheme, setTheme } = useTheme();

    return (
        <ThemeToggler
            theme={theme}
            resolvedTheme={resolvedTheme}
            setTheme={setTheme}
            direction="ltr"
        >
            {({ effective, toggleTheme }) => {
                const nextTheme =
                    effective === 'dark'
                        ? 'light'
                        : effective === 'system'
                            ? 'dark'
                            : 'system';

                return (
                    <button
                        onClick={() => toggleTheme(nextTheme)}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 transition-colors"
                        title="Changer le thème"
                    >
                        {effective === 'system' ? (
                            <Monitor size={20} />
                        ) : effective === 'dark' ? (
                            <Moon size={20} />
                        ) : (
                            <Sun size={20} />
                        )}
                    </button>
                );
            }}
        </ThemeToggler>
    );
};