"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { motion } from "framer-motion";

type AlertOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type AlertContextType = {
  showAlert: (options: AlertOptions) => void;
  closeAlert: () => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within AlertProvider");
  }
  return context;
}

export function AlertProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<AlertOptions>({});

  const showAlert = (opts: AlertOptions) => {
    setOptions(opts);
    setIsOpen(true);
  };

  const closeAlert = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    options.onConfirm?.();
    closeAlert();
  };

  const handleCancel = () => {
    options.onCancel?.();
    closeAlert();
  };

  return (
    <AlertContext.Provider value={{ showAlert, closeAlert }}>
      {children}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-700 w-full max-w-md mx-auto rounded-lg p-6 shadow-lg animate-fade-in">
            <h2 className="text-xl font-semibold mb-2">{options.title}</h2>
            <p className="mb-4">{options.description}</p>
            <div className="flex justify-end gap-3">
              {options.cancelText && (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 hover:dark:bg-gray-800 text-sm rounded">
                  {options.cancelText ?? "Cancel"}
                </button>
              )}
              {options.confirmText && (
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white  text-sm rounded">
                  {options.confirmText ?? "Confirm"}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AlertContext.Provider>
  );
}
