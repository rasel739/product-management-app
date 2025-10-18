'use client';

import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  isLoading?: boolean;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
  isLoading,
}: DeleteConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='sm'>
      <div className='text-center'>
        <div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4'>
          <AlertTriangle className='h-8 w-8 text-accent-red' />
        </div>

        <h3 className='text-xl font-bold text-primary mb-2'>Delete Product</h3>

        <p className='text-gray-600 mb-6'>
          Are you sure you want to delete <strong>{productName}</strong>? This action cannot be
          undone.
        </p>

        <div className='flex gap-3 justify-center'>
          <Button variant='secondary' onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant='danger' onClick={onConfirm} isLoading={isLoading}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
