// components/RecycleBin/RecycleBin.js
import React, { useState } from 'react';
import { trashItems } from '../../data/trash';
import './RecycleBin.css';

export default function RecycleBin() {
  const [selectedId, setSelectedId] = useState(trashItems[0]?.id ?? null);
  const [message, setMessage] = useState('');
  const item = trashItems.find((t) => t.id === selectedId);

  const select = (id) => {
    setSelectedId(id);
    setMessage('');
  };

  return (
    <div className="trash">
      <div className="trash-scroll">
        <table className="trash-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col" className="trash-hide-sm">Original location</th>
              <th scope="col">Size</th>
            </tr>
          </thead>
          <tbody>
            {trashItems.map((t) => (
              <tr key={t.id} className={t.id === selectedId ? 'selected' : ''}>
                <td>
                  <button
                    className="trash-name"
                    onClick={() => select(t.id)}
                    aria-pressed={t.id === selectedId}
                  >
                    <span aria-hidden="true">{t.icon} </span>{t.name}
                  </button>
                </td>
                <td className="trash-hide-sm">{t.from}</td>
                <td>{t.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {item && (
        <div className="trash-detail">
          <p className="trash-detail-name">{item.name}</p>
          <p>{item.note}</p>
        </div>
      )}

      <div className="trash-actions">
        <button
          disabled={!item}
          onClick={() => setMessage(`Restoring ${item.name}… failed: folder is too embarrassing.`)}
        >
          Restore
        </button>
        <button onClick={() => setMessage('Nice try. The bin refilled itself.')}>
          Empty Recycle Bin
        </button>
        <span className="trash-count">{trashItems.length} items</span>
      </div>

      {message && <p className="trash-msg" role="status">{message}</p>}
    </div>
  );
}