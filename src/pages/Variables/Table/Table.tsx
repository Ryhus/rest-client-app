import { useTranslation } from 'react-i18next';

interface variablesTableProps<T> {
  headers: string[];
  showHeaders: boolean;
  rows: T[];
  inputRow?: boolean;
  renderInputRow?: () => React.ReactElement;
  translation: string;
  getTableRow: (row: T) => React.ReactElement;
  customClass: string;
  title?: string;
}

export default function Table<T>({
  headers,
  showHeaders,
  rows,
  inputRow,
  renderInputRow,
  translation,
  getTableRow,
  customClass,
  title,
}: variablesTableProps<T>) {
  const { t } = useTranslation(translation);
  return (
    <div className={customClass}>
      {title && <p className={showHeaders ? 'title' : 'hide'}>{t(title)}:</p>}
      <div className="content-container">
        <table className="table">
          <thead className={showHeaders ? 'thead' : 'hide'}>
            <tr className="tr">
              {headers.map((header, index) => (
                <td key={`${header}-${index}`} className={`td ${header}`}>
                  {header && t(header)}
                </td>
              ))}
            </tr>
          </thead>
          <tbody className="tbody">
            {rows.map((r) => getTableRow(r))}
            {inputRow && renderInputRow?.()}
          </tbody>
        </table>
      </div>
    </div>
  );
}
