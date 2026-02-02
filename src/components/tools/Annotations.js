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
                    <Disclosure.Button className='flex w-full items-center justify-between rounded-md bg-[#2B2C2F] p-3 text-left text-sm font-medium text-white hover:bg-[#3a3a3a] focus:outline-none'>
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

                    <Disclosure.Panel className='mt-2 space-y-3 rounded-md bg-[#212121] p-3'>
                        {/* Add Annotation Tools */}
                        <div>
                            <label className='mb-2 block text-xs font-medium text-gray-400'>
                                Add Annotation
                            </label>
                            <div className='flex items-center space-x-2'>
                                <button
                                    onClick={() => onSelectTool('text')}
                                    className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition ${annotationTypeToAdd === 'text'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-[#2B2C2F] text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                                        }`}
                                    title="Add text annotation"
                                >
                                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                    </svg>
                                    Text
                                </button>

                                {isAddingAnnotation && (
                                    <button
                                        onClick={onCancelAdd}
                                        className="px-3 py-2 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition text-sm"
                                        title="Cancel"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>

                            {isAddingAnnotation && (
                                <p className="mt-2 text-xs text-green-400">
                                    ✓ Click on screenshot to add {annotationTypeToAdd}
                                </p>
                            )}
                        </div>

                        {/* Style Controls - Only show when annotation is selected */}
                        {selectedAnnotation && (
                            <div className='space-y-3 border-t border-gray-700 pt-3'>
                                <div>
                                    <label className='mb-2 block text-xs font-medium text-gray-400'>
                                        Selected Annotation
                                    </label>
                                    <p className='text-xs text-gray-500 mb-2'>
                                        {selectedAnnotation.content || 'Empty text'}
                                    </p>
                                </div>

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

                                {/* Font Size (for text annotations) */}
                                {selectedAnnotation.type === 'text' && (
                                    <div>
                                        <label className='mb-1 block text-xs font-medium text-gray-400'>
                                            Font Size: {selectedAnnotation.style.fontSize}px
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
                                )}

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
