#### Goals:

- Priorities:

  ### When drilling by customer on fresh scallops total, the totals line is fugged (not sticky)

  ### After testing I dont like that trend drilldowns show all inventory for the category. I would like it to just show the items related to the customer. Therefore the queries for inventory and PO should have a if customer where item is in distinct pull all items for customer.

  ### Next step. put the level in the row data so that it can be passed back instead of parsing the labels. Do the same with anything else I am parsing. ONCE everything is done cleaning up then add the reports for by sales person and by customer vertical

  ### When drilling down on item trend I fixed the inventory col by getting rows for all inven items however this is wrong when drilling by item from the customer screen. This is because it shows rows for all items in that base report grouping, items that dont have anything to do with the customers sales or sales orders. The fix I think is either to not include the PO or inventory items BUT better choice would probably be to: if customer filter exists only select the inventory items that are in the customer sales items. On second thought maybe this is a good way to show it because you can see substitute items. OR maybe have it as an option. For simplicity i would say just keep it this way unless it seems to get in the way.

  ### Data error: there are scallop FG items that have a blank fresh/frozen field

  ### Get rows (especially in item tredn as that is where i was looking when realizing this) will need to add a union query to the open PO table if it is moved (as planned) from the perpetual inventory table

  ### On the front end their is a data object (config of sorts) that holds all of the columns that shuld not be shown while in customer drilldown mode (because they are inventory related). First off, this config data should live on the back end in a consilidated config file. Secondly, these should be filtered out of the optional columns filter option because they cannot be shown therefore they are not optional in that view.

  ### Should have a col for ave sales/week YTD (have this), last four weeks, last eight weeks, last 12 weeks type thing

  #### look into calcing the % species group in baseReport because it was being done in the two level report but a different way. I left the file for reference.

  - In freeze/Brand/Size customer drilldown on fresh subtotal. Then item drilldown on MADI00. The FG inven is on the total but not on the lines.
  - Sales order detail net sales price is wrong on the walmart case items.

  - Metrics:

    - 4 Wk Ave Sales, 8 Week Ave Sales, 12 Week Ave Sales, 4 Week Ave So
    - Weeks on hand using Inven + PO/ave sales (better of past 8 weeks ave or next 4 weeks ave.)

  - Make report:

    - Species (subtotal)/Cut (subtotal)/Brand (subtotal)/Soak (subtotal)/Item /Description/ Size
      - Once made will be a template for a four level report.

  - Drilldown for skinless vs skin on

  - Filter non domestic by species
  - Charts
  - If no sales put "ns" in the weeks inventory col instead of zero
  - Add a notes field
  - Add a way to create projections. And have projection to actual.
  - Add Customer by category
  - Add Item drilldowns for skinless vs skin on. for fresh vs frozen. for brand. for cut.

- In the calcWeeksInvOnHand why am i passing in the freaking number of cols? Why not just assume there are 5 or 10 and let the undefined be undefined. Will calling the function easier, Will make the function code WAY cleaner.

- Customer drilldown from item does not have the weekly sales yet. Also need to add weekly sales and weeks inventory on all reports other than the "all" program report

- I put % of maj species into each main report but not any drilldowns.

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

// Add cache to onPremBridge (second step is to run each possible report but shouldnt do this until all the logic is on the cloud. Also would not need the bridge if the logic was on the cloud. onPrem should just be the data base builder but write to the cloud database.)
