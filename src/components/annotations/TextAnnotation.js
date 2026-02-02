import { useState, useEffect } from 'react';

/**
 * TextAnnotation Component
 * Renders an editable text annotation that can be dragged and styled
 */
const TextAnnotation = ({
    annotation,
    isSelected,
    onUpdate,
    onSelect,
    onDelete,
    wrapperRef
}) => {
    const [isEditing, setIsEditing] = useState(true); // Start in edit mode
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Handle dragging with useEffect
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
        if (isEditing) return;

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

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsEditing(true);
    };

    const handleContentChange = (e) => {
        onUpdate(annotation.id, { content: e.target.value });
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (!annotation.content.trim()) {
            onDelete(annotation.id);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            setIsEditing(false);
        }
        if (e.key === 'Escape') {
            setIsEditing(false);
        }
    };

    return (
        <div
            style={{
                position: 'absolute',
                left: `${annotation.position.x}%`,
                top: `${annotation.position.y}%`,
                transform: 'translate(-50%, -50%)',
                color: annotation.style.color,
                fontSize: `${annotation.style.fontSize}px`,
                fontWeight: annotation.style.fontWeight || 600,
                cursor: isDragging ? 'grabbing' : isEditing ? 'text' : 'grab',
                userSelect: isEditing ? 'text' : 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0, 0, 0, 0.5)',
                border: isSelected ? '2px solid #3b82f6' : '2px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(8px)',
                minWidth: '80px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                zIndex: isSelected ? 1000 : 999,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            onClick={(e) => {
                e.stopPropagation();
                if (!isEditing) onSelect(annotation.id);
            }}
        >
            {isEditing ? (
                <input
                    type="text"
                    value={annotation.content}
                    onChange={handleContentChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="Type text..."
                    autoFocus
                    style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'inherit',
                        fontSize: 'inherit',
                        fontWeight: 'inherit',
                        textAlign: 'center',
                        width: '100%',
                        minWidth: '120px',
                    }}
                />
            ) : (
                <span>{annotation.content || 'Double-click to edit'}</span>
            )}
        </div>
    );
};

export default TextAnnotation;
