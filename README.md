### Since the date query is expecting to query based on the first day of a fiscal year and the last day of a fiscal year being a sunday then this will not work for past years that don;t end/start with a full week. Something to keep in mind.

### Need to add all GL mapping to the inven supplemental

### Need to pull in the invoice alliocations table here for further reporting.

### Note that this detail table will be by invoice line therefore the invoice allocations must be a seperate table in postgres that I can join because it willhave multiple records per invoice line. The query is written for invoice allocations here but not used.

#### Note that there is no cron right now to update the sales data. It is a manual route

## generatePerpetualOnPrem TODO's **\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***

### For on order. Need to pull the container per the PO line item rather than the header. This pulls from the header but the logistics team does not fill that data in reliably whereas they do fill in the containers on the line items

### The tagged orders will not show the sales order # or customer. This is because the committed/tagged is taken from the inventory location file which is by lot/locationa and does not have the customer or sales order on it. As a matter of fact their could be multiple customers/sales orders per lot or only allocatted to a lot partially.

### Therefore I would like to instead of taking the inventory data from the inventory location file. Get the committed/tagged from the sales order lines table. and have multiple lines per lot/location if necessary.

### This app has a tests directory but these should really be in a seperate app that is just for running tests.

### TO DO

- Add non FG sales so report can be tied into seasoft
- Rename all functions in two level report
- add columns in both two level and three level reports for SO tagged, SO untagged, Inven On Hand Committed to SO, Inven On Hand Committed to BT, Inven On Hand Not Commmitted
- Will need to add ability on the front end to add/remove/collapse/expand columns
- need to add data for three level report to columns: FG PO, RM Inven, RM PO

### Acronyms:

- FFPD: By Fresh/Frozen, Processed/Dry
- FFPDS: By Fresh/Frozen, Processed/Dry, Size
