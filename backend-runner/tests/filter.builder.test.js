const assert = require('assert');
const parseQuery = require('../src/filter.builder')

// run()

const resolvers = {
  test1(parent) {
		return { test1: !!parent.test1 }
	},
	'nested.a'() {
		return { 'nested.a': true }
	},
	'nested.b'(parent) {
		parent['nested.b'] = parent['nested.b'].n * parent['nested.b'].n
		return parent
	},
	'nested.date'(parent) {
		return { 'nested.date': new Date(parent['nested.date']) }
	},
	'nested.rename'(parent) {
		const newname = parent['nested.rename']
		delete parent['nested.rename']
		return { newname }
	}
}

const fieldNameToFieldId = {
	test1: '1',
	nested: '2',
	a: '3',
	logical: '4',
	b: '5',
	c: '6',
	date: '7',
	deep: '8',
	deepkey: '9',
	superdeep: '10',
	super: '11',
	newname: '12',
	arr: '13'
}

const args = {
	test1: 'something',
	logical: {
		or: [1, 2]
	},
	nested: {
		a: 'aaa',
		b: { n: 5 },
		c: 'normal',
		date: '2020',
		rename: 'my name',
		deep: {
			deepkey: 'hidden'
		},
		superdeep: {
			super: {
				deep: 'key'
			}
		}
	},
	gt: 5,
	arr: [1, 2, 3],
	or: [{ a: 5 }, { b: true }],
	and: [{ nested: { a: 'aaa' } }, { b: true }]
}

describe('functional', () => {
  const parser = parseQuery(resolvers)
  const filter = parser(args, fieldNameToFieldId)
  it('should equal the shape', () => {
    assert.deepEqual(filter, {
      '1': true,
      '4': { $or: [1, 2] },
      '2.3': true,
      '2.5': 25,
      '2.6': 'normal',
      '2.7': new Date('2020'),
      '2.8.9': 'hidden',
      '2.10.11.8': 'key',
      '12': 'my name',
      $gt: 5,
      '13': [1, 2, 3],
      $or: [{ '3': 5 }, { '5': true }],
      $and: [{ '2.3': true }, { '5': true }]
    })
  })
})