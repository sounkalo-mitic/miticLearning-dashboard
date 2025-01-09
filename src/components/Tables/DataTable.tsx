import Link from 'next/link';
import { useState } from 'react';
import DataTable, { TableProps } from 'react-data-table-component';

// Définir les types des props avec une contrainte
type DataTableComponentProps<T extends { [key: string]: any }> = {
  title: string;
  columns: TableProps<T>['columns'];
  data: T[];
  pagination?: boolean;
  highlightOnHover?: boolean;
  customStyles?: TableProps<T>['customStyles'];
  addButtonText?: string;
  onAddButtonLink?: string;
};

const DataTableComponent = <T extends { [key: string]: any }>({
  title,
  columns,
  data,
  pagination = true,
  highlightOnHover = true,
  customStyles,
  addButtonText,
  onAddButtonLink,
}: DataTableComponentProps<T>) => {
  const [filterText, setFilterText] = useState('');
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:border-gray-700 dark:bg-boxdark dark:text-white"
        />
        {
          addButtonText && (<Link href={onAddButtonLink ? onAddButtonLink : ""}>
            <button
              className="px-4 py-2 bg-[#29015D] text-white rounded-md hover:bg-primary-dark"
            >
              {addButtonText}
            </button>
          </Link>)
        }
      </div>

      <DataTable
        title={title}
        columns={columns}
        data={filteredData}
        pagination={pagination}
        highlightOnHover={highlightOnHover}
        customStyles={{
          headCells: {
            style: {
              backgroundColor: '#f3f4f6',
              color: '#111827',
            },
          },
          ...customStyles,
        }}
      />
    </div>
  );
};

export default DataTableComponent;
