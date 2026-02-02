import { useState } from 'react';

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
    const [isEditing, setIsEditing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        if (isEditing) return;

        e.stopPropagation();
        setIsDragging(true);
        setDragStart({
            x: e.clientX,
            y: e.clientY,
            startX: annotation.position.x,
            startY: annotation.position.y,
        });
        onSelect(annotation.id);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !wrapperRef.current) return;

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

    const handleDoubleClick = (e) => {
        e.stopPropagation();
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

    // Add global mouse move/up listeners when dragging
    if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }

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
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                border: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
                minWidth: '50px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                zIndex: isSelected ? 1000 : 999,
            }}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            onClick={() => !isEditing && onSelect(annotation.id)}
        >
            {isEditing ? (
                <input
                    type="text"
                    value={annotation.content}
                    onChange={handleContentChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
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
                        minWidth: '100px',
                    }}
                />
            ) : (
                <span>{annotation.content || 'Double-click to edit'}</span>
            )}
        </div>
    );
};

export default TextAnnotation;
