import React from 'react';

export default function FilterBar({ filters, setFilters }) {
    return (
        <div className="flex gap-2 mb-4">
            <select
                className="select select-bordered"
                value={filters.status}
                onChange={e => setFilters({ ...filters, status: e.target.value })}
            >
                <option value="">All statuses</option>
                <option value="в наличии">В наличии</option>
                <option value="уехало">Уехало</option>
            </select>
            <select
                className="select select-bordered"
                value={filters.role}
                onChange={e => setFilters({ ...filters, role: e.target.value })}
            >
                <option value="">All roles</option>
                <option value="admin">Admin</option>
                <option value="spectator">Spectator</option>
            </select>
        </div>
    );
}
