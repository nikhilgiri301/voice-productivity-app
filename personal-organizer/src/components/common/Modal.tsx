import React, { useEffect, useRef } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: ModalSize;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = '',
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  const backdropClasses = [
    'fixed',
    'inset-0',
    'z-modal-backdrop',
    'bg-black',
    'bg-opacity-50',
    'backdrop-blur-sm',
    'transition-opacity',
    'duration-300',
    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
  ].join(' ');

  const modalClasses = [
    'fixed',
    'inset-0',
    'z-modal',
    'flex',
    'items-center',
    'justify-center',
    'p-4',
    'transition-all',
    'duration-300',
    isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
  ].join(' ');

  const contentClasses = [
    'glass-card',
    'w-full',
    sizeClasses[size],
    'max-h-[90vh]',
    'overflow-y-auto',
    'transform',
    'transition-all',
    'duration-300',
    'animate-fade-in-up',
    className,
  ].join(' ');

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (closeOnEscape && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
    return undefined;
  }, [isOpen, closeOnEscape, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus the modal
      const timeoutId = setTimeout(() => {
        modalRef.current?.focus();
      }, 100);

      return () => clearTimeout(timeoutId);
    } else {
      // Restore focus to the previously focused element
      previousFocusRef.current?.focus();
      return undefined;
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
    return undefined;
  }, [isOpen]);

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>
  ): void => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    // Trap focus within modal
    if (event.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div className={backdropClasses} onClick={handleBackdropClick} />

      {/* Modal */}
      <div className={modalClasses} onClick={handleBackdropClick}>
        <div
          ref={modalRef}
          className={contentClasses}
          role='dialog'
          aria-modal='true'
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
        >
          {title && (
            <div className='flex items-center justify-between p-card-padding border-b border-border-default'>
              <h2
                id={ariaLabelledBy}
                className='text-card-title text-text-primary'
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className='touch-target p-2 text-text-secondary hover:text-text-primary transition-colors'
                aria-label='Close modal'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
          )}

          <div className={title ? 'p-card-padding' : 'p-card-padding'}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
