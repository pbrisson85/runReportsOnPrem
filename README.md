### TO DO

- Add non FG sales so report can be tied into seasoft
- ADD MORE REPORTS AND KEEP WORJKING ON DEFAULTS
- MAKE SALES TREND VIEWABLE BY CALENDAR MONTH, FISCAL PERIOD, CALENDAR QUARTER, CALENDAR YEAR, FISCAL YEAR
- MAKE ALL DRILL DOWNS

- FrzSoakSize - sort the size correctly
- FrzSoakSize - add detail routes

### Reports:

- FrzSoakSize: By Fresh/Frozen, Processed/Dry, Size
- SpecSoakSize: By Species, Processed/Dry, Size

### GL Work

- Tie out OTHP to GL by period (eventually by week). create entry to correct
- Tie out the Sales/Cogs to GL by period (eventually by week). create entry to correct
- Tie out OTHP allocation to each species

TODO:

- add so, so_tagged, so_untagges to ALL build and drilldown routines. Only added to bySpeciesgroupProg build routine so far.
- On front end handle showing the weekly sales orders.
- Write the detail queries and handle on front end.

// WHERE I LEFT OFF: THE DRILLDOWN GET DETAIL BY ITEM FOR INVENTORY IS NOT WORKING FOR THE IN TRANSIT, OH ALL COLUMNS I THINK BECAUSE I DELETED THE WHERE CLAUSES. NEED TO FINISH THE REMAINDER OF THE DRILLDOWN COLS <-- Stopped working on this to hit the next one

// NEXT MOST IMPORTANT THING TO DO IS TO CREATE THE 7 YEAR TREND FOR ALL SALES REPORTS. <-- This is where I actually left off. Need to update all of the get rows function in the bySpeciesGroupProg report because I made the 7 year trend for all trends (main, by item, by customer) but the rows are being filtered for the user provided date range and there are possibly no rows for items that happened in prior years

    - Add 7 year trend for each of the three additional report formats.

// NEXT MOST IMPORTANT THING IS TO DO THE DRILLDOWN FOR THE CUSTOMER RPEORTS.
