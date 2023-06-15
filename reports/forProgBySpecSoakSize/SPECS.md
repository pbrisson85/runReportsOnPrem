### Report: forProgSpecSoakSize

### Row Fields

- level 1: ms.species
- level 2: ms.fg_treatment
- level 3: ms.size_name

### FROM/JOIN

- "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number
