import Array "mo:base/Array";

actor {
  stable var storedHashes : [Text] = [];

  // Store hash in the canister
  public func storeHash(hash: Text) : async Text {
    storedHashes := Array.append(storedHashes, [hash]);
    return "Hash stored successfully: " # hash;
  };

  // Verify if hash exists
  public query func verifyHash(hash: Text) : async Bool {
    return Array.find<Text>(storedHashes, func(x) { x == hash }) != null;
  };
};
