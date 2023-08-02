#### Goals:

- I put % of maj species into each main report but not any drilldowns.

- Make average weekly sales column
- Make weeks inventory col.
- Make col for each type of projection (using ave weekly sales, using a certain years sales, using a growth or shrink percentage, apply a % downside and % upside)
- Add trends for customer by category
  - On generate sales need to look up the delivery location. If no delivery location then use the customer master. If the location is foreign then classify as foreign sale. If the location is not foreign then classify using the customer type in the customer master. Fix the customer master classifications and have them maintained by AR dept.
- In the main program report. Add a report format that includes a third level of fresh/frozen
- Drilldowns for PY columns
- Group customer view by cust type ()
- Add inventory by country columns
- When clicking into trend clear the cache of the non trend data.
- when clicking out of the trend. clear the cache of the trend data.
- when clicking out of the detail window. clear the detail cache.
- Default on load to date range stopping at the current week so dont need to set.
- Add get detail to all the level two drilldowns.

### TO DO

- Add non FG sales so report can be tied into seasoft
- MAKE SALES TREND VIEWABLE BY CALENDAR MONTH, FISCAL PERIOD, CALENDAR QUARTER, CALENDAR YEAR, FISCAL YEAR

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
  - PO column in item drilldown is correct on the total but missing data on the rows - I cant recreate this. I dont see the problem anymore
  - When the scrollbar is all the way to the top and you scroll sideways the rows jump up and down - seems to happen when scroll gets stuck vertically
  - If name of vendor is changed then the trend by cust is not grouping correctly. Algo overwrites when name is changed.
  - scroll jumps when double clicking the heading to change trend data - Not bad after retesting.
  - In transit and on hand inventory item drilldown get detail not getting the correct data it is getting all inventory - cant recreate. I think I already fixed

- Data Errors:
  - Scal Domestic -> Fresh -> Light -> Chunk
  - Scal Domestic -> Frozen -> Processed -> Pieces

// Add cache to onPremBridge (second step is to run each possible report but shouldnt do this until all the logic is on the cloud. Also would not need the bridge if the logic was on the cloud. onPrem should just be the data base builder but write to the cloud database.)
