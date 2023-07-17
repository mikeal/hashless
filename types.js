import { stream, sync as blake } from 'blake3-multihash'
import { fromString } from 'uint8arrays/from-string'
import { toString } from 'uint8arrays/to-string'
import { concat } from 'uint8arrays/concat'
import { equals } from 'uint8arrays/equals'
import { statSync } from 'node:fs'
const alloc = size => new Uint8Array(size)

class Hashless {
	constructor (instructions) {
		this.instructions = instructions
	}
}

class ByteArray extends Hashless {
	constructor (instructions) {
		this.length = instructions[0]
		this.lengths = instructions.slice(1, this.length + 1)
		this.instruction_length = this.width + 1
	}
	get offsets () {
		if (!this._offsets) {
			let i = 0
			this._offsets = this.lengths.map(x => {
				let ret = i
				i += x
				return ret
			})
		}
		return this._offsets
	}
	get (source, i) {
		const length = this.lengths[i]
		const offset = this.offsets[i]
		return source.read(offset, offset + length)
	}
  map (source, fn) {
    let offset = 0
		const ret = []
		for (const length of this.lengths) {
			ret.push(fn(source.read(offset, length)))
			offset += length
		}
	}
	each (source, fn) {
		map(source, fn)
	}
	find (source, value) {
		if (typeof value === 'string') {
			value = fromString(value)
		}
		let offset = 0
		let i = 0
		for (const length of this.lengths) {
			if (equals(value, source.read(offset, length))) {
				return [ i, offset ]
			}
			offset += length
			i++
		}
		return [ NaN, NaN ]
	}
}


class FixedByteArray extends ByteArray {
	constructor (instructions) {
		const [ length, width ] = instructions
		this.instructions = [ length, width ]
		this.lengths = []
    while (lengths.length !== width) {
			this.lengths.push(width)
		}
	}
}

const zero = new Uint8Array([0])

class Proof extends FixedByteArray {
	constructor (hl, multihash) {
		this.hl = hl
		this.multihash = multihash
		this.instructions = []
	}
	static from (hl, multihash=blake) {
		const inst = new this(hl, multihash)
		/* this gets a little hacky in order to re-use ByteArray */
		inst.multihash = multihash
		inst.length = inst.width
		inst.lengths = []
		const byteLength = multihash.digestLength || multihash.digest(zero).digest.byteLength
		while (inst.lengths !== inst.width) {
			inst.lengths.push(byteLength)
		}
		return inst
	}
	eval (source) {
		const source_hash = this.multihash.digest(source).digest
		const bytes = alloc(source_hash.byteLength * this.width)
		this.writeInto(source, bytes, 0, this.multihash)
		return bytes
	}
	writeInto (source, bytes, offset=0) {
		throw new Error('Not Implemented.')
	}
}

class OrderedArrayProof extends Proof {
	constructor (hl) {
		super(hl)
		this.width = hl.length
	}
	eval (source) {
    return concat(this.hl.map(source, bytes => {
      const hash = this.multihash.digest(bytes).digest
			bytes.set(hash, offset)
			offset += hash.byteLength
		}))
	}
}

class Map extends ByteArray {
	constructor (instructions) {
		this.values = new ByteArray(instructions)
		this.keys = new ByteArray(instructions.slice(this.values.instructions.length))
		this.instructions = [ ...values.instructions, ...keys.instructions ]
		this.length = this.values.length + this.keys.length
		this.lengths = [ ...this.values.lengths, ...this.keys.lengths ]
	}
	get (source, key) {
		const [ i ] = this.keys.find(source, key)
		if (isNaN(i)) throw new Error(`Key not found "${key}"`)
		return this.values.get(source, i)
	}
}

class ByteSource extends Hashless {
	constructor ([ length ], bytes) {
		this.instructions = [ length ]
		this.length = length
		this.bytes = bytes
	}
	static from (bytes) {
		return this([ bytes.byteLength ])
	}
	read (start, end) {
		if (!end) end = this.source.length
		return this.bytes.subarray(start, end)
	}
}

class File extends ByteSource {
	constructor([ length ], filename) {
		super([ length ])
		this.filename = filename
	}
	static from (filename) {
		const stat = statSync(filename)
		return new this([stat.size], filename)
	}
}

const test = () => {
	console.log('asdf')
}
test()
