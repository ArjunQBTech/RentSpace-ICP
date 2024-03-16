import Result "mo:base/Result";
import Text "mo:base/Text";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Array "mo:base/Array";

import Utils "../utils";

shared ({caller = owner}) actor class () {
    type AdminId = Text;

    type TicketId = Text;
    type Address = {
        region : Text;
        streetAddress : Text;
        building : Text;
        city : Text;
        country : Text;
        postalCode : Text;
    };
    type Ticket = {
        messageToHost : Text;
        messageToAdmin : Text;
        reason : Text;
        customerId : Text;
        resolved : Bool;
        address : Address;
        createdAt : Text;
    };
    type UserIdentity = Text;
    type Issue = {
        message : Text;
        reply : ?Text;
    };
    type Result = Result.Result<Text, (Error.ErrorCode, Text)>;
    var unResolvedIssueMap = HashMap.HashMap<UserIdentity, List.List<Issue>>(0, Text.equal, Text.hash);
    var resolvedIssueMap = HashMap.HashMap<UserIdentity, List.List<Issue>>(0, Text.equal, Text.hash);
    stable var entries : [(UserIdentity, List.List<Issue>)] = [];

    var ticketMap = HashMap.HashMap<Text, [(TicketId, Ticket)]>(0, Text.equal, Text.hash);
    stable var ticketEntries : [(Text, [(TicketId, Ticket)])] = [];
    stable var admin : [AdminId] = [];

    public shared ({caller}) func createIssue(message : Text) : async Result {
        try {
            if (Principal.isAnonymous(caller) == true or Utils.validText(message, 300) == false) {
                Debug.trap("No user found of this Identity");
            };
            let issue : Issue = {
                message;
                reply = null;
            };
            switch (unResolvedIssueMap.get(Principal.toText(caller))) {
                case (null) {
                    unResolvedIssueMap.put(Principal.toText(caller), List.push(issue, List.nil<Issue>()));
                };
                case (?data) {
                    let temp = List.push(issue, data);
                    unResolvedIssueMap.put(Principal.toText(caller), temp);
                };
            };
            #ok("Sucessfully Create the Issue");
        } catch (e) {
            let code = Error.code(e);
            let message = Error.message(e);
            #err(code, message);
        };
    };

    public shared query ({caller}) func getAllUserIssue() : async [Issue] {
        switch (unResolvedIssueMap.get(Principal.toText(caller))) {
            case (null) {[]};
            case (?value) {List.toArray(value)};
        };
    };
    public shared query ({caller}) func getResolvedIssue() : async [Issue] {
        switch (resolvedIssueMap.get(Principal.toText(caller))) {
            case (null) {[]};
            case (?value) {
                List.toArray(value);
            };
        };
    };

    public shared query ({caller}) func whoami() : async Text {
        Principal.toText(caller);
    };

    public shared query ({caller}) func getAllUnResolvedIssue() : async [UserIdentity] {
        Iter.toArray(unResolvedIssueMap.keys());
    };
    public shared ({caller}) func resolveUserIssue(userId : UserIdentity, reply : Text) : async () {
        let resolvedIssue : Issue = switch (unResolvedIssueMap.get(userId)) {
            case (null) {Debug.trap("Invalid UserId")};
            case (?result) {
                let unResolvedIssues = List.toArray(result);
                let {message} = unResolvedIssues[0];

                let updatedUnResolvedIssue = List.drop<Issue>(result, 1);
                unResolvedIssueMap.put(userId, updatedUnResolvedIssue);
                {
                    message;
                    reply = ?reply;
                };
            };
        };
        switch (resolvedIssueMap.get(userId)) {
            case (null) {
                resolvedIssueMap.put(Principal.toText(caller), List.push(resolvedIssue, List.nil<Issue>()));
            };
            case (?value) {
                unResolvedIssueMap.put(Principal.toText(caller), List.push(resolvedIssue, value));
            };
        };
    };

    // Ticket raising functions and type

    public shared ({caller = user}) func raiseNewTicket(reason : Text, hostMessage : Text, adminMessage : Text, address : Address) : async Result {

        assert (Principal.isAnonymous(user) == false);
        let userId = Principal.toText(user);
        let uuid = await Utils.getUuid();
        let ticketId = userId # "#" # uuid;
        let userTextId = Principal.toText(user);

        let ticketInfo : Ticket = {
            messageToHost = hostMessage;
            messageToAdmin = adminMessage;
            reason = reason;
            customerId = userTextId;
            resolved = false;
            address = address;
            createdAt = Utils.getDate();
        };

        var resultMessage = "";

        try {
            switch (ticketMap.get(userTextId)) {
                case (null) {
                    ticketMap.put(userTextId, [(ticketId, ticketInfo)]);
                    resultMessage := "Raising the first comment for the user";
                };
                case (?r) {
                    let ticketSubMap = HashMap.fromIter<Text, Ticket>(r.vals(), 1, Text.equal, Text.hash);
                    ticketSubMap.put(ticketId, ticketInfo);
                    ticketMap.put(userTextId, Iter.toArray(ticketSubMap.entries()));
                    resultMessage := "Raised a new issue!";
                };
            };
            #ok(resultMessage);
        } catch (e) {
            let code = Error.code(e);
            let message = Error.message(e);
            #err(code, message);
        };

    };

    public shared query ({caller = user}) func getTicket() : async [(TicketId, Ticket)] {
        assert (Principal.isAnonymous(user) == false);
        let userTextId = Principal.toText(user);
        switch (ticketMap.get(userTextId)) {
            case (null) {Debug.trap("no Issue found raised by this user")};
            case (?value) {value};
        };
    };

    public shared query ({caller = user}) func getUserTicketsByAdmin(userId : Text) : async [(TicketId, Ticket)] {
        if (Utils.getOwnerFromArray(user, admin) == false) {
            Debug.trap("Not Authorased");
        };
        switch (ticketMap.get(userId)) {
            case (null) {Debug.trap("no Issue found raised by this user")};
            case (?value) {value};
        };

    };

    public shared ({caller = user}) func resolveTicketRaised(ticketId : Text, userId : Text) : async Result {
        if (Utils.getOwnerFromArray(user, admin) == false) {
            Debug.trap("Not Authorased");
        };
        try {

            var resultMessage = "";

            switch (ticketMap.get(userId)) {
                case (null) {
                    Debug.trap("no Issue found raised by this user");
                };
                case (?value) {
                    let ticketSubMap = HashMap.fromIter<Text, Ticket>(value.vals(), 1, Text.equal, Text.hash);
                    switch (ticketSubMap.get(ticketId)) {
                        case (null) {
                            Debug.trap("No issue found with this id");
                        };
                        case (?value) {
                            let previousTicket : Ticket = value;
                            let newTicket : Ticket = {
                                messageToHost = previousTicket.messageToHost;
                                messageToAdmin = previousTicket.messageToAdmin;
                                reason = previousTicket.reason;
                                customerId = previousTicket.customerId;
                                resolved = true;
                                address = previousTicket.address;
                                createdAt = previousTicket.createdAt;
                            };
                            let prevMap = ticketSubMap.replace(ticketId, newTicket);
                            let prevMapTicket = ticketMap.replace(userId, Iter.toArray(ticketSubMap.entries()));
                            resultMessage := "Successfully resolved the ticket!";
                        };
                    };
                };

            };
            #ok(resultMessage);
        } catch (e) {
            let code = Error.code(e);
            let message = Error.message(e);
            #err(code, message);
        };
    };
    public shared query ({caller}) func isAdmin() : async Bool {
        Utils.getOwnerFromArray(caller, admin);
    };

    public shared ({caller = user}) func removeResolvedTicketRaised(ticketId : Text, userId : Text) : async Result {
        assert (Principal.isAnonymous(user));
        try {

            var resultMessage = "";

            switch (ticketMap.get(userId)) {
                case (null) {
                    Debug.trap("no Issue found raised by this user");
                };
                case (?value) {
                    let ticketSubMap = HashMap.fromIter<Text, Ticket>(value.vals(), 1, Text.equal, Text.hash);
                    switch (ticketSubMap.get(ticketId)) {
                        case (null) {
                            Debug.trap("No issue found with this id");
                        };
                        case (?value) {
                            ticketMap.delete(userId);
                            ticketSubMap.delete(ticketId);
                            ticketMap.put(userId, Iter.toArray(ticketSubMap.entries()));
                            resultMessage := "Successfully removed the issue!";
                        };
                    };
                };

            };
            #ok(resultMessage);
        } catch (e) {
            let code = Error.code(e);
            let message = Error.message(e);
            #err(code, message);
        };
    };
    public shared query func getNoOfPages(chunkSize : Nat) : async Nat {
        let data = Utils.paginate<Text, [(TicketId, Ticket)]>(Iter.toArray(ticketMap.entries()), chunkSize);
        data.size();
    };
    public shared query ({caller}) func scanBooking(pageNo : Nat, chunkSize : Nat) : async [(Text, [(TicketId, Ticket)])] {
        if (Utils.getOwnerFromArray(caller, admin) == false) {
            Debug.trap("Not Authorased");
        };
        let allData = Utils.paginate<Text, [(TicketId, Ticket)]>(Iter.toArray(ticketMap.entries()), chunkSize);
        if (allData.size() <= pageNo) {
            Debug.trap("No page Exist");
        };
        allData[pageNo];
    };

    public shared ({caller}) func addOwner(ownerIds : AdminId) : async Text {
        if (caller == owner) {
            let list = List.push(ownerIds, List.fromArray(admin));
            admin := List.toArray(list);
            "Successfully inserted data";
        } else if (Utils.getOwnerFromArray(caller, admin) == true) {
            let list = List.push(ownerIds, List.fromArray(admin));
            admin := List.toArray(list);
            "Successfully inserted data";
        } else {
            Debug.trap("No Access to Add Owner");
        };
    };
    system func preupgrade() {
        entries := Iter.toArray(unResolvedIssueMap.entries());

        ticketEntries := Iter.toArray(ticketMap.entries());
    };

    system func postupgrade() {
        ticketMap := HashMap.fromIter<Text, [(Text, Ticket)]>(ticketEntries.vals(), 1, Text.equal, Text.hash);
        ticketEntries := [];
        unResolvedIssueMap := HashMap.fromIter<Text, List.List<Issue>>(entries.vals(), 1, Text.equal, Text.hash);
        entries := [];
    };
};