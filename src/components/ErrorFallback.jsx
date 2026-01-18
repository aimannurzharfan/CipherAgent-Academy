import React from 'react';

export function ErrorFallback({ error, resetErrorBoundary }) {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 text-white p-8 border-4 border-red-600">
            <h1 className="text-3xl font-bold text-red-500 mb-4">SYSTEM CRASH DETECTED</h1>
            <pre className="bg-slate-900 p-4 rounded text-red-300 font-mono text-xs overflow-auto max-w-2xl mb-8 border border-red-900">
                {error.message}
                {'\n'}
                {error.stack}
            </pre>
            <button
                onClick={resetErrorBoundary}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded uppercase tracking-widest"
            >
                Reboot System
            </button>
        </div>
    );
}
