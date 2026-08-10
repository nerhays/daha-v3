import { ContentTable as ContentTableType } from "@/types/content";

interface ContentTableProps {
  table: ContentTableType;
}

export default function ContentTable({ table }: ContentTableProps) {
  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left">
          <thead>
            <tr className="bg-slate-100">
              {table.headers.map((header, index) => (
                <th key={index} className="border-b border-slate-200 px-5 py-4 text-sm font-semibold text-slate-900">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-slate-100 last:border-b-0">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-5 py-4 align-top text-sm leading-6 text-slate-600">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
