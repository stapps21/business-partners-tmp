import React, { useState } from 'react';

interface UseDragDropReturn {
    isDragging: () => boolean;
    handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>, onDrop: (files: FileList) => void) => void;
}

const useDragDrop = (): UseDragDropReturn => {
    const [dragCounter, setDragCounter] = useState(0);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(prev => prev + 1);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(prev => prev - 1);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, onDrop: (files: FileList) => void) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(0);
        // Process the files
        const files = e.dataTransfer.files;
        onDrop(files)
        // Or call a function to handle the files
    };

    const isDragging = () => {
        return dragCounter > 0
    }

    return { isDragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop };
};

export default useDragDrop;
