import React, { forwardRef, useMemo } from "react";
import styles from "./receipt.module.css";

const padRight = (str, len) => {
  const s = String(str ?? "");
  if (s.length >= len) return s.slice(0, len);
  return s + " ".repeat(len - s.length);
};

const padLeft = (str, len) => {
  const s = String(str ?? "");
  if (s.length >= len) return s.slice(0, len);
  return " ".repeat(len - s.length) + s;
};

const money = (n) => {
  const num = Number(n || 0);
  return num.toFixed(2);
};

const Receipt = forwardRef(function Receipt(
  {
    brand = "QuickBite",
    tagline = "ORDER RECEIPT",
    addressLines = [],
    host = "CASHIER",
    orderNumber = "0001",
    pickupTime = "",
    createdAt = new Date(),
    items = [],
    subtotal = 0,
    tax = 0,
    total = 0,
    footerLines = ["THANK YOU!"]
  },
  ref
) {
  const dateStr = useMemo(() => {
    try {
      return new Date(createdAt).toLocaleDateString();
    } catch {
      return "";
    }
  }, [createdAt]);

  const timeStr = useMemo(() => {
    try {
      return new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  }, [createdAt]);

  const lines = useMemo(() => {
    const width = 32;

    const header = [];
    header.push(padLeft(brand.toUpperCase(), width));
    header.push(padLeft(tagline.toUpperCase(), width));
    header.push("");

    (addressLines || []).filter(Boolean).forEach((l) => header.push(padLeft(String(l).toUpperCase(), width)));

    header.push("");
    header.push(padRight(`HOST: ${host}`, 18) + padLeft(dateStr, width - 18));
    header.push(padRight(`ORDER: ${orderNumber}`, 18) + padLeft(timeStr, width - 18));
    if (pickupTime) {
      header.push(padRight("PICKUP:", 18) + padLeft(String(pickupTime), width - 18));
    }

    const itemLines = [];
    const maxName = 22;
    items.forEach((it) => {
      const name = String(it.name || "").toUpperCase();
      const qty = Number(it.quantity || 0);
      const priceStr = money(it.lineTotal ?? (Number(it.price || 0) * qty));
      const left = qty > 1 ? `${name} x${qty}` : name;
      itemLines.push(padRight(left, maxName) + padLeft(`₱${priceStr}`, width - maxName));
    });

    const totals = [];
    totals.push("");
    totals.push(padRight("SUBTOTAL:", 20) + padLeft(`₱${money(subtotal)}`, width - 20));
    totals.push(padRight("TOTAL:", 20) + padLeft(`₱${money(total)}`, width - 20));

    const footer = [];
    footer.push("");
    footerLines.filter(Boolean).forEach((l) => footer.push(padLeft(String(l).toUpperCase(), width)));

    return { header, itemLines, totals, footer };
  }, [addressLines, brand, createdAt, footerLines, host, items, orderNumber, pickupTime, subtotal, tagline, tax, total, dateStr, timeStr]);

  return (
    <div className={styles.paper} ref={ref}>
      <div className={styles.block}>
        {lines.header.map((l, idx) => (
          <div key={`h-${idx}`} className={styles.line}>
            {l}
          </div>
        ))}
      </div>

      <div className={styles.rule} />

      <div className={styles.block}>
        {lines.itemLines.map((l, idx) => (
          <div key={`i-${idx}`} className={styles.line}>
            {l}
          </div>
        ))}
      </div>

      <div className={styles.rule} />

      <div className={styles.block}>
        {lines.totals.map((l, idx) => (
          <div key={`t-${idx}`} className={styles.line}>
            {l}
          </div>
        ))}
      </div>

      <div className={styles.block}>
        {lines.footer.map((l, idx) => (
          <div key={`f-${idx}`} className={styles.line}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
});

export default Receipt;
