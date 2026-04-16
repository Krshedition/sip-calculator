import React, { useState } from 'react';
import html2canvas from 'html2canvas';

export function ExportButton({ targetRef, filename = 'export.png', buttonText = 'Export as Image' }) {
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        if (!targetRef.current || exporting) return;

        setExporting(true);
        try {
            // Options to make it work well with dark mode and hidden overflows
            const canvas = await html2canvas(targetRef.current, {
                scale: 2, // High quality
                useCORS: true,
                backgroundColor: null, // Transparent to let app background show
                logging: false,
                windowWidth: targetRef.current.scrollWidth,
                windowHeight: targetRef.current.scrollHeight
            });

            const image = canvas.toDataURL("image/png", 1.0);
            
            // Trigger download
            const link = document.createElement('a');
            link.download = filename;
            link.href = image;
            link.click();
        } catch (err) {
            console.error("Export failed:", err);
            alert("Failed to export image.");
        } finally {
            setExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 dark:bg-dark-surface dark:text-slate-300 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
            {exporting ? (
                <svg className="animate-spin h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            )}
            {exporting ? 'Exporting...' : buttonText}
        </button>
    );
}
