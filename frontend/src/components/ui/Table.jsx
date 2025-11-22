import React, { useState, useMemo } from 'react';

/**
 * Table Component
 * @param {Array} data - Table data array
 * @param {Array} columns - Column definitions
 * @param {boolean} sortable - Enable sorting
 * @param {boolean} pagination - Enable pagination
 * @param {number} itemsPerPage - Items per page
 * @param {function} onRowClick - Row click handler
 * @param {function} renderActions - Custom actions renderer
 * @param {string} className - Additional CSS classes
 */
const Table = ({
  data = [],
  columns = [],
  sortable = true,
  pagination = false,
  itemsPerPage = 10,
  onRowClick,
  renderActions,
  className = '',
  emptyMessage = 'No data available',
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Handle sorting
  const handleSort = (key) => {
    if (!sortable) return;

    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [data, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, itemsPerPage, pagination]);

  // Calculate total pages
  const totalPages = pagination ? Math.ceil(sortedData.length / itemsPerPage) : 1;

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get sort icon
  const getSortIcon = (columnKey) => {
    if (!sortable || sortConfig.key !== columnKey) {
      return (
        <span className="sort-icon" aria-hidden="true">
          ↕
        </span>
      );
    }

    return sortConfig.direction === 'asc' ? (
      <span className="sort-icon sort-asc" aria-hidden="true">↑</span>
    ) : (
      <span className="sort-icon sort-desc" aria-hidden="true">↓</span>
    );
  };

  if (data.length === 0) {
    return (
      <div className={`table-container ${className}`}>
        <div className="table-empty">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={sortable && column.sortable !== false ? 'sortable' : ''}
                onClick={() => sortable && column.sortable !== false && handleSort(column.key)}
                style={{ width: column.width, textAlign: column.align || 'left' }}
              >
                <div className="th-content">
                  {column.label}
                  {sortable && column.sortable !== false && getSortIcon(column.key)}
                </div>
              </th>
            ))}
            {renderActions && <th className="actions-column">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr
              key={row.id || index}
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? 'clickable-row' : ''}
            >
              {columns.map((column) => (
                <td key={column.key} style={{ textAlign: column.align || 'left' }}>
                  {column.render
                    ? column.render(row[column.key], row, index)
                    : row[column.key] || '-'}
                </td>
              ))}
              {renderActions && (
                <td className="actions-cell">{renderActions(row, index)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && totalPages > 1 && (
        <div className="table-pagination">
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages} ({sortedData.length} items)
          </span>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;