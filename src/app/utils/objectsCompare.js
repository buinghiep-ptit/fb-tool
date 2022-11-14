function shallowEqual(object1, object2) {
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false
    }
  }

  return true
}

// #
//turn them into text then compare their values
const k1 = { fruit: '🥝' }
const k2 = { fruit: '🥝' }

// Using JavaScript
JSON.stringify(k1) === JSON.stringify(k2) // true

// Using Lodash
_.isEqual(k1, k2) // true/*not the best solution but work for simple objects without methods

// #Deep Nested Comparison
const one = {
  fruit: '🥝',
  nutrients: {
    energy: '255kJ',
    minerals: {
      name: 'calcium',
    },
  },
}

const two = {
  fruit: '🥝',
  nutrients: {
    energy: '255kJ',
    minerals: {
      name: 'calcium',
    },
  },
}

// Using JavaScript
JSON.stringify(one) === JSON.stringify(two) // true

// Using Lodash
_.isEqual(one, two) // true

// # 3 Community suggestion
const x1 = { fruit: '🥝' }
const x2 = { fruit: '🥝' }

Object.entries(x1).toString() === Object.entries(x2).toString()

// https://www.samanthaming.com/tidbits/33-how-to-compare-2-objects/
