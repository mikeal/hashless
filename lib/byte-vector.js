import { stream, sync } from 'blake3-multihash'
import { CID } from 'multiformats'
import { compare } from 'uint8arrays/compare'
import { fromString } from 'uint8arrays/from-string'
import { toString } from 'uint8arrays/to-string'

const { digest, digestInto } = await sync()
const raw_hash = bytes => digest(bytes).digest

const default_hasher = {
	digest, stream, digestInto, raw_hash,
	hash_vector: vector => {
		const hash = stream()
		vector.forEach(bytes => hash.write(bytes))
		return vector.digest().digest
	},
	cat_hash: array => hash_vector(CatProof.cat_vector(array))
}

class ByteVector {
	constructor (array, hasher=default_hasher) {
		this.array = array
		this.hasher = hasher
	}
	get proof () {
		return new ByteVectorProof(this)
	}
	get cat () {
		return new CatProof(this)
	}
}

class Proof {
	constructor (bv) {
		this.bv = bv
	}
	get cid {
		const hash = this.bv.hasher.stream()
		this.commit_vector.forEach(bytes => hash.write(bytes))
		return CID.create(1, this.codec, hash.digest())
	}
	get cat () {
		return new CatProof(this.bv.array)
	}
}

class CatProof extends Proof {
	constructor (bv) {
		this.array = CatProof.cat_vector(bv.array)
	}
	get commit_vector () {
		return this.array
	}
	get codec () {
    return 0x55
	}
	static cat_vector (source) {
		if (source.array) return source.array.flatMap(source.array)
		return source
	}
}

class FlatHashListProof extends Proof {
  get commit_vector () {
		const { raw_hash, cat_hash } = this.bv.hasher
		return this.bv.array.map(source => {
			return source.byteLength ? raw_hash(source) : cat_hash(source.array)
		})
	}
}

class ArrayProof extends FlatHashListProof {
	constructor (bv) {
		this.lengths = bv.array.map(source => {
			return source.cat ? source.cat.length : source.byteLength
		})
		this.array = [
		  encode(this.codec),
			encode(this.lengths.length),
			...encode_vector(this.lengths)
		]
		this.bv = bv
	}
}

class FlatBlockMapProof extends Proof {
	constructor (bv) {
		let i = 0
		let length = 0
		this.array = bv.array.forEach(
	}
	get commit_vector () {
		const { raw_hash, cat_hash } = this.bv.hasher
		let i = 0
		return this.bv
	}
}
class RecursiveBlockMapProof extends Proof {
}

