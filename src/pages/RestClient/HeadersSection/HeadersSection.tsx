import './HeadersSection.scss';
import { Button, Datalist, Input } from '@/components';
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
    const isBtnDisabled = requestHeaders.length === 1 || requestHeaders.at(-1)?.id === id;

    return (
      <tr key={`table-row-${id}`} className="tr">
        <td className="td">
          <Datalist
            id={`key-${id}`}
            value={name}
            data={HEADERS_COLLECTION}
            listName={`options-${id}`}
            placeholder="Key"
            onChange={(e) => updateRequestHeader({ id, name: e.target.value })}
            spaceForErrorMessage={false}
            border={false}
          />
        </td>
        <td className="td">
          <Input
            id={`value-${id}`}
            placeholder="Value"
            onChange={(e) => updateRequestHeader({ id, value: e.target.value })}
            spaceForErrorMessage={false}
            border={false}
            value={value}
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
