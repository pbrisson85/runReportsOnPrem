// item types are pulled from db but defaults are manually added here.

const getItemTypeDefaults = () => {
  const defaults = ['FG', 'SECONDS', 'WO_ACTIVITY', 'WIP', 'RM']

  return defaults
}

module.exports = getItemTypeDefaults
