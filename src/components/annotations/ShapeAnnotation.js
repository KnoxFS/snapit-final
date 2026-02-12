import { useState, useEffect } from 'react';

/**
 * ShapeAnnotation Component
 * Renders geometric shapes (rectangle, circle)
 */
const ShapeAnnotation = ({
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

    const size = annotation.style.fontSize * 4; // Scale size with font size prop

    return (
        <div
            style={{
                position: 'absolute',
                left: `${annotation.position.x}%`,
                top: `${annotation.position.y}%`,
                transform: 'translate(-50%, -50%)',
                width: `${size}px`,
                height: `${size}px`,
                cursor: isDragging ? 'grabbing' : 'grab',
                zIndex: isSelected ? 1000 : 999,
                border: `4px solid ${annotation.style.color}`,
                borderRadius: annotation.type === 'circle' ? '50%' : '4px',
                boxShadow: isSelected ? '0 0 0 2px #3b82f6' : 'none',
            }}
            onMouseDown={handleMouseDown}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(annotation.id);
            }}
        />
    );
};

export default ShapeAnnotation;
