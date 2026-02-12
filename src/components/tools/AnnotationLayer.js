import TextAnnotation from '../annotations/TextAnnotation';
import ArrowAnnotation from '../annotations/ArrowAnnotation';
import ShapeAnnotation from '../annotations/ShapeAnnotation';
import CursorAnnotation from '../annotations/CursorAnnotation';

/**
 * AnnotationLayer Component
 * Manages and renders all annotations on the screenshot
 */
const AnnotationLayer = ({
    annotations,
    selectedAnnotationId,
    onUpdateAnnotation,
    onSelectAnnotation,
    onDeleteAnnotation,
    wrapperRef,
    isAddingAnnotation,
    annotationTypeToAdd,
    onAnnotationAdded,
}) => {
    const handleClick = (e) => {
        // Only handle clicks when in "add annotation" mode
        if (!isAddingAnnotation || !annotationTypeToAdd) return;

        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const rect = wrapper.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Create new annotation based on type
        const newId = `annotation-${Date.now()}`;
        let newAnnotation = null;

        const defaultStyle = {
            color: '#ef4444', // Default red
            fontSize: 24,
            fontWeight: 600,
        };

        if (annotationTypeToAdd === 'text') {
            newAnnotation = {
                id: newId,
                type: 'text',
                position: { x, y },
                content: '',
                style: { ...defaultStyle, color: '#000000' },
            };
        } else if (annotationTypeToAdd.startsWith('arrow')) {
            const direction = annotationTypeToAdd.split('-')[1]; // arrow-up, arrow-down...
            newAnnotation = {
                id: newId,
                type: 'arrow',
                direction: direction,
                position: { x, y },
                style: defaultStyle,
            };
        } else if (annotationTypeToAdd === 'circle' || annotationTypeToAdd === 'rectangle') {
            newAnnotation = {
                id: newId,
                type: annotationTypeToAdd,
                position: { x, y },
                style: defaultStyle,
            };
        } else if (annotationTypeToAdd === 'cursor') {
            newAnnotation = {
                id: newId,
                type: 'cursor',
                position: { x, y },
                style: { ...defaultStyle, color: '#000000' },
            };
        }

        if (newAnnotation) {
            onAnnotationAdded(newAnnotation);
        }
    };

    const handleBackgroundClick = (e) => {
        // Deselect annotation when clicking on background
        if (e.target === e.currentTarget) {
            onSelectAnnotation(null);
        }
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: isAddingAnnotation ? 'auto' : 'none',
                cursor: isAddingAnnotation ? 'crosshair' : 'default',
                zIndex: 10,
            }}
            onClick={handleClick}
            onMouseDown={handleBackgroundClick}
        >
            {/* Render all annotations */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'auto',
                }}
            >
                {annotations.map((annotation) => {
                    const commonProps = {
                        key: annotation.id,
                        annotation,
                        isSelected: selectedAnnotationId === annotation.id,
                        onUpdate: onUpdateAnnotation,
                        onSelect: onSelectAnnotation,
                        onDelete: onDeleteAnnotation,
                        wrapperRef,
                    };

                    if (annotation.type === 'text') {
                        return <TextAnnotation {...commonProps} />;
                    }
                    if (annotation.type === 'arrow') {
                        return <ArrowAnnotation {...commonProps} />;
                    }
                    if (annotation.type === 'circle' || annotation.type === 'rectangle') {
                        return <ShapeAnnotation {...commonProps} />;
                    }
                    if (annotation.type === 'cursor') {
                        return <CursorAnnotation {...commonProps} />;
                    }

                    return null;
                })}
            </div>
        </div>
    );
};

export default AnnotationLayer;
