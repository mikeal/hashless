# hashless

Hashless is a proof encoding scheme. It is an alternative to many IPFS protocols yet is built upon many IPFS protocols. As such it tends to upend most conceptual models for how IPFS/IPLD "work."

Hashless does not define an encoding scheme for source data and does not re-encode source data into merkle structures. Instead, a proof description is encoded which, when applied to source data, produces a resulting merkle structure (proof).

By not touching source data, hashless is truly flexible, working with any input data in an format, in any storage system, available over any transport.

Since proofs are not computed until the proof is addressed (CID) hashless proofs are not bound to a specific hash function and hashes are not encoded and exchanged, they are computed as proof.

# Data Structures

It would be tempting to model all data as JSON, or JSON-like

## BVREAM (Bye Vectors Rule Everything Around Me)

Rather than the view of CID's imposed by IPLD that "all data is a graph"
the view of merkle structures hashless imposea is "all data as byte vectors."

This encoding scheme can encode existing IPFS/IPLD data with "blocks as byte vectors"
but much more sophisticated data structures can be built in the form
of proofs.

The name "hashless" comes from the idea that the hashes themselves are rarely,
if ever, encoded into the data. Instead, byte vectors are concatenated together,
encoded in that concatenated form, and only the proof contains the necessary
parsing information to form the merkle structures used to address the data.

This means that many variances in encoding and chunking of data can be
addressed with new proofs rather than re-encoding the data itself. Entirely
new data structures can be formed from proofs over already encoded byte
arrays.

In `hashless` the encoding of source data (concatenated or "flattened" byte vectors) is
kept logically separate from the proof definitions and encodings. Even
the parsing information necessary to parse the concatenated byte vector 
is considered proof information and encoded separately.

This means that input to proofs always use a `raw` codec for source
data as the first input.

# How is this still IPFS?

CID's are beautiful, that's how.

The only thing used to program hashless data structure protocols are CID's.

Hashless protocols are cryptographic proofs, each using a unique CID `codec`.
The CID's multihash is the hash function used for the proof, allowing us to
create new cryptographic protocols with variable hash functions.

Upon consideration, you'll notice that upgrading to new hash functions is much
more practical given this split between the encoding of the source data (concatenated byte vector)
and the proof encoding. The reference implementation here is entirely in blake3
for some very JavaScript hash function implementation specific problems we've got going on in
The Web right now.

This also means that compatibility between implementations of these protocols
can be enforced cryptographically, since only the source data and proof definitions
are sent the other implementation can either produce the hash address for the computed
proofs or it can't.

Cryptographic enforcement in the data structure layer is sorely needed, as
IPFS protocols have historically failed at getting implementations to
align enough to produce crytprographically consistent results.

In many ways, this opens up the innovation any actor in the network can take
on if they're building an app and can load the necessary code to encode their work.


