const projectionOptions = () => {
  return [
    {
      label: 'Use Projection',
      dataName: 'useProjection',
      default: false,
      onTrueSetFalse: [],
      onFalseSetTrue: [],
    },
  ]
}

module.exports = projectionOptions
