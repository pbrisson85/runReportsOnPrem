### To do.

- Below needs to be done but for functionality upgrades today:

1. able to right click the year trend for slice (cant now because no totals col - unless I replace the last trend col with a totals col)
2. able to run yoy trend with a start and end period
3. able to run single y0y with a trailing trend for each (trailing trend needs to be shown one at a time via double click.)
4. fix up the inventory module to have location filters
5. add sales person groups to sales report splits
6. make the daily production report
7. Need right click for bar and line graphs

- Need to set up the 'NO VALUE' then IS NULL in all slice WHERE clauses also need to make sure it is in the SELECT claiuse of all slice data. Also need it in the WHERE clause of all detail drilldowns.

- IS COALESCE, 'NO VALUE' being handled correctly in the kpi queries? wondering this while doing get weeks on hand.

- When right clicking for slice make sure the trend cannot show as sales order if in trend by year mode
- Since there is no total column in YTD trend there is no place to right click for a slice!!!

- On the front end when switching back from YTD trend to another trend then the max selections is not being enforced until the next click
- \*\*\* Make the columns work for inven and production.
- Make production have a filter for type and make work with YTD trend
- Sort is not defaulting on a slice
- Make YoY work in sales and production
- Make a purchasing report.
- On front end when in slice, if opening the main dropdown menu the filter row is in front of the menu.
- Would like to add a total row when slice is being filtered.
- There is no row slice yet for production reports
- In the production report the purchase receipts does not have the rows for it.

- FIRST: production report does not work with years trend uyet because I did not update the postgres queries
- I dont have sales projections table in the getRowLabels for base report sales
- Can I right click and get detail or slice on a 'NO VALUE' ?

- Need a process for credit
