import { useState, useCallback } from 'react';

export const useNotification = () => {
    const [notification, setNotification] = useState({
        type: null,
        message: '',
        title: '',
        isVisible: false,
        onRetry: null,
        onConfirm: null,
        userName: '',
        itemName: '',
        confirmText: '',
        cancelText: ''
    });

    const showSuccess = useCallback((message, title = 'Berhasil!') => {
        setNotification({
            type: 'success',
            message,
            title,
            isVisible: true,
            onRetry: null,
            onConfirm: null,
            userName: '',
            itemName: '',
            confirmText: '',
            cancelText: ''
        });
    }, []);

    const showError = useCallback((message, title = 'Error!', onRetry = null) => {
        setNotification({
            type: 'error',
            message,
            title,
            isVisible: true,
            onRetry,
            onConfirm: null,
            userName: '',
            itemName: '',
            confirmText: '',
            cancelText: ''
        });
    }, []);

    const showWarning = useCallback((message, title = 'Peringatan!', onConfirm = null, confirmText = 'Ya, Lanjutkan', cancelText = 'Batal') => {
        setNotification({
            type: 'warning',
            message,
            title,
            isVisible: true,
            onRetry: null,
            onConfirm,
            confirmText,
            cancelText,
            userName: '',
            itemName: ''
        });
    }, []);

    const showLogout = useCallback((message = 'Apakah Anda yakin ingin keluar dari sistem?', title = 'Konfirmasi Logout', onConfirm = null, userName = 'User') => {
        setNotification({
            type: 'logout',
            message,
            title,
            isVisible: true,
            onRetry: null,
            onConfirm,
            userName,
            itemName: '',
            confirmText: '',
            cancelText: ''
        });
    }, []);

    const showDelete = useCallback((message = 'Data yang dihapus tidak dapat dikembalikan!', title = 'Konfirmasi Hapus', onConfirm = null, itemName = 'item ini') => {
        setNotification({
            type: 'delete',
            message,
            title,
            isVisible: true,
            onRetry: null,
            onConfirm,
            itemName,
            userName: '',
            confirmText: '',
            cancelText: ''
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
        showWarning,
        showLogout,
        showDelete,
        hideNotification
    };
};