import { useState, useEffect } from 'react';

/**
 * CursorAnnotation Component
 * Renders a cursor icon
 */
const CursorAnnotation = ({
    annotation,
    isSelected,
    onUpdate,
    onSelect,
    onDelete,
    wrapperRef
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Handle dragging
    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e) => {
            if (!wrapperRef.current) return;

            const wrapper = wrapperRef.current.getBoundingClientRect();
            const deltaX = ((e.clientX - dragStart.x) / wrapper.width) * 100;
            const deltaY = ((e.clientY - dragStart.y) / wrapper.height) * 100;

            onUpdate(annotation.id, {
                position: {
                    x: Math.max(0, Math.min(100, dragStart.startX + deltaX)),
                    y: Math.max(0, Math.min(100, dragStart.startY + deltaY)),
                },
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart, wrapperRef, annotation.id, onUpdate]);

    const handleMouseDown = (e) => {
        e.stopPropagation();
        e.preventDefault();

        setIsDragging(true);
        setDragStart({
            x: e.clientX,
            y: e.clientY,
            startX: annotation.position.x,
            startY: annotation.position.y,
        });
        onSelect(annotation.id);
    };

    return (
        <div
            style={{
                position: 'absolute',
                left: `${annotation.position.x}%`,
                top: `${annotation.position.y}%`,
                transform: 'translate(0, 0)', // Cursor tip at position
                cursor: isDragging ? 'grabbing' : 'grab',
                zIndex: isSelected ? 1000 : 999,
                filter: isSelected ? 'drop-shadow(0 0 2px #3b82f6)' : 'none',
            }}
            onMouseDown={handleMouseDown}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(annotation.id);
            }}
        >
            <svg
                width={`${annotation.style.fontSize * 1.5}px`}
                height={`${annotation.style.fontSize * 1.5}px`}
                viewBox="0 0 24 24"
                fill={annotation.style.color}
                stroke="white"
                strokeWidth="2"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M5.5 3.5L11.5 19.5L14.5 13.5L20.5 10.5L5.5 3.5Z" strokeLinejoin="round" />
            </svg>
        </div>
    );
};

export default CursorAnnotation;
