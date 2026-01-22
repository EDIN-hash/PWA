import React, { useState } from "react";

export default function NMCard({ item, editItem, deleteItem, role }) {
    const [openPhoto, setOpenPhoto] = useState(false);

    return (
        <>
            <div className="card card-premium card-hover-effect fade-in-up nm-card">
                <div className="flex justify-between items-start mb-3">
                    <h2 className="text-lg font-semibold text-slate-800 truncate max-w-[70%]">{item.name}</h2>
                    <div className="flex gap-1">
                        <span className="badge-modern bg-gray-900/50 border-gray-500/50 text-gray-400">
                            {item.category}
                        </span>
                        {item.quantity && (
                            <span className="badge-modern bg-purple-900/50 border-purple-500/50 text-purple-400">
                                {item.quantity}
                            </span>
                        )}
                    </div>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                    <span className={`badge-modern ${item.stan === 1 || item.stan === true ? 'bg-green-900/50 border-green-500/50 text-green-400' : 'bg-red-900/50 border-red-500/50 text-red-400'}`}>
                        {item.stan === 1 || item.stan === true ? 'Na stanie' : 'Wyjechało'}
                    </span>
                    <span className="badge-modern bg-blue-900/50 border-blue-500/50 text-blue-400">
                        Ilość: {item.ilosc}
                    </span>
                </div>
                
                {item.photo_url && (
                    <div className="mb-4 relative group cursor-pointer" onClick={() => setOpenPhoto(true)}>
                        <img
                            src={item.photo_url}
                            alt={item.name}
                            className="rounded-lg object-cover h-80 w-full border border-slate-200 group-hover:opacity-90 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity flex items-center justify-center">
                            <span className="text-white text-sm font-medium bg-black bg-opacity-50 px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Powiększ
                            </span>
                        </div>
                    </div>
                )}
                
                <div className="space-y-2 text-sm">
                    {item.description && (
                        <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p className="text-slate-600">{item.description}</p>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-slate-600">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121M12 12l2.879 2.879"></path>
                            </svg>
                            <div>
                                <div className="text-xs text-slate-500">Wysokość</div>
                                <div className="font-medium">{item.wysokosc || '-'}&nbsp;cm</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121M12 12l2.879 2.879"></path>
                            </svg>
                            <div>
                                <div className="text-xs text-slate-500">Szerokość</div>
                                <div className="font-medium">{item.szerokosc || '-'}&nbsp;cm</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121M12 12l2.879 2.879"></path>
                            </svg>
                            <div>
                                <div className="text-xs text-slate-500">Głębokość</div>
                                <div className="font-medium">{item.glebokosc || '-'}&nbsp;cm</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 col-span-2">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <div>
                                <div className="text-xs text-slate-500">Data wyjazdu</div>
                                <div className="font-medium">{item.data_wyjazdu || '-'}</div>
                            </div>
                        </div>
                    </div>
                    
                    {item.linknadysk && (
                        <div className="pt-2">
                            <a
                                href={item.linknadysk}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                </svg>
                                Link na Dysk
                            </a>
                        </div>
                    )}
                    
                    {item.updatedAt && (
                        <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                            <div className="flex justify-between">
                                <span className="font-medium">Ostatnio edytowane:</span>
                                <span>{new Date(item.updatedAt).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Przez:</span>
                                <span>{item.updatedBy || 'Nieznany'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Urządzenie:</span>
                                <span>{item.deviceId || 'Nieznane'}</span>
                            </div>
                            {item.deviceId && (
                                <div className="flex justify-between">
                                    <span className="font-medium">Info urządzenia:</span>
                                    <span className="text-right">{item.deviceId}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="font-medium">Stoisko:</span>
                                <span>{item.stoisko || '*Tutaj wpisz stoisko*'}</span>
                            </div>
                        </div>
                    )}
                </div>
                
                {role && role === "admin" && (
                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                        <button
                            className="btn-modern px-4 py-2 text-sm font-medium shadow-sm flex items-center gap-1"
                            onClick={() => editItem(item)}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                            Edytuj
                        </button>
                        <button
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium shadow-sm"
                            onClick={() => deleteItem(item.name)}
                        >
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                Usuń
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {openPhoto && item.photo_url && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-lg flex items-center justify-center z-50 p-4 slide-up"
                    onClick={() => setOpenPhoto(false)}
                >
                    <div
                        className="relative max-w-[90vw] max-h-[90vh] modal-modern overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all z-10"
                            onClick={() => setOpenPhoto(false)}
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                        <img
                            src={item.photo_url}
                            alt={item.name}
                            className="object-contain max-h-[75vh] w-auto mx-auto p-6"
                        />
                        <div className="bg-black/30 px-6 py-4 border-t border-white/10">
                            <h3 className="font-semibold text-white truncate text-gradient green-accent">{item.name}</h3>
                            <p className="text-sm text-white/80 mt-2">{item.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}