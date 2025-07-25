import { useState, useCallback } from 'react';

export const useNotification = () => {
    const [notification, setNotification] = useState({
        type: null,
        message: '',
        title: '',
        isVisible: false,
        onRetry: null
    });

    const showSuccess = useCallback((message, title = 'Berhasil!') => {
        setNotification({
            type: 'success',
            message,
            title,
            isVisible: true,
            onRetry: null
        });
    }, []);

    const showError = useCallback((message, title = 'Error!', onRetry = null) => {
        setNotification({
            type: 'error',
            message,
            title,
            isVisible: true,
            onRetry
        });
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(prev => ({
            ...prev,
            isVisible: false
        }));
    }, []);

    return {
        notification,
        showSuccess,
        showError,
        hideNotification
    };
};