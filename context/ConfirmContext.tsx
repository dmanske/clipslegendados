import React, { createContext, useContext, useState, useCallback } from 'react';

interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

interface ConfirmContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within ConfirmProvider');
    }
    return context;
};

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions | null>(null);
    const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

    const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
        setOptions(opts);
        setIsOpen(true);

        return new Promise<boolean>((resolve) => {
            setResolver(() => resolve);
        });
    }, []);

    const handleConfirm = () => {
        if (resolver) {
            resolver(true);
        }
        setIsOpen(false);
        setOptions(null);
        setResolver(null);
    };

    const handleCancel = () => {
        if (resolver) {
            resolver(false);
        }
        setIsOpen(false);
        setOptions(null);
        setResolver(null);
    };

    const getTypeStyles = () => {
        switch (options?.type) {
            case 'danger':
                return {
                    icon: 'error',
                    iconColor: 'text-red-500',
                    confirmBg: 'bg-red-500 hover:bg-red-600',
                };
            case 'warning':
                return {
                    icon: 'warning',
                    iconColor: 'text-yellow-500',
                    confirmBg: 'bg-yellow-500 hover:bg-yellow-600',
                };
            default:
                return {
                    icon: 'info',
                    iconColor: 'text-blue-500',
                    confirmBg: 'bg-primary hover:bg-primary/90',
                };
        }
    };

    const typeStyles = getTypeStyles();

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-fade-in">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={handleCancel}
                    />

                    {/* Modal */}
                    <div className="relative bg-[#111a22] border border-[#324d67] rounded-xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                            <div className={`size-16 rounded-full ${typeStyles.iconColor} bg-current/10 flex items-center justify-center`}>
                                <span className={`material-symbols-outlined text-4xl ${typeStyles.iconColor}`}>
                                    {typeStyles.icon}
                                </span>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-white text-xl font-bold text-center mb-2">
                            {options?.title}
                        </h3>

                        {/* Message */}
                        <p className="text-gray-300 text-center mb-6">
                            {options?.message}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="flex-1 h-11 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-bold transition-colors"
                            >
                                {options?.cancelText || 'Cancelar'}
                            </button>
                            <button
                                onClick={handleConfirm}
                                className={`flex-1 h-11 rounded-lg text-white font-bold transition-colors ${typeStyles.confirmBg}`}
                            >
                                {options?.confirmText || 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
};
