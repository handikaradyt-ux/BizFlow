export const Table = ({ children, className = '' }) => (
    <div className={`w-full overflow-x-auto ${className}`}>
        <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
            {children}
        </table>
    </div>
);

export const TableHeader = ({ children, className = '' }) => (
    <thead className={`text-xs text-gray-700 uppercase bg-gray-50 border-y border-gray-200 ${className}`}>
        {children}
    </thead>
);

export const TableRow = ({ children, className = '' }) => (
    <tr className={`bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors ${className}`}>
        {children}
    </tr>
);

export const TableHead = ({ children, className = '' }) => (
    <th className={`px-6 py-3.5 font-semibold ${className}`}>
        {children}
    </th>
);

export const TableCell = ({ children, className = '' }) => (
    <td className={`px-6 py-4 ${className}`}>
        {children}
    </td>
);
