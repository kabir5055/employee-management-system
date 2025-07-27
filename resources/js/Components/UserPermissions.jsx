import React, { useState, useEffect } from 'react';

const UserPermissions = ({ user, allPermissions, userPermissions, onSave }) => {
  const [selected, setSelected] = useState(userPermissions || []);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    setSelectAll(selected.length === allPermissions.length);
  }, [selected, allPermissions]);

  const handleCheckbox = (perm) => {
    setSelected((prev) =>
      prev.includes(perm)
        ? prev.filter((p) => p !== perm)
        : [...prev, perm]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(allPermissions.map((p) => p.name));
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(selected);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Manage Permissions for {user.name}</h2>
      <label>
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAll}
        />
        Select All Permissions
      </label>
      <hr />
      {allPermissions.map((perm) => (
        <div key={perm.name}>
          <label>
            <input
              type="checkbox"
              checked={selected.includes(perm.name)}
              onChange={() => handleCheckbox(perm.name)}
            />
            {perm.name}
          </label>
        </div>
      ))}
      <button type="submit">Save</button>
    </form>
  );
};

export default UserPermissions;
