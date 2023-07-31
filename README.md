#### Goals for today:

- Pull trend as of YTD (keep pulling full year though) < -- Only finished bySpeciesgroupProg. Need remaining four program reports
- Option on front end to see trend full year, trend YTD, current year trend (can view one, more than one, or all at same time.)
- Drilldowns for PY columns
- Group customer view by cust type ()

### TO DO

- Add non FG sales so report can be tied into seasoft
- MAKE SALES TREND VIEWABLE BY CALENDAR MONTH, FISCAL PERIOD, CALENDAR QUARTER, CALENDAR YEAR, FISCAL YEAR

- FrzSoakSize - sort the size correctly
- FrzSoakSize - add detail routes

### Reports:

- FrzSoakSize: By Fresh/Frozen, Processed/Dry, Size
- SpecSoakSize: By Species, Processed/Dry, Size

### GL Work

- Tie out OTHP to GL by period (eventually by week). create entry to correct
- Tie out the Sales/Cogs to GL by period (eventually by week). create entry to correct
- Tie out OTHP allocation to each species

On Front End:

- Improvements:

  - View customer trends by market segment (wholesale, retail, food service, international)
  - View customer trends by geographic location (Northeast, Southeast, Midwest, West Coast, Canada, Europe, Asia, South America, Middle East, Africa, etc, etc. )
  - View inventory by country
  - View all/any data as a graph on right click
  - Add report: freeze/brand/size
  - Add drilldown trend while in drilldown (if drilling into customer allow additional drilldown by item and vice versa)
  - Add get details and get drilldown to the 7 year trend
  - Add column for % of total, make option to change % of total to total company, total program, total species group, total of the current screen
  - Add column for weeks inventory on hand

  - When drilling down, save the previous data and cols in an atom. When hitting back, set the previos data and cols and make the saved version null. ALSO when drilling down, save the scroll settings, when hitting back set the saved scroll settings.

- Bugs:

  - When in a trend, the filter row is not accurate.
  - When in customer or item trend, after hitting back button the spinner is not appearing and the column change looks like junk.
  - When double clicking in a drilldown it sorts and I dont like that
  - Cant sort in both directions in a drilldown pane
  - PO column in item drilldown is correct on the total but missing data on the rows **\*\***\*\***\*\***
  - When the scrollbar is all the way to the top and you scroll sideways the rows jump up and down
  - If name of vendor is changed then the trend by cust is not grouping correctly. Algo overwrites when name is changed.
  - scroll jumps when double clicking the heading to change trend data
  - In transit and on hand inventory item drilldown get detail not getting the correct data it is getting all inventory priority!!!!!!!!

- Testing:

  - Need to test prior years
  - What happens if I change the report format or year or date range when in a drilldown
  - All drilldowns and data detail in prior years.

- Data Errors:
  - Scal Domestic -> Fresh -> Light -> Chunk
  - Scal Domestic -> Frozen -> Processed -> Pieces

// Add cache to onPremBridge (second step is to run each possible report but shouldnt do this until all the logic is on the cloud. Also would not need the bridge if the logic was on the cloud. onPrem should just be the data base builder but write to the cloud database.)
