# hashless

Hashless is a data layer of pure cryptography of The Web.

* It is characterized as being "of The Web" as it does not create or define any new
  data persistence or transport protocols, any data over any
	transport is acceptable input and can be addressed "in place"
	where it already resides (probably a file available over HTTP).
* It is called "pure cryptography" because all data is encoded
  as proof instructions and resulting proofs.
* It is called "hashless" because the instructions and proofs
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

# Data on The Web

Data exists today all over The Web. Most of that data is available
over HTTP, but if you grow your defintion of "The Web" to include
anything you can address with a URL, you've also got FTP, Bittorrent/Webtorrent,
IPFS, even git.

All of that data works with `hashless`, and the operations, mutations,
diff, and other cool stuff you can do with `hashless` exist in a layer
of pure cryptography that don't **depend on** any of the aforementioned
transport layers (HTTP, FTP, etc). The "centralization" of any of these
protocols is moot because reliance upon any such centralization is severed
by means of cryptography.

# Proofs

It's pretty amazing what you can do with a bunch of hashes packed together.

As arrays, they can be used for fast positional search.

Compacted into Set()s, inclusion checks can replace many expensive comparison
operations.

If you sort them before they get encoded into the proof, you've got a search
table that you can seek into faster than any tree structure you could ever
write.

If you're not familiar with this realm of cryptography, that's fine, you'll
start to see what `hashless` can do by means of this cryptography, like (
these are in-progress, working on the code rn):

* Shipping diffs of files and directories already available on The Web (you
  don't need to own or provide the origin data).
	* You can then build additional mutations and data structures from
	  that state, which can be used to materialize your final result
		re-using all the origin data.
* Add local offline caching to any website.
* Add p2p data replication and persistence to any website.
* Mapping language into searchable structures without knowing anything about
  the language or its meaning.
  * Which can then be used in concert with AI to map translations back to source
	  texts.
  * Which can then power AI translation to "sound like" a that translator.

# Files, Directories, Byte Arrays and Maps

In all prior art regarding crytographic file representations, files above
a certain size are split into chunks that are addressed by hash to form
merkle structures. Since variations in chunking will produce variations
in parent hash addresses, files addressed by hash in these systems
are actually "Byte Arrays" since they address a representation of specifically
sized chunks that make up a fixed size array of chunks.

In `hashless` **everything** is a Byte Array of some kind.
* The "ByteArrayProof" is the most often used/useful proof. It
  is the hash of every chunk, so the length of the Byte Array
	and the `width` of the proof are the same.
* "Files" in `hashless` are no different from any other Byte Array.
* "Directories" in `hashless` are a `Map` of relative file path
  names to Byte Arrays.
* "Map" is a Byte Array of `values` followed by a Byte Array of
  the same length for the `keys`.
* "MapProof" is hashes of each `key + value`.


