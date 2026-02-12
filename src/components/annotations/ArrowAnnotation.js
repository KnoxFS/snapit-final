import { useState, useEffect } from 'react';

/**
 * ArrowAnnotation Component
 * Renders a directional arrow (up, down, left, right)
 */
const ArrowAnnotation = ({
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
            // Calculate delta in percentage relative to wrapper size
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

    // Get rotation based on direction
    const getRotation = () => {
        switch (annotation.direction) {
            case 'up': return -90;
            case 'down': return 90;
            case 'left': return 180;
            case 'right': return 0;
            default: return 0;
        }
    };

    return (
        <div
            style={{
                position: 'absolute',
                left: `${annotation.position.x}%`,
                top: `${annotation.position.y}%`,
                transform: `translate(-50%, -50%) rotate(${getRotation()}deg)`,
                cursor: isDragging ? 'grabbing' : 'grab',
                zIndex: isSelected ? 1000 : 999,
                filter: isSelected ? 'drop-shadow(0 0 4px #3b82f6)' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
            onMouseDown={handleMouseDown}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(annotation.id);
            }}
        >
            <svg
                width="100"
                height="50"
                viewBox="0 0 100 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    overflow: 'visible',
                    width: `${annotation.style.fontSize * 4}px`, // Scale width with font size prop
                    height: `${annotation.style.fontSize * 2}px`,
                }}
            >
                {/* Simple Arrow Shape */}
                <path
                    d="M0 25 H80 M80 25 L65 10 M80 25 L65 40"
                    stroke={annotation.style.color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};

export default ArrowAnnotation;
