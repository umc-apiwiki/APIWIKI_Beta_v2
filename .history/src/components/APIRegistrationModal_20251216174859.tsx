// src/components/APIRegistrationModal.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalBase from './ModalBase';
import APIRegistrationForm from './APIRegistrationForm';
import type { APISubmissionPayload } from '@/types';

interface APIRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function APIRegistrationModal({ isOpen, onClose }: APIRegistrationModalProps) {
    const router = useRouter();
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (data: APISubmissionPayload) => {
        const response = await fetch('/api/apis/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'API 등록에 실패했습니다');
        }

        // 성공 메시지 표시
        setSuccessMessage('API가 성공적으로 등록되었습니다. 관리자 승인 후 공개됩니다.');

        // 2초 후 모달 닫기
        setTimeout(() => {
            setSuccessMessage('');
            onClose();
            router.refresh();
        }, 2000);
    };

    const handleClose = () => {
        setSuccessMessage('');
        onClose();
    };

    return (
        <ModalBase isOpen={isOpen} onClose={handleClose} title="API 등록">
            {successMessage ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
                    {successMessage}
                </div>
            ) : (
                <APIRegistrationForm onSubmit={handleSubmit} onCancel={handleClose} />
            )}
        </ModalBase>
    );
}
