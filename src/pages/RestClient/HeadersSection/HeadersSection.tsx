import './HeadersSection.scss';
import { Button } from '@/components';
import { ButtonStyle } from '@/components/Button/types.ts';
import IconTrash from '@/assets/icons/trash.svg?react';
import {
  type RestClientHeader,
  restClientPageStore,
} from '@/stores/restClientPageStore/restClientPageStore.ts';

const HEADERS_COLLECTION = [
  'Content-Type',
  'Authorization',
  'Cache-Control',
  'Connection',
  'Cookie',
];
const tableHeaders = ['Key', 'Value', ''];

export default function HeadersSection() {
  const { requestHeaders, updateRequestHeader, removeRequestHeader } = restClientPageStore();

  function getTableRow(params: RestClientHeader) {
    const { id, name, value } = params;
    const datalistOptions = HEADERS_COLLECTION.map((h) => <option key={`${id}-${h}`}>{h}</option>);
    const isBtnDisabled = requestHeaders.length === 1 || requestHeaders.at(-1)?.id === id;

    return (
      <tr key={`table-row-${id}`} className="tr">
        <td className="td">
          <label htmlFor={`key-${id}`}></label>
          <input
            className="table-input"
            id={`key-${id}`}
            list={`options-${id}`}
            defaultValue={name}
            placeholder="Key"
            onChange={(e) => updateRequestHeader({ id, name: e.target.value })}
          />
          <datalist id={`options-${id}`}>{datalistOptions}</datalist>
        </td>
        <td className="td">
          <label htmlFor={`value-${id}`}></label>
          <input
            id={`value-${id}`}
            className="table-input"
            defaultValue={value}
            placeholder="Value"
            onChange={(e) => updateRequestHeader({ id, value: e.target.value })}
          />
        </td>
        <td className="td">
          <Button
            style={ButtonStyle.IconBtn}
            onClick={() => removeRequestHeader({ id })}
            isDisabled={isBtnDisabled}
          >
            <IconTrash />
          </Button>
        </td>
      </tr>
    );
  }

  return (
    <div className="headers-container">
      <p className="title">Headers:</p>
      <div className="content-container">
        <table className="table">
          <thead className="thead">
            <tr className="tr">
              {tableHeaders.map((header, index) => (
                <td key={`${header}-${index}`} className={`td ${header.toLowerCase()}`}>
                  {header}
                </td>
              ))}
            </tr>
          </thead>
          <tbody className="tbody">{requestHeaders.map((r) => getTableRow(r))}</tbody>
        </table>
      </div>
    </div>
  );
}
