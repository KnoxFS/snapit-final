import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { iconLibrary, iconCategories } from 'constants/iconLibrary';

const IconPicker = ({ isOpen, onClose, onSelect }) => {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Filter icons based on search and category
    const filteredIcons = iconLibrary.filter(icon => {
        const matchesSearch =
            search === '' ||
            icon.name.toLowerCase().includes(search.toLowerCase()) ||
            icon.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()));

        const matchesCategory =
            selectedCategory === 'all' || icon.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const handleIconSelect = (icon) => {
        onSelect(icon);
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

            {/* Full-screen container */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                {/* Modal panel */}
                <Dialog.Panel className="mx-auto max-w-2xl w-full bg-[#2B2C2F] rounded-xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-700">
                        <Dialog.Title className="text-lg font-semibold text-white">
                            Select an Icon
                        </Dialog.Title>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="p-4 border-b border-gray-700">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search icons..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-[#212121] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition"
                            />
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 px-4 py-3 border-b border-gray-700 overflow-x-auto scrollbar-none">
                        {iconCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-3 py-1 rounded-md text-sm whitespace-nowrap transition ${selectedCategory === category.id
                                        ? 'bg-green-500 text-white'
                                        : 'bg-[#212121] text-gray-400 hover:text-white'
                                    }`}>
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Icon Grid */}
                    <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {filteredIcons.length > 0 ? (
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                                {filteredIcons.map((icon) => {
                                    const IconComponent = icon.component;
                                    return (
                                        <button
                                            key={icon.id}
                                            onClick={() => handleIconSelect(icon)}
                                            className="group flex flex-col items-center justify-center p-3 rounded-lg bg-[#212121] hover:bg-green-500/20 hover:border-green-500 border-2 border-transparent transition-all duration-200 hover:scale-110"
                                            title={icon.name}>
                                            <div className="w-12 h-12 flex items-center justify-center text-gray-400 group-hover:text-green-500 transition">
                                                <IconComponent className="w-full h-full" />
                                            </div>
                                            <span className="text-xs text-gray-400 group-hover:text-white mt-1 truncate w-full text-center">
                                                {icon.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <MagnifyingGlassIcon className="w-16 h-16 mb-4 opacity-50" />
                                <p className="text-lg">No icons found</p>
                                <p className="text-sm mt-1">Try a different search term</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-700 bg-[#212121]">
                        <p className="text-sm text-gray-400 text-center">
                            {filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''} available
                        </p>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default IconPicker;
