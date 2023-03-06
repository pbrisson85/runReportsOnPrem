### Since the date query is expecting to query based on the first day of a fiscal year and the last day of a fiscal year being a sunday then this will not work for past years that don;t end/start with a full week. Something to keep in mind.

### Need to add all GL mapping to the inven supplemental

### Need to pull in the invoice alliocations table here for further reporting.

### Note that this detail table will be by invoice line therefore the invoice allocations must be a seperate table in postgres that I can join because it willhave multiple records per invoice line. The query is written for invoice allocations here but not used.
