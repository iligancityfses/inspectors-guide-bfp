import React, { useState, useEffect } from 'react';
import { FaBook, FaSearch, FaBookmark, FaFilePdf, FaExternalLinkAlt } from 'react-icons/fa';
import { fireCodeReferences } from '@/data/fireCodeReferences';
import { nfpaReferenceLibrary } from '@/data/nfpaReferences';
import { bfpMemorandums } from '@/data/bfpMemorandums';

interface Reference {
  id: string;
  title: string;
  description: string;
  type: 'fire-code' | 'nfpa' | 'memorandum' | 'guideline';
  category: string;
  content?: string;
  url?: string;
  tags: string[];
  datePublished?: string;
}

const ReferenceLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeType, setActiveType] = useState<string>('all');
  const [references, setReferences] = useState<Reference[]>([]);
  const [filteredReferences, setFilteredReferences] = useState<Reference[]>([]);
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);
  const [bookmarkedReferences, setBookmarkedReferences] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);
  
  // Load all references
  useEffect(() => {
    // Combine all reference sources
    const allReferences: Reference[] = [
      ...fireCodeReferences,
      ...nfpaReferenceLibrary,
      ...bfpMemorandums
    ];
    
    setReferences(allReferences);
    setFilteredReferences(allReferences);
    
    // Load bookmarks from localStorage
    const savedBookmarks = localStorage.getItem('referenceBookmarks');
    if (savedBookmarks) {
      setBookmarkedReferences(JSON.parse(savedBookmarks));
    }
  }, []);
  
  // Filter references based on search, category, and type
  useEffect(() => {
    let filtered = references;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ref => 
        ref.title.toLowerCase().includes(query) || 
        ref.description.toLowerCase().includes(query) || 
        ref.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (ref.content && ref.content.toLowerCase().includes(query))
      );
    }
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(ref => ref.category === activeCategory);
    }
    
    // Filter by type
    if (activeType !== 'all') {
      filtered = filtered.filter(ref => ref.type === activeType);
    }
    
    // Filter by bookmarks
    if (showBookmarksOnly) {
      filtered = filtered.filter(ref => bookmarkedReferences.includes(ref.id));
    }
    
    setFilteredReferences(filtered);
  }, [searchQuery, activeCategory, activeType, references, showBookmarksOnly, bookmarkedReferences]);
  
  // Toggle bookmark
  const toggleBookmark = (referenceId: string) => {
    let newBookmarks: string[];
    
    if (bookmarkedReferences.includes(referenceId)) {
      newBookmarks = bookmarkedReferences.filter(id => id !== referenceId);
    } else {
      newBookmarks = [...bookmarkedReferences, referenceId];
    }
    
    setBookmarkedReferences(newBookmarks);
    localStorage.setItem('referenceBookmarks', JSON.stringify(newBookmarks));
  };
  
  // Get unique categories
  const categories = ['all', ...Array.from(new Set(references.map(ref => ref.category)))];
  
  // Get reference types
  const referenceTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'fire-code', name: 'Fire Code' },
    { id: 'nfpa', name: 'NFPA Standards' },
    { id: 'memorandum', name: 'BFP Memorandums' },
    { id: 'guideline', name: 'Guidelines' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <FaBook className="text-red-600 dark:text-red-400 text-2xl mr-2" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fire Safety Reference Library</h2>
      </div>
      
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Access a comprehensive library of fire safety references, including the Revised Fire Code of the Philippines, NFPA standards, BFP memorandums, and guidelines. Search by keyword, category, or reference type.
      </p>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search references..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Reference Type</h3>
            <div className="space-y-1">
              {referenceTypes.map(type => (
                <button
                  key={type.id}
                  className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                    activeType === type.id
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveType(type.id)}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Categories</h3>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {categories.map(category => (
                <button
                  key={category}
                  className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                    activeCategory === category
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-red-600 dark:text-red-500 focus:ring-red-500 dark:focus:ring-red-400 border-gray-300 dark:border-gray-600 rounded"
                checked={showBookmarksOnly}
                onChange={() => setShowBookmarksOnly(!showBookmarksOnly)}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Show bookmarks only</span>
            </label>
          </div>
          
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm text-yellow-800 dark:text-yellow-300">
            <p><strong>Tip:</strong> Click on any reference to view its details. You can bookmark important references for quick access later.</p>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          {selectedReference ? (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{selectedReference.title}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleBookmark(selectedReference.id)}
                    className={`p-2 rounded-full ${
                      bookmarkedReferences.includes(selectedReference.id)
                        ? 'text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-500'
                        : 'text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    title={bookmarkedReferences.includes(selectedReference.id) ? 'Remove bookmark' : 'Add bookmark'}
                  >
                    <FaBookmark />
                  </button>
                  <button
                    onClick={() => setSelectedReference(null)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs rounded-md">
                  {selectedReference.type === 'fire-code' ? 'Fire Code' : 
                   selectedReference.type === 'nfpa' ? 'NFPA Standard' :
                   selectedReference.type === 'memorandum' ? 'BFP Memorandum' : 'Guideline'}
                </span>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs rounded-md">
                  {selectedReference.category}
                </span>
                {selectedReference.datePublished && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs rounded-md">
                    Published: {selectedReference.datePublished}
                  </span>
                )}
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedReference.description}</p>
                
                {selectedReference.content && (
                  <div className="mt-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md">
                    <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedReference.content }} />
                  </div>
                )}
                
                {selectedReference.url && (
                  <div className="mt-4">
                    <a
                      href={selectedReference.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-red-600"
                    >
                      {selectedReference.url.includes('.pdf') ? (
                        <>
                          <FaFilePdf className="mr-2" />
                          View PDF Document
                        </>
                      ) : (
                        <>
                          <FaExternalLinkAlt className="mr-2" />
                          View Full Document
                        </>
                      )}
                    </a>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Related Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedReference.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {filteredReferences.length} {filteredReferences.length === 1 ? 'reference' : 'references'} found
                </h3>
              </div>
              
              {filteredReferences.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No references found matching your criteria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReferences.map(reference => (
                    <div
                      key={reference.id}
                      className="p-4 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 cursor-pointer"
                      onClick={() => setSelectedReference(reference)}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-800 dark:text-white">{reference.title}</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(reference.id);
                          }}
                          className={`p-1 ${
                            bookmarkedReferences.includes(reference.id)
                              ? 'text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-500'
                              : 'text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300'
                          }`}
                        >
                          <FaBookmark />
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs rounded-md">
                          {reference.type === 'fire-code' ? 'Fire Code' : 
                           reference.type === 'nfpa' ? 'NFPA Standard' :
                           reference.type === 'memorandum' ? 'BFP Memorandum' : 'Guideline'}
                        </span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs rounded-md">
                          {reference.category}
                        </span>
                      </div>
                      
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{reference.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferenceLibrary;
