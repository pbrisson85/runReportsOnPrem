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

// WHERE I LEFT OFF: Continue to make the FY trend optional. Need rows with or without. Front end will pass a boolean. Fron end will ask for update when option selected or deselected

// Add cache to onPremBridge (second step is to run each possible report but shouldnt do this until all the logic is on the cloud. Also would not need the bridge if the logic was on the cloud. onPrem should just be the data base builder but write to the cloud database.)

// Make sure drill down by item get detail works (this is shared by all reports because it is by item code.)

//
