import React, { useState } from "react";

export default function Card({ item, editItem, deleteItem, role }) {
    const [openPhoto, setOpenPhoto] = useState(false);

    return (
        <>
            <div className="ecommerce-card ecommerce-fade-in">
                <div className="ecommerce-card-image">
                    {item.photo_url ? (
                        <img
                            src={item.photo_url}
                            alt={item.name}
                            onClick={() => setOpenPhoto(true)}
                            className="cursor-pointer"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                        <span className="ecommerce-badge ecommerce-badge-primary">
                            {item.category}
                        </span>
                        {item.quantity && (
                            <span className="ecommerce-badge ecommerce-badge-secondary">
                                {item.quantity}
                            </span>
                        )}
                    </div>
                </div>
                
                <div className="ecommerce-card-content">
                    <h3 className="ecommerce-card-title">{item.name}</h3>
                
                <div className="flex gap-2 mb-3">
                    <span className={`ecommerce-badge ${item.stan ? 'ecommerce-badge-success' : 'ecommerce-badge-danger'}`}>
                        {item.stan ? 'Na stanie' : 'Wyjechało'}
                    </span>
                    <span className="ecommerce-badge ecommerce-badge-primary">
                        Qty: {item.ilosc}
                    </span>
                </div>
                
                    {item.description && (
                        <p className="ecommerce-card-description">{item.description}</p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mt-4">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121M12 12l2.879 2.879"></path>
                            </svg>
                            <div>
                                <div className="text-xs text-gray-500">Height</div>
                                <div className="font-medium">{item.wysokosc || '-'}&nbsp;cm</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121M12 12l2.879 2.879"></path>
                            </svg>
                            <div>
                                <div className="text-xs text-gray-500">Width</div>
                                <div className="font-medium">{item.szerokosc || '-'}&nbsp;cm</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121M12 12l2.879 2.879"></path>
                            </svg>
                            <div>
                                <div className="text-xs text-gray-500">Depth</div>
                                <div className="font-medium">{item.glebokosc || '-'}&nbsp;cm</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 col-span-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <div>
                                <div className="text-xs text-gray-500">Departure Date</div>
                                <div className="font-medium">{item.data_wyjazdu || '-'}</div>
                            </div>
                        </div>
                    </div>
                    
                    {item.linknadysk && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <a
                                href={item.linknadysk}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                </svg>
                                Google Drive Link
                            </a>
                        </div>
                    )}
                    
                    {item.updatedAt && (
                        <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Last Edited:</span>
                                <span className="text-gray-600">{new Date(item.updatedAt).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">By:</span>
                                <span className="text-gray-600">{item.updatedBy || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Device:</span>
                                <span className="text-gray-600">{item.deviceId || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Stand:</span>
                                <span className="text-gray-600">{item.stoisko || '-'}</span>
                            </div>
                        </div>
                    )}
                </div>
                
                {role && role === "admin" && (
                    <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                        <button
                            className="ecommerce-btn-secondary flex-1"
                            onClick={() => editItem(item)}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                            Edit
                        </button>
                        <button
                            className="ecommerce-btn-danger flex-1"
                            onClick={() => deleteItem(item.name)}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

function getCategoryColor(category) {
    switch (category) {
        case "Telewizory":
            return "ecommerce-badge-primary";
        case "Lodowki":
            return "ecommerce-badge-secondary";
        case "Ekspresy":
            return "ecommerce-badge ecommerce-badge-success";
        case "Krzesla":
            return "ecommerce-badge ecommerce-badge-warning";
        case "NM":
            return "ecommerce-badge ecommerce-badge-danger";
        default:
            return "ecommerce-badge ecommerce-badge-primary";
    }
}