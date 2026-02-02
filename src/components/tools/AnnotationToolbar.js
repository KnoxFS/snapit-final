import { TrashIcon } from '@heroicons/react/24/outline';

/**
 * AnnotationToolbar Component
 * Provides UI controls for adding and styling annotations
 */
const AnnotationToolbar = ({
    isAddingAnnotation,
    annotationTypeToAdd,
    selectedAnnotation,
    onSelectTool,
    onUpdateStyle,
    onDeleteAnnotation,
    onCancelAdd,
}) => {
    const tools = [
        {
            id: 'text',
            name: 'Text',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            ),
        },
        // TODO: Add arrow, rectangle, circle, line tools
    ];

    return (
        <div className="flex items-center space-x-2 p-3 bg-[#2B2C2F] rounded-lg border border-gray-700 mb-4">
            {/* Tool Selection */}
            <div className="flex items-center space-x-1 pr-3 border-r border-gray-700">
                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => onSelectTool(tool.id)}
                        className={`p-2 rounded-md transition ${annotationTypeToAdd === tool.id
                                ? 'bg-green-500 text-white'
                                : 'bg-[#212121] text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                            }`}
                        title={tool.name}
                    >
                        {tool.icon}
                    </button>
                ))}

                {isAddingAnnotation && (
                    <button
                        onClick={onCancelAdd}
                        className="p-2 rounded-md bg-red-500/20 text-red-500 hover:bg-red-500/30 transition ml-2"
                        title="Cancel"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Style Controls - Only show when annotation is selected */}
            {selectedAnnotation && (
                <>
                    {/* Color Picker */}
                    <div className="flex items-center space-x-2 pr-3 border-r border-gray-700">
                        <label className="text-gray-400 text-sm">Color:</label>
                        <input
                            type="color"
                            value={selectedAnnotation.style.color}
                            onChange={(e) => onUpdateStyle({ color: e.target.value })}
                            className="w-8 h-8 rounded cursor-pointer"
                        />
                    </div>

                    {/* Font Size (for text annotations) */}
                    {selectedAnnotation.type === 'text' && (
                        <div className="flex items-center space-x-2 pr-3 border-r border-gray-700">
                            <label className="text-gray-400 text-sm">Size:</label>
                            <input
                                type="range"
                                min="12"
                                max="72"
                                value={selectedAnnotation.style.fontSize}
                                onChange={(e) => onUpdateStyle({ fontSize: parseInt(e.target.value) })}
                                className="w-24"
                            />
                            <span className="text-gray-400 text-sm w-8">{selectedAnnotation.style.fontSize}</span>
                        </div>
                    )}

                    {/* Delete Button */}
                    <button
                        onClick={() => onDeleteAnnotation(selectedAnnotation.id)}
                        className="p-2 rounded-md bg-red-500/20 text-red-500 hover:bg-red-500/30 transition"
                        title="Delete annotation"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </>
            )}

            {/* Help Text */}
            {!selectedAnnotation && !isAddingAnnotation && (
                <span className="text-gray-500 text-sm ml-auto">
                    Click a tool to add annotations
                </span>
            )}

            {isAddingAnnotation && (
                <span className="text-green-500 text-sm ml-auto">
                    Click on screenshot to add {annotationTypeToAdd}
                </span>
            )}
        </div>
    );
};

export default AnnotationToolbar;
