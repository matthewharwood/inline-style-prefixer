/* @flow */

function isSimplePositionValue(value: any) {
  return typeof value === 'number' && !isNaN(value)
}

const alignmentValues = ['center', 'end', 'start', 'stretch']

const displayValues = {
  'inline-grid': ['-ms-inline-grid', 'inline-grid'],
  grid: ['-ms-grid', 'grid'],
}

const propertyConverters = {
  alignSelf: (value: any, style: Object) => {
    if (alignmentValues.indexOf(value) > -1) {
      style.msGridRowAlign = value
    }
  },

  gridColumn: (value: any, style: Object) => {
    if (isSimplePositionValue(value)) {
      style.msGridColumn = value
    } else {
      const [start, end] = value.split('/')
      propertyConverters.gridColumnStart(+start, style)

      const [maybeSpan, maybeNumber] = end.split(/ ?span /)
      if (maybeSpan === '') {
        propertyConverters.gridColumnEnd(+start + +maybeNumber, style)
      } else {
        propertyConverters.gridColumnEnd(+end, style)
      }
    }
  },

  gridColumnEnd: (value: any, style: Object) => {
    const { msGridColumn } = style
    if (isSimplePositionValue(value) && isSimplePositionValue(msGridColumn)) {
      style.msGridColumnSpan = value - msGridColumn
    }
  },

  gridColumnStart: (value: any, style: Object) => {
    if (isSimplePositionValue(value)) {
      style.msGridColumn = value
    }
  },

  gridRow: (value: any, style: Object) => {
    if (isSimplePositionValue(value)) {
      style.msGridRow = value
    } else {
      const [start, end] = value.split('/')
      propertyConverters.gridRowStart(+start, style)

      const [maybeSpan, maybeNumber] = end.split(/ ?span /)
      if (maybeSpan === '') {
        propertyConverters.gridRowEnd(+start + +maybeNumber, style)
      } else {
        propertyConverters.gridRowEnd(+end, style)
      }
    }
  },

  gridRowEnd: (value: any, style: Object) => {
    const { msGridRow } = style
    if (isSimplePositionValue(value) && isSimplePositionValue(msGridRow)) {
      style.msGridRowSpan = value - msGridRow
    }
  },

  gridRowStart: (value: any, style: Object) => {
    if (isSimplePositionValue(value)) {
      style.msGridRow = value
    }
  },

  gridTemplateColumns: (value: any, style: Object) => {
    style.msGridColumns = value
  },

  gridTemplateRows: (value: any, style: Object) => {
    style.msGridRows = value
  },

  justifySelf: (value: any, style: Object) => {
    if (alignmentValues.indexOf(value) > -1) {
      style.msGridColumnAlign = value
    }
  },
}

export default function grid(
  property: string,
  value: any,
  style: Object
): ?Array<string> {
  if (property === 'display' && value in displayValues) {
    return displayValues[value]
  }

  if (property in propertyConverters) {
    const propertyConverter = propertyConverters[property]
    propertyConverter(value, style)
  }
}
