import { stream, sync } from 'blake3-multihash'
import { CID } from 'multiformats'
import { compare } from 'uint8arrays/compare'
import { fromString } from 'uint8arrays/from-string'
import { toString } from 'uint8arrays/to-string'

const { digest, digestInto } = await sync()
const raw_hash = bytes => digest(bytes).digest

const default_hasher = {
	digest, stream, digestInto, raw_hash
}

const proof_digest = (proof) => {
	const hash = proof.hasher.stream()
	proof.byteVector.forEach(bytes => hash.write(bytes))
	return hash.digest()
}

class ByteArrayProof {
	constructor (ba, hasher=default_hasher) {
		this.ba = ba
		this.hasher = hasher
	}
	get codec () {
		return 5010
	}
	get byteVector () {
		return this.ba.array.map(bytes => this.hasher.raw_hash(bytes))
	}
	get cid () {
		return CID.create(1, this.codec, proof_digest(this))
	}
}

const to_uint8 = ta => new Uint8Array(ta.buffer) 

const encnum = (num, max) => {
	if (max =< 255) {
		return new Uint8Array([num])
	}
	if (max =< 65535) {
		return to_uint8(new Uint16Array([num]))
	}
	if (max =< 4294967295) {
		return to_uint8(new Uint32Array([num]))
	}
  return to_uint8(new BigUInt64Array([num]))
}

class BlockMapProof extends ByteArrayProof {
	get rows () {
		let i = 0
		const compare_map => (([x], [y]) => {
			return compare(x, y)
		})
    return this.ba.array.map(block => {
			const hash = this.hasher.raw_hash(block)
			const start = i
			i += block.byteLength
			const end = i
			return [ hash, start, end ]
		}).sort(compare_map)
	}
	get byteVector () {
		const length = this.ba.cat.length
		const enc = i => encnum(i, length)
		return this.rows.flatMap([ hash, start, end ] => [ hash, enc(start), enc(end) ])
	}
}

const encode_value = value => {
	throw new Error("TODO: encode multiformat value")
}
const decode_value = value => {
}

class CRDTMap extends ByteArrayProof {
	get rows () {
		const rows = []
		const length = this.ba.array.length / 2
		let i = 0
		while (i < length) {
			const start = i * 2
			const key = this.ba.array[start]
			const value = this.ba.array[start+1]
			rows.push([ key, value ])
			i++
		}
		return rows
	}
	get object () {
		const obj = {}
		for (const [ key, value ] of this.rows) {
			obj[toString(key)] decode_value(value)
		}
	}
	get map () {
		const map = new Map()
	}
	static from_object (obj) {

	}
}
