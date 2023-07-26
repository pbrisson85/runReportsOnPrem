## Conversion form drilldown to deep drilldown (same query but add filter for customer)

#### Level 0

- Inven - NO CHANGE
- PO - NO CHANGE
- Rows
  - Add: AND sales_line_items.customer_code = $ to the top select statement
  - Add: AND sales_orders.customer_code = $ to the bottom select statement
- Rows with FY trend
  - Add: AND sales_line_items.customer_code = $ to the top select statement
- Sales
  - Add sales_line_items.customer_code = $ to every query
- Sales by FY
  - Add sales_line_items.customer_code = $ to every query
- Sales orders
  - Add: AND sales_orders.customer_code = $ to every query
- Sales orders by week
  - Add: AND sales_orders.customer_code = $ to every query

#### Level 1

- Inven - NO CHANGE
- PO - NO CHANGE
- Rows
- Rows with FY trend
- Sales
- Sales by FY
- Sales orders
- Sales orders by week

#### Level 2

- Inven - NO CHANGE
- PO - NO CHANGE
- Rows
- Rows with FY trend
- Sales
- Sales by FY
- Sales orders
- Sales orders by week

#### Level 3

- Inven - NO CHANGE
- PO - NO CHANGE
- Rows
- Rows with FY trend
- Sales
- Sales by FY
- Sales orders
- Sales orders by week
