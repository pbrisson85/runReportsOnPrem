const groupByOptions = {
  // Note that the key of this map matches the colType of the col

  invenFg: [
    { label: 'Item', dataName: 'item', default: true },
    { label: 'Species', dataName: 'species', default: false },
    { label: 'Brand', dataName: 'brand', default: false },
    { label: 'Size', dataName: 'size', default: false },
    { label: 'Soak', dataName: 'soak', default: false },
    { label: 'Location', dataName: 'location', default: false },
    { label: 'Country', dataName: 'country', default: false },
    { label: 'Freeze', dataName: 'fresh_frozen', default: false },
    { label: 'Lot Detail', dataName: 'ungrouped', default: false },
  ],

  salesOrder: [
    { label: 'Item', dataName: 'item_num', default: false },
    { label: 'Species', dataName: 'species', default: false },
    { label: 'Brand', dataName: 'brand', default: false },
    { label: 'Size', dataName: 'size_name', default: false },
    { label: 'Soak', dataName: 'fg_treatment', default: false },
    { label: 'Location', dataName: 'location', default: false },
    { label: 'Freeze', dataName: 'fg_fresh_frozen', default: false },
    { label: 'Week', dataName: 'week_serial', default: false },
    { label: 'Ship Date', dataName: 'formatted_ship_date', default: false },
    { label: 'Sales Order', dataName: 'so_num', default: false },
    { label: 'Customer', dataName: 'customer_code', default: true },
    { label: 'Order Line Item', dataName: 'ungrouped', default: false },
  ],

  salesInvoice: [
    { label: 'Item', dataName: 'item_number', default: false },
    { label: 'Species', dataName: 'species', default: false },
    { label: 'Brand', dataName: 'brand', default: false },
    { label: 'Size', dataName: 'size_name', default: false },
    { label: 'Soak', dataName: 'fg_treatment', default: false },
    { label: 'Location', dataName: 'location', default: false },
    { label: 'Freeze', dataName: 'fg_fresh_frozen', default: false },
    { label: 'Week', dataName: 'week_serial', default: false },
    { label: 'Ship Date', dataName: 'formatted_invoice_date', default: false },
    { label: 'Invoice', dataName: 'invoice_number', default: false },
    { label: 'Customer', dataName: 'customer_code', default: true },
    { label: 'Invoice Line Item', dataName: 'ungrouped', default: false },
  ],

  purchaseOrder: [
    { label: 'Item', dataName: 'item_number', default: false },
    { label: 'Species', dataName: 'species', default: false },
    { label: 'Brand', dataName: 'brand', default: false },
    { label: 'Size', dataName: 'size_name', default: false },
    { label: 'Soak', dataName: 'fg_treatment', default: false },
    { label: 'Location', dataName: 'location_code', default: false },
    { label: 'Freeze', dataName: 'fg_fresh_frozen', default: false },
    { label: 'Eta Date', dataName: 'eta_date', default: false },
    { label: 'PO', dataName: 'po_number', default: true },
    { label: 'Vendor', dataName: 'po_vendor', default: false },
    { label: 'PO Line Item', dataName: 'ungrouped', default: false },
  ],
}

module.exports = groupByOptions
