import List "mo:base/List";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Principal "mo:base/Principal";
import Cycles "mo:base/ExperimentalCycles";
import Array "mo:base/Array";
import Iter "mo:base/Iter";

import UUID "mo:uuid/UUID";
import Source "mo:uuid/async/SourceV4";
import Buffer "mo:stablebuffer/StableBuffer";

import CA "mo:candb/CanisterActions";
import CanisterMap "mo:candb/CanisterMap";
import Utils "mo:candb/Utils";
import Entity "mo:candb/Entity";
import Admin "mo:candb/CanDBAdmin";
import CanDB "mo:candb/CanDB";

import User "UserCanister";
import Hotel "HotelCanister";
import Booking "BookingCanister";
import Review "ReviewCanister";
import Types "types" shared ({caller = owner}) actor class Database() = this {

  // @required stable variable (do not delete or change)

  //holds the canisterMap of PK -> CanisterIdList
  stable var pkToCanisterMap = CanisterMap.init();

  // @required API (do not delete or Change)

  // Get all canister for an specific PK
  public shared query ({caller = caller}) func getCanistersByPK(pk : Text) : async [Text] {
    getCanistersIdsIfExists(pk);
  };

  // returns all partitions
  public query func getPKs() : async [Text] {
    let allPks = CanisterMap.entries(pkToCanisterMap);

    let iterOfPks = Iter.map<(Text, CanisterMap.CanisterIdList), Text>(
      allPks,
      func(e) {
        e.0;
      },
    );
    return Iter.toArray(iterOfPks);
  };

  // @required function (Do not delete or change)
  ///
  /// Helper method acting as an interface for returning an empty array if no canisters
  /// exist for the given PK
  func getCanistersIdsIfExists(pk : Text) : [Text] {
    switch (CanisterMap.get(pkToCanisterMap, pk)) {
      case null {[]};
      case (?canisterIdsBuffer) {Buffer.toArray(canisterIdsBuffer)};
    };
  };

  // dfx canister --network ic call <canister_name> <function_name> <function_input>

  // Spins up a new HelloService canister with the provided pk and controllers
  func createUserCanister(pk : Text, controllers : ?[Principal]) : async Text {
    Debug.print("creating new hello service canister with pk=" # pk);
    // Pre-load 300 billion cycles for the creation of a new Hello Service canister
    // Note that canister creation costs 100 billion cycles, meaning there are 200 billion
    // left over for the new canister when it is created
    Cycles.add(300_000_000_000);
    let newCanisterPrincipal = Principal.fromActor(await User.Users({partitonKey = pk; scalingOptions = {autoScalingHook = autoScaleUserCanister; sizeLimit = #heapSize(475_000_000); /* Scale out at 475MB */
    /* for auto-scaling testing */
    /* sizeLimit = #count(3); // Scale out at 3 entities inserted */}; owners = controllers}));
    // let newCanisterPrincipal = Principal.fromActor(newCanister);
    await CA.updateCanisterSettings({
      canisterId = newCanisterPrincipal;
      settings = {
        controllers = controllers;
        compute_allocation = ?0;
        memory_allocation = ?0;
        freezing_threshold = ?2592000;
      };
    });

    let newCanisterId = Principal.toText(newCanisterPrincipal);
    // After creating the new Hello Service canister, add it to the pkToCanisterMap
    pkToCanisterMap := CanisterMap.add(pkToCanisterMap, pk, newCanisterId);

    Debug.print("new User canisterId=" # newCanisterId);
    newCanisterId;
  };

  func createHotelCanister(pk : Text, controllers : ?[Principal]) : async Text {
    Debug.print("creating new hello service canister with pk=" # pk);
    // Pre-load 300 billion cycles for the creation of a new Hello Service canister
    // Note that canister creation costs 100 billion cycles, meaning there are 200 billion
    // left over for the new canister when it is created
    Cycles.add(300_000_000_000);
    let newCanister = Principal.fromActor(await Hotel.Hotel({partitonKey = pk; scalingOptions = {autoScalingHook = autoScaleHotelCanister; sizeLimit = #heapSize(475_000_000); /* Scale out at 475MB */
    /* for auto-scaling testing */
    /* sizeLimit = #count(3); // Scale out at 3 entities inserted */}; owners = controllers}));
    // let newCanisterPrincipal = Principal.fromActor(newCanister);
    await CA.updateCanisterSettings({
      canisterId = newCanister;
      settings = {
        controllers = controllers;
        compute_allocation = ?0;
        memory_allocation = ?0;
        freezing_threshold = ?2592000;
      };
    });

    let newCanisterId = Principal.toText(newCanister);
    // After creating the new Hello Service canister, add it to the pkToCanisterMap
    pkToCanisterMap := CanisterMap.add(pkToCanisterMap, pk, newCanisterId);

    Debug.print("new User canisterId=" # newCanisterId);
    newCanisterId;
  };

  // Spins up a new HelloService canister with the provided pk and controllers
  func createBookingCanister(pk : Text, controllers : ?[Principal]) : async Text {
    Debug.print("creating new hello service canister with pk=" # pk);
    // Pre-load 300 billion cycles for the creation of a new Hello Service canister
    // Note that canister creation costs 100 billion cycles, meaning there are 200 billion
    // left over for the new canister when it is created
    Cycles.add(300_000_000_000);
    let newCanisterPrincipal = Principal.fromActor(await Booking.Booking({partitonKey = pk; scalingOptions = {autoScalingHook = autoScaleBookingCanister; sizeLimit = #heapSize(475_000_000); /* Scale out at 475MB */
    /* for auto-scaling testing */
    /* sizeLimit = #count(3); // Scale out at 3 entities inserted */}; owners = controllers}));
    await CA.updateCanisterSettings({
      canisterId = newCanisterPrincipal;
      settings = {
        controllers = controllers;
        compute_allocation = ?0;
        memory_allocation = ?0;
        freezing_threshold = ?2592000;
      };
    });

    let newCanisterId = Principal.toText(newCanisterPrincipal);
    // After creating the new Hello Service canister, add it to the pkToCanisterMap
    pkToCanisterMap := CanisterMap.add(pkToCanisterMap, pk, newCanisterId);

    Debug.print("new User canisterId=" # newCanisterId);
    newCanisterId;
  };

  func createReviewCanister(pk : Text, controllers : ?[Principal]) : async Text {
    Debug.print("creating new hello service canister with pk=" # pk);
    // Pre-load 300 billion cycles for the creation of a new Hello Service canister
    // Note that canister creation costs 100 billion cycles, meaning there are 200 billion
    // left over for the new canister when it is created
    Cycles.add(300_000_000_000);
    let newCanisterPrincipal = Principal.fromActor(await Review.Review({partitonKey = pk; scalingOptions = {autoScalingHook = autoScaleReviewCanister; sizeLimit = #heapSize(475_000_000); /* Scale out at 475MB */
    /* for auto-scaling testing */
    /* sizeLimit = #count(3); // Scale out at 3 entities inserted */}; owners = controllers}));
    await CA.updateCanisterSettings({
      canisterId = newCanisterPrincipal;
      settings = {
        controllers = controllers;
        compute_allocation = ?0;
        memory_allocation = ?0;
        freezing_threshold = ?2592000;
      };
    });

    let newCanisterId = Principal.toText(newCanisterPrincipal);
    // After creating the new Hello Service canister, add it to the pkToCanisterMap
    pkToCanisterMap := CanisterMap.add(pkToCanisterMap, pk, newCanisterId);

    Debug.print("new User canisterId=" # newCanisterId);
    newCanisterId;
  };

  public shared ({caller = creator}) func createNewUserCanister(canisterName : Text) : async ?Text {
    assert (creator == owner);
    Debug.print(debug_show (creator));
    let pk = canisterName;
    let canisterIds = getCanistersIdsIfExists(pk);
    if (canisterIds == []) {
      ?(await createUserCanister(pk, ?[owner, creator, Principal.fromActor(this)]));
    } else {
      Debug.print(pk # "already exists");
      null;
    };
  };

  public shared ({caller = creator}) func createNewHotelCanister(canisterName : Text) : async ?Text {
    assert (creator == owner);
    let pk = canisterName;
    let canisterIds = getCanistersIdsIfExists(pk);
    if (canisterIds == []) {
      ?(await createHotelCanister(pk, ?[owner, Principal.fromActor(this)]));
    } else {
      Debug.print(pk # "already exists");
      null;
    };
  };

  public shared ({caller = creator}) func createNewBookingCanister(canisterName : Text) : async ?Text {
    assert (creator == owner);
    Debug.print(debug_show (creator));
    let pk = canisterName;
    let canisterIds = getCanistersIdsIfExists(pk);
    if (canisterIds == []) {
      ?(await createBookingCanister(pk, ?[owner, Principal.fromActor(this)]));
    } else {
      Debug.print(pk # "already exists");
      null;
    };
  };
  public shared ({caller = creator}) func createNewReviewCanister(canisterName : Text) : async ?Text {
    assert (creator == owner);
    let pk = canisterName;
    let canisterIds = getCanistersIdsIfExists(pk);
    if (canisterIds == []) {
      ?(await createReviewCanister(pk, ?[owner, Principal.fromActor(this)]));
    } else {
      Debug.print(pk # "already exists");
      null;
    };
  };

  public shared ({caller = caller}) func autoScaleUserCanister(pk : Text) : async Text {
    // Auto-Scaling Authorization - if the request to auto-scale the partition is not coming from an existing canister in the partition, reject it
    if (Utils.callingCanisterOwnsPK(caller, pkToCanisterMap, pk)) {
      Debug.print("creating an additional canister for pk=" # pk);
      await createUserCanister(pk, ?[owner, Principal.fromActor(this)]);
    } else {
      throw Error.reject("not authorized");
    };
  };

  public shared ({caller = caller}) func autoScaleHotelCanister(pk : Text) : async Text {
    assert (caller == owner);

    // Auto-Scaling Authorization - if the request to auto-scale the partition is not coming from an existing canister in the partition, reject it
    if (Utils.callingCanisterOwnsPK(caller, pkToCanisterMap, pk)) {
      Debug.print("creating an additional canister for pk=" # pk);
      await createHotelCanister(pk, ?[owner, Principal.fromActor(this)]);
    } else {
      throw Error.reject("not authorized");
    };
  };

  // Spins up a new HelloService canister with the provided pk and controllers

  public shared ({caller = caller}) func autoScaleBookingCanister(pk : Text) : async Text {
    // Auto-Scaling Authorization - if the request to auto-scale the partition is not coming from an existing canister in the partition, reject it
    if (Utils.callingCanisterOwnsPK(owner, pkToCanisterMap, pk)) {
      Debug.print("creating an additional canister for pk=" # pk);
      await createBookingCanister(pk, ?[owner, Principal.fromActor(this)]);
    } else {
      throw Error.reject("not authorized");
    };
  };

  public shared ({caller = caller}) func autoScaleReviewCanister(pk : Text) : async Text {
    // Auto-Scaling Authorization - if the request to auto-scale the partition is not coming from an existing canister in the partition, reject it
    if (Utils.callingCanisterOwnsPK(owner, pkToCanisterMap, pk)) {
      Debug.print("creating an additional canister for pk=" # pk);
      await createReviewCanister(pk, ?[owner, Principal.fromActor(this)]);
    } else {
      throw Error.reject("not authorized");
    };
  };

  public shared ({caller}) func deleteCanister(serviceId : Text) : async () {
    //Warning! change this condition othwer
    assert (caller == owner);
    // admin can delete any pk by passing in service id of user principal
    let pk = serviceId;

    let canisterIds = getCanistersIdsIfExists(pk);
    if (canisterIds == []) {
      Debug.print("canister with principal=" # pk # " pk=" # pk # " does not exist");
    } else {
      // can choose to use this statusMap for to detect failures and prompt retries if desired
      let statusMap = await Admin.transferCyclesStopAndDeleteCanisters(canisterIds);
      pkToCanisterMap := CanisterMap.delete(pkToCanisterMap, pk);
    };
  };

  public shared ({caller}) func upgradeCanisterByPK(serviceId : Text, wasmModule : Blob) : async Text {
    assert (caller == owner);
    let pk = serviceId;
    let scalingOptions = {
      autoScalingHook = autoScaleUserCanister;
      sizeLimit = #heapSize(475_000_000); // Scale out at 475MB
    };

    let result = await Admin.upgradeCanistersByPK(pkToCanisterMap, pk, wasmModule, scalingOptions);

    return "Canisters in PK " # pk # " upgraded";
  };
  public shared query ({caller}) func whoami() : async Text {
    return Principal.toText(caller);
  };

  public query func getOwner() : async Text {
    return Principal.toText(owner);
  };

};
