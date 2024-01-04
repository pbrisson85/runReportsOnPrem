### To do.

- Get rows in base and slice should include the sales projections tables as well in addition to the existing sales and sales orders in the query
- Need to be able to identify if there are any sales specific filters to know whether to exclude inventory items from rows in a slice (see l1_getRowLabels in slice: getRowLabels for the helper I created but is inadequate because needs a config to maintain this concept.)

- FIX everywhere i have the word dummy to not have a FROM clause.
- Add the sales filters to the PO col in a slice.

- PRIORITY:
- when slicing a row (calendar year), the time periods get fugged. The query is correct but the trend defaults to current year ytd and the total defaults to fiscal ytd? Also the colDataHelper.js functions use the primary start and end dates from config instead of the query dates sent with the slice. Same must be true for the queries for sales by period. Best solution is probably to get the slice query to use the actual config correctly.
