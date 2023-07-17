# hashless

Hashless is a data layer of pure cryptography of The Web.

* It is "of The Web" as it does not create or define any new
  data persistence or transport protocols, any data over any
	transport is acceptable input and can be addressed "in place"
	where it already resides (probably a file available over HTTP).
* It is called "pure cryptography" because all data is encoded
  as proof instructions and resulting proofs.
* It is call "hashless" because the instructions and proofs
  are hash function agnostic and hashes are never encoded
	***into*** the data, instructions and proofs are encoded
	apart (cryptographically speaking).
* Since source data is separate from these encodings, and these
  encodings are quite small, hashless can produce mutated data
	structions, diffs, and all sorts of derivative cryptography
	that fits inside a packet you could consumer in content
	discovery is you're a decentralized network, or just pass
	around as a highly efficient diff if you're a webapp, cli,
	or server.

Hashless proofs all operate under certain restrictions in order
build a highly compatible system.

1. The only thing a proof is allowed to contain are hash digests
   of a consistent fixed length.
2. The hash function and digest size is determined by the `multihash`
   used in the CID.
	 * This means every proof result is a block, and the size of the block
	   and its CID tells you the `width` of the proof.
3. Given the `instructions` and the `multihash`, the `width`
   of the resulting proof can be determined **without any
	 source data or proof result**. This means instructions
	 can be used as a means to allocate space for the result
	 of a proof before passing any source to the proof function.

