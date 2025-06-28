import React, { useState } from 'react';
import { NoteFormData } from '../../types';
import { FileText, Tag } from 'lucide-react';

interface NoteFormProps {
  onSubmit: (data: NoteFormData) => void;
  onCancel: () => void;
  initialData?: Partial<NoteFormData>;
  isLoading?: boolean;
}

export const NoteForm: React.FC<NoteFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  isLoading = false
}) => {
  const [formData, setFormData] = useState<NoteFormData>({
    title: initialData.title || '',
    content: initialData.content || '',
    tags: initialData.tags || ''
  });

  const [errors, setErrors] = useState<Partial<NoteFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<NoteFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof NoteFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getTagsArray = () => {
    return (formData.tags || '')
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  };

  return (
    <div className="ios-card p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-ios-purple bg-opacity-20 rounded-ios">
            <FileText className="w-5 h-5 text-ios-purple" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            {initialData.title ? 'Edit Note' : 'New Note'} <span className="text-xs text-ios-purple">(Optimized)</span>
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-ios transition-colors"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
            Note Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`ios-input ${errors.title ? 'border-ios-red focus:ring-ios-red' : ''}`}
            placeholder="Enter note title"
            disabled={isLoading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-ios-red">{errors.title}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-white mb-2">
            Content *
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            className={`ios-input resize-none ${errors.content ? 'border-ios-red focus:ring-ios-red' : ''}`}
            rows={8}
            placeholder="Write your note content here..."
            disabled={isLoading}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-ios-red">{errors.content}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            {formData.content.length} characters
          </p>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-white mb-2">
            <Tag className="w-4 h-4 inline mr-1" />
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={formData.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
            className="ios-input"
            placeholder="Enter tags separated by commas"
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-ios-gray-500">
            Separate multiple tags with commas (e.g., work, ideas, important)
          </p>
          
          {/* Tag Preview */}
          {formData.tags && (
            <div className="mt-2 flex flex-wrap gap-2">
              {getTagsArray().map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-ios-purple bg-opacity-10 text-ios-purple"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-ios-gray-300 rounded-ios text-ios-gray-700 font-medium hover:bg-ios-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 ios-button disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (initialData.title ? 'Update Note' : 'Create Note')}
          </button>
        </div>
      </form>
    </div>
  );
};
