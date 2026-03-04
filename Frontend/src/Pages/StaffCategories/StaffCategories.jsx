import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import styles from "./staffCategories.module.css";
import { StoreContext } from "../../context/StoreContext";

const StaffCategories = () => {
  const { URl, token } = useContext(StoreContext);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [renameState, setRenameState] = useState({});

  const sortedCategories = useMemo(() => {
    return [...(categories || [])].sort((a, b) => String(a?.name || "").localeCompare(String(b?.name || "")));
  }, [categories]);

  const loadCategories = async () => {
    const response = await axios.get(`${URl}/api/category/list`, { headers: { token } });
    if (response.data?.success) {
      setCategories(response.data.data || []);
      return;
    }
    throw new Error(response.data?.message || "Failed to load categories");
  };

  useEffect(() => {
    loadCategories().catch((err) => {
      const message = err?.response?.data?.message || err?.message || "Failed to load categories";
      alert(message);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    const trimmed = String(name || "").trim();
    if (!trimmed) return;

    try {
      const response = await axios.post(
        `${URl}/api/category/create`,
        { name: trimmed },
        { headers: { token } }
      );

      if (response.data?.success) {
        setName("");
        await loadCategories();
        return;
      }
      alert(response.data?.message || "Create failed");
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Create failed";
      alert(message);
    }
  };

  const onRename = async (id) => {
    const nextName = String(renameState[id] || "").trim();
    if (!nextName) return;

    try {
      const response = await axios.patch(
        `${URl}/api/category/${id}`,
        { name: nextName },
        { headers: { token } }
      );

      if (response.data?.success) {
        setRenameState((prev) => ({ ...prev, [id]: "" }));
        await loadCategories();
        return;
      }
      alert(response.data?.message || "Rename failed");
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Rename failed";
      alert(message);
    }
  };

  const onDelete = async (id) => {
    const ok = window.confirm("Delete this category? Items will be moved to Uncategorized.");
    if (!ok) return;

    try {
      const response = await axios.delete(`${URl}/api/category/${id}`, { headers: { token } });
      if (response.data?.success) {
        await loadCategories();
        return;
      }
      alert(response.data?.message || "Delete failed");
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Delete failed";
      alert(message);
    }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Categories</h2>

      <form className={styles.form} onSubmit={onCreate}>
        <div className={styles.row}>
          <label className={styles.label}>New Category</label>
          <div className={styles.inline}>
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Milktea Series"
              type="text"
            />
            <button className={styles.button} type="submit">Create</button>
          </div>
        </div>
      </form>

      <div className={styles.list}>
        {sortedCategories.map((cat) => {
          const isProtected = String(cat?.name || "").toLowerCase() === "uncategorized";
          return (
            <div key={cat._id} className={styles.card}>
              <div className={styles.cardLeft}>
                <div className={styles.catName}>{cat.name}</div>
                <div className={styles.catMeta}>{cat._id}</div>
              </div>

              <div className={styles.cardRight}>
                <input
                  className={styles.input}
                  value={renameState[cat._id] ?? ""}
                  onChange={(e) => setRenameState((prev) => ({ ...prev, [cat._id]: e.target.value }))}
                  placeholder={isProtected ? "Protected" : "New name"}
                  disabled={isProtected}
                />
                <button
                  className={styles.secondary}
                  type="button"
                  onClick={() => onRename(cat._id)}
                  disabled={isProtected}
                >
                  Rename
                </button>
                <button
                  className={styles.danger}
                  type="button"
                  onClick={() => onDelete(cat._id)}
                  disabled={isProtected}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StaffCategories;
