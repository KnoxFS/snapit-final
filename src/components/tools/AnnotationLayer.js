import TextAnnotation from '../annotations/TextAnnotation';

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
        if (annotationTypeToAdd === 'text') {
            const newAnnotation = {
                id: `annotation-${Date.now()}`,
                type: 'text',
                position: { x, y },
                content: '',
                style: {
                    color: '#000000',
                    fontSize: 24,
                    fontWeight: 600,
                },
            };
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
                    if (annotation.type === 'text') {
                        return (
                            <TextAnnotation
                                key={annotation.id}
                                annotation={annotation}
                                isSelected={selectedAnnotationId === annotation.id}
                                onUpdate={onUpdateAnnotation}
                                onSelect={onSelectAnnotation}
                                onDelete={onDeleteAnnotation}
                                wrapperRef={wrapperRef}
                            />
                        );
                    }

                    // TODO: Add other annotation types (arrow, shapes)
                    return null;
                })}
            </div>
        </div>
    );
};

export default AnnotationLayer;
