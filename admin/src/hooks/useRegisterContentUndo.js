import { useLayoutEffect, useRef } from 'react';
import { useContentUndo } from '../context/ContentUndoContext';

/**
 * Registers a compact header "Undo" for the current admin page.
 * When shouldOffer is false or the component unmounts, the header control is cleared.
 */
export function useRegisterContentUndo({ shouldOffer, busy, executeUndo }) {
    const { setContentUndo } = useContentUndo();
    const execRef = useRef(executeUndo);
    execRef.current = executeUndo;

    useLayoutEffect(() => {
        if (!shouldOffer) {
            setContentUndo(null);
            return () => setContentUndo(null);
        }

        setContentUndo({
            busy: Boolean(busy),
            run: async () => execRef.current(),
        });

        return () => setContentUndo(null);
    }, [shouldOffer, busy, setContentUndo]);
}
