import { Disclosure } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/outline';

/**
 * Annotations Tool Component
 * Collapsible section in options panel for managing annotations
 */
const Annotations = ({
    annotations,
    selectedAnnotationId,
    isAddingAnnotation,
    annotationTypeToAdd,
    onSelectTool,
    onUpdateStyle,
    onDeleteAnnotation,
    onCancelAdd,
}) => {
    const selectedAnnotation = annotations.find(a => a.id === selectedAnnotationId);

    return (
        <Disclosure defaultOpen={false}>
            {({ open }) => (
                <>
                    <Disclosure.Button className='flex w-full items-center justify-between text-left text-sm font-medium text-darkGreen dark:text-white focus:outline-none'>
                        <span className='flex items-center'>
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Annotations
                        </span>
                        <ChevronRightIcon
                            className={`${open ? 'rotate-90 transform' : ''} h-5 w-5 text-white transition`}
                        />
                    </Disclosure.Button>

                    <Disclosure.Panel className='mt-2 space-y-3'>
                        {/* Add Annotation Tools */}
                        <div>
                            <label className='mb-2 block text-xs font-medium text-gray-400'>
                                Add Annotation
                            </label>
                            <div className="grid grid-cols-4 gap-2 w-full">
                                <button
                                    onClick={() => onSelectTool('text')}
                                    className={`flex flex-col items-center justify-center p-2 rounded-md text-xs font-medium transition ${annotationTypeToAdd === 'text'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-[#2B2C2F] text-gray-400 hover:bg-[#3a3a3a] hover:text-white'
                                        }`}
                                    title="Text"
                                >
                                    <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                    </svg>
                                    Text
                                </button>

                                <button
                                    onClick={() => onSelectTool('arrow-right')}
                                    className={`flex flex-col items-center justify-center p-2 rounded-md text-xs font-medium transition ${annotationTypeToAdd === 'arrow-right'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-[#2B2C2F] text-gray-400 hover:bg-[#3a3a3a] hover:text-white'
                                        }`}
                                    title="Arrow Right"
                                >
                                    <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                    Right
                                </button>

                                <button
                                    onClick={() => onSelectTool('arrow-left')}
                                    className={`flex flex-col items-center justify-center p-2 rounded-md text-xs font-medium transition ${annotationTypeToAdd === 'arrow-left'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-[#2B2C2F] text-gray-400 hover:bg-[#3a3a3a] hover:text-white'
                                        }`}
                                    title="Arrow Left"
                                >
                                    <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Left
                                </button>

                                <button
                                    onClick={() => onSelectTool('arrow-up')}
                                    className={`flex flex-col items-center justify-center p-2 rounded-md text-xs font-medium transition ${annotationTypeToAdd === 'arrow-up'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-[#2B2C2F] text-gray-400 hover:bg-[#3a3a3a] hover:text-white'
                                        }`}
                                    title="Arrow Up"
                                >
                                    <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                    Up
                                </button>

                                <button
                                    onClick={() => onSelectTool('arrow-down')}
                                    className={`flex flex-col items-center justify-center p-2 rounded-md text-xs font-medium transition ${annotationTypeToAdd === 'arrow-down'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-[#2B2C2F] text-gray-400 hover:bg-[#3a3a3a] hover:text-white'
                                        }`}
                                    title="Arrow Down"
                                >
                                    <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                    Down
                                </button>

                                <button
                                    onClick={() => onSelectTool('rectangle')}
                                    className={`flex flex-col items-center justify-center p-2 rounded-md text-xs font-medium transition ${annotationTypeToAdd === 'rectangle'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-[#2B2C2F] text-gray-400 hover:bg-[#3a3a3a] hover:text-white'
                                        }`}
                                    title="Rectangle"
                                >
                                    <div className="w-4 h-4 mb-1 border-2 border-current rounded-sm" />
                                    Rect
                                </button>

                                <button
                                    onClick={() => onSelectTool('circle')}
                                    className={`flex flex-col items-center justify-center p-2 rounded-md text-xs font-medium transition ${annotationTypeToAdd === 'circle'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-[#2B2C2F] text-gray-400 hover:bg-[#3a3a3a] hover:text-white'
                                        }`}
                                    title="Circle"
                                >
                                    <div className="w-4 h-4 mb-1 border-2 border-current rounded-full" />
                                    Circle
                                </button>

                                <button
                                    onClick={() => onSelectTool('cursor')}
                                    className={`flex flex-col items-center justify-center p-2 rounded-md text-xs font-medium transition ${annotationTypeToAdd === 'cursor'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-[#2B2C2F] text-gray-400 hover:bg-[#3a3a3a] hover:text-white'
                                        }`}
                                    title="Cursor"
                                >
                                    <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 24 24" stroke="white" strokeWidth="1">
                                        <path d="M5.5 3.5L11.5 19.5L14.5 13.5L20.5 10.5L5.5 3.5Z" />
                                    </svg>
                                    Cursor
                                </button>
                            </div>
                            {isAddingAnnotation && (
                                <button
                                    onClick={onCancelAdd}
                                    className="w-full mt-2 px-3 py-2 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition text-sm"
                                    title="Cancel"
                                >
                                    Cancel Adding
                                </button>
                            )}

                            {isAddingAnnotation && (
                                <p className="mt-2 text-xs text-green-400">
                                    ✓ Click on screenshot to add {annotationTypeToAdd}
                                </p>
                            )}
                        </div>

                        {/* Style Controls - Only show when annotation is selected */}
                        {selectedAnnotation && (
                            <div className='space-y-3 border-t border-gray-700 pt-3'>
                                {/* Selected Annotation Info - Only for text annotations */}
                                {selectedAnnotation.type === 'text' && (
                                    <div>
                                        <label className='mb-2 block text-xs font-medium text-gray-400'>
                                            Selected Annotation
                                        </label>
                                        <p className='text-xs text-gray-500 mb-2'>
                                            {selectedAnnotation.content || 'Empty text'}
                                        </p>
                                    </div>
                                )}

                                {/* Color Picker */}
                                <div>
                                    <label className='mb-1 block text-xs font-medium text-gray-400'>
                                        Color
                                    </label>
                                    <div className='flex items-center space-x-2'>
                                        <input
                                            type="color"
                                            value={selectedAnnotation.style.color}
                                            onChange={(e) => onUpdateStyle({ color: e.target.value })}
                                            className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                                        />
                                        <input
                                            type="text"
                                            value={selectedAnnotation.style.color}
                                            onChange={(e) => onUpdateStyle({ color: e.target.value })}
                                            className="flex-1 px-2 py-1.5 text-xs bg-[#2B2C2F] rounded border border-gray-600 text-white outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Size Control (for all annotations) */}
                                <div>
                                    <label className='mb-1 block text-xs font-medium text-gray-400'>
                                        {selectedAnnotation.type === 'text' ? 'Font Size' : 'Size'}: {selectedAnnotation.style.fontSize}px
                                    </label>
                                    <input
                                        type="range"
                                        min="12"
                                        max="72"
                                        value={selectedAnnotation.style.fontSize}
                                        onChange={(e) => onUpdateStyle({ fontSize: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={() => onDeleteAnnotation(selectedAnnotation.id)}
                                    className="w-full flex items-center justify-center px-3 py-2 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition text-sm"
                                >
                                    <TrashIcon className="w-4 h-4 mr-1.5" />
                                    Delete Annotation
                                </button>
                            </div>
                        )}

                        {/* Help Text */}
                        {!selectedAnnotation && !isAddingAnnotation && annotations.length === 0 && (
                            <p className="text-xs text-gray-500 text-center py-2">
                                Click "Text" to add your first annotation
                            </p>
                        )}

                        {annotations.length > 0 && !selectedAnnotation && !isAddingAnnotation && (
                            <p className="text-xs text-gray-500 text-center py-2">
                                Click an annotation on the screenshot to edit it
                            </p>
                        )}
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
};

export default Annotations;
