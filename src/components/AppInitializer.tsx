// src/components/AppInitializer.tsx

'use client';

import { useEffect } from 'react';
import { useResumeStore } from '@/store/resumeStore';

// This component's only job is to call the `initialize` function from the store.
// We pass `children` through, so it doesn't affect the layout.
export const AppInitializer = ({ children }: { children: React.ReactNode }) => {
    // Get the initialize function and the isInitialized flag from the store
    const { initialize, isInitialized } = useResumeStore(state => ({
        initialize: state.initialize,
        isInitialized: state.isInitialized,
    }));

    useEffect(() => {
        // We check the isInitialized flag to ensure this expensive
        // database call only ever runs ONCE per application load.
        if (!isInitialized) {
            initialize();
        }
    }, [initialize, isInitialized]);

    // This component doesn't render any UI itself, it just triggers the effect.
    return <>{children}</>;
};