import { encode, decode, parse, parse_vector } from 'varint-vectors'
import { CID } from 'multiformats/cid'
import { digest, stream } from 'blake3-multihash'
import { Proofs } from './proofs.js'

class ByteArrayCodec {
	constructor (ba) {
		this.ba = ba
	}
	get cid {
		const hash = stream()
		this.byteVector.forEach(bytes => hash.write(bytes))
		return CID.create(1, this.codec, hash.digest())
	}
	get cat () {
		return new ByteArrayCat(this.ba)
	}
}
class ByteArrayCat extends ByteArrayCodec {
	get codec () {
		return 0x55
	}
  get byteVector () {
		return this.ba.array
	}
	get length () {
		return this.ba.array.reduce((a, b) => a + b.byteLength }, 0)
	}
	static create (ba) {
		return new ByteArrayCat(ba)
	}
}
class SelfDescribingByteArray extends ByteArrayCodec {
	get description () {
		return [ encode(this.ba.array.length), ...this.ba.array.map(bytes => encode(bytes.byteLength)) ]
	}
}
class PrependedSelfDescribingByteArray extends SelfDescribingByteArray {
	get byteVector () {
	  return [ ...this.description, ...this.cat.byteVector ]	
	}
	get codec () {
		return 5001
	}
}
class ByteArrayAppendedDescription extends SelfDescribingByteArray {
	get byteVector () {
		const desc = this.description
		const descLength = desc.map(x => x.byteLength).reduce((x, y) => x + y)
		return [ ...this.cat.byteVector, ...desc, uint32(descLength) ]
	}
	static fromBytes (bytes) {
		throw new Error('here')
	}
	get codec () {
		return 5002
	}
}

class ByteArrayEncoder {
	constructor (ba) {
		this.ba = ba
	}
	get byteVector () {
		return this.ba.array
	}
	get cat () {
		return new ByteArrayCat(this.ba)
	}
}

class ByteArray {
	constructor (init=[]) {
		this.array = init
		this.proofs = new Proofs(this)
	}
	static create () {
		return new ByteArray()
	}
	static fromArray (init) {
		return new ByteArray(init)
	}
	append (bytes) {
		this.array.append(bytes)
	}
	get encoder () {
		return ByteArrayEncoder(this)
	}
  get cat () {
		return new ByteArrayCat(this.ba)
	}
}
