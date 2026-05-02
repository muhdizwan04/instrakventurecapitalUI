import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ContentUndoContext = createContext(null);

export function ContentUndoProvider({ children }) {
    const [undo, setUndoState] = useState(null);

    const setContentUndo = useCallback((next) => {
        setUndoState(next);
    }, []);

    const value = useMemo(
        () => ({ undo, setContentUndo }),
        [undo, setContentUndo],
    );

    return <ContentUndoContext.Provider value={value}>{children}</ContentUndoContext.Provider>;
}

export function useContentUndo() {
    const ctx = useContext(ContentUndoContext);
    if (!ctx) {
        throw new Error('useContentUndo must be used within ContentUndoProvider');
    }
    return ctx;
}
