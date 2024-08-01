import UtilityFunc "../utils/utilityFunc";
import TrieMap "mo:base/TrieMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Error "mo:base/Error";
import Time "mo:base/Time";
import Char "mo:base/Char";
import Bool "mo:base/Bool";
import DateTime "mo:datetime/DateTime";
import Month "../utils/month";
import UserTypes "../types/userTypes";

shared ({ caller = owner }) actor class User() {
    var userRecord = TrieMap.TrieMap<Principal, UserTypes.UserInfo>(Principal.equal, Principal.hash);
    var anualRegisterFrequency = TrieMap.TrieMap<UserTypes.Year, UserTypes.AnnualData>(Text.equal, Text.hash);
    // var admin : [UserTypes.AdminId] = []; // make it stable array for main net

    stable var stableUserRecords : [UserTypes.StableUserData] = [];

    stable var stableAnnualRegisterFrequency : [UserTypes.StableRegistry] = [];

    ///////////////////////////// Private Functions ////////////////////////////////////

    private func fromUserData(userData : UserTypes.UserInfo) : (Principal, UserTypes.UserInfo) {
        (userData.userID, userData)
    };

    private func fromAnnualRegistry(year : UserTypes.Year, data : UserTypes.AnnualData) : (UserTypes.Year, UserTypes.AnnualData) {
        (year, data)
    };

    private func toStableUserData() : [UserTypes.StableUserData] {
        let users = userRecord.vals() |> Iter.map(_, fromUserData) |> Iter.toArray(_);
        return users;
    };

    private func toStableAnnualRegistry() : [UserTypes.StableRegistry] {
        let annualData = anualRegisterFrequency.vals() |> Iter.map(_, fromAnnualRegistry) |> Iter.toArray(_);
        return annualData;
    };

    private func buildUserMap(users : [UserTypes.StableUserData]) : TrieMap.TrieMap<Principal, UserTypes.UserInfo> {
        let userMap = TrieMap.empty<Principal, UserTypes.UserInfo>(Principal.equal, Principal.hash);
        for (user in users) {
            userMap.put(user._1, user._2);
        };
        return userMap;
    };

    private func buildAnnualRegistry(annualData : [UserTypes.StableRegistry]) : TrieMap.TrieMap<UserTypes.Year, UserTypes.AnnualData> {
        let registry = TrieMap.empty<UserTypes.Year, UserTypes.AnnualData>(Text.equal, Text.hash);
        for (data in annualData) {
            registry.put(data._1, data._2);
        };
        return registry;
    };

    system func preupgrade() {
        stableUserRecords := toStableUserData();
        stableAnnualRegisterFrequency := toStableAnnualRegistry();
    };

    system func postupgrade() {
        userRecord := buildUserMap(stableUserRecords);
        anualRegisterFrequency := buildAnnualRegistry(stableAnnualRegisterFrequency);
        stableUserRecords := [];
        stableAnnualRegisterFrequency := [];
    };

    ///////////////////////////// Public Functions ////////////////////////////////////

    // Register a new user
    public shared ({ caller }) func registerUser(userData : UserTypes.User) : async Result.Result<Text, Text> {
        try {
            await UtilityFunc.checkAnonymous(caller);
            switch (userRecord.get(caller)) {
                case (null) {

                    let currentDate = UtilityFunc.getDate();

                    // anual register frequency update
                    let date = DateTime.DateTime(Time.now()).toText();
                    var counter = 0;
                    var year = "";
                    var month = "";

                    for (i in Text.toIter(date)) {
                        if (counter <= 3) {
                            year := year # Char.toText(i);
                        };
                        if (counter > 5 and counter <= 6) {
                            month := month # Char.toText(i);
                        };
                        counter += 1;
                    };

                    switch (anualRegisterFrequency.get(year)) {
                        case (null) {
                            let intialAnnualData = {
                                jan = 0;
                                feb = 0;
                                march = 0;
                                april = 0;
                                may = 0;
                                june = 0;
                                july = 0;
                                aug = 0;
                                sep = 0;
                                oct = 0;
                                nov = 0;
                                dec = 0;
                            };
                            let monthData = Month.updateMonthData(month, intialAnnualData);
                            anualRegisterFrequency.put(year, monthData);

                        };
                        case (?result) {
                            let updateMothData = Month.updateMonthData(month, result);
                            ignore anualRegisterFrequency.replace(year, updateMothData);
                        };
                    };

                    //----------------------
                    let newUser : UserTypes.UserInfo = {
                        userID = caller;
                        firstName = userData.firstName;
                        lastName = userData.lastName;
                        dob = userData.dob;
                        userEmail = userData.userEmail;
                        userRole = "user";
                        userImage = "";
                        userGovID = "";
                        govIDLink = "";
                        isHost = false;
                        isVerified = false;
                        agreementStatus = false;
                        createdAt = currentDate;
                    };
                    userRecord.put(caller, newUser);

                    return #ok("User registered successfully");
                };
                case (?user) {
                    return #err("User already registered");
                };
            };
        } catch e {
            return #err(Error.message(e));
        };
    };

    // Get user details
    public shared ({ caller }) func getuserDetails() : async Result.Result<UserTypes.UserInfo, Text> {
        try {
            await UtilityFunc.checkAnonymous(caller);
            switch (userRecord.get(caller)) {
                case (null) {
                    return #err("User not found");
                };
                case (?user) {
                    return #ok(user);
                };
            };
        } catch e {
            return #err(Error.message(e));
        };
    };

    // Update user details
    public shared ({ caller }) func updateUserDetails(userData : UserTypes.UserInfo) : async Result.Result<Text, Text> {
        try {
            await UtilityFunc.checkAnonymous(caller);
            switch (userRecord.get(caller)) {
                case (null) {
                    return #err("User not found");
                };
                case (?user) {
                    let updateData : UserTypes.UserInfo = {
                        userID = caller;
                        firstName = userData.firstName;
                        lastName = userData.lastName;
                        dob = userData.dob;
                        userEmail = userData.userEmail;
                        userRole = userData.userRole;
                        userImage = userData.userImage;
                        userGovID = userData.userGovID;
                        govIDLink = userData.govIDLink;
                        isHost = userData.isHost;
                        isVerified = userData.isVerified;
                        agreementStatus = userData.agreementStatus;
                        createdAt = userData.createdAt;
                    };
                    ignore userRecord.replace(caller, updateData);
                    return #ok("User details updated successfully");
                };
            };
        } catch e {
            return #err(Error.message(e));
        };
    };

    // Delete user details
    public shared ({ caller }) func deleteUser() : async Result.Result<Text, Text> {
        try {
            await UtilityFunc.checkAnonymous(caller);
            switch (userRecord.get(caller)) {
                case (null) {
                    return #err("User not found");
                };
                case (?user) {
                    userRecord.delete(caller);
                    return #ok("User deleted successfully");
                };
            };
        } catch e {
            return #err(Error.message(e));
        };
    };

    // Get user by Principal
    public func getUserByPrincipal(principal : Principal) : async Result.Result<UserTypes.UserInfo, Text> {
        try {
            switch (userRecord.get(principal)) {
                case (null) {
                    return #err("User not found");
                };
                case (?user) {
                    return #ok(user);
                };
            };
        } catch e {
            return #err(Error.message(e));
        };
    };

    // Get anual registered users
    public shared ({ caller }) func getAnnualRegisterByYear(year : Text) : async Result.Result<UserTypes.AnnualData, Text> {
        try {
            // let isAdmin = await UtilityFunc.getAdminFromArray(caller, admin);
            // if (isAdmin == false) {
                // return #err("User not authorized to access this data");
            // };
            switch (anualRegisterFrequency.get(year)) {
                case (null) {
                    return #err("No user registered in this year");
                };
                case (?data) {
                    return #ok(data);
                };
            };
        } catch e {
            return #err(Error.message(e));
        };
    };

    // Whoami function
    public shared ({ caller }) func whoami() : async Text {
        // Principal.toText(caller);
        return Principal.toText(caller);
    };

    // check User Exist
    public query func checkUserExist(userId : Text) : async Bool {
        switch (userRecord.get(Principal.fromText(userId))) {
            case (null) {
                return false;
            };
            case (?user) {
                return true;
            };
        };
    };

};
