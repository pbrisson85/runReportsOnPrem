const sortRowTemplate = rows => {
  rows
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l5_label?.includes('TOTAL')) return 1
      if (b.l5_label?.includes('TOTAL')) return -1

      if (a.l5_label < b.l5_label) return -1
      if (a.l5_label > b.l5_label) return 1
      return 0
    })
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l4_label?.includes('TOTAL')) return 1
      if (b.l4_label?.includes('TOTAL')) return -1

      if (a.l4_label < b.l4_label) return -1
      if (a.l4_label > b.l4_label) return 1
      return 0
    })
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l3_label?.includes('TOTAL')) return 1
      if (b.l3_label?.includes('TOTAL')) return -1

      if (a.l3_label < b.l3_label) return -1
      if (a.l3_label > b.l3_label) return 1
      return 0
    })
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l2_label?.includes('TOTAL')) return 1
      if (b.l2_label?.includes('TOTAL')) return -1

      if (a.l2_label < b.l2_label) return -1
      if (a.l2_label > b.l2_label) return 1
      return 0
    })
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l1_label?.includes('TOTAL')) return 1
      if (b.l1_label?.includes('TOTAL')) return -1

      if (a.l1_label < b.l1_label) return -1
      if (a.l1_label > b.l1_label) return 1
      return 0
    })

  return rows
}

module.exports = sortRowTemplate
