import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import Result "mo:base/Result";
import Error "mo:base/Error";
import Principal "mo:base/Principal";
import SupportTypes "../types/supportTypes";
import UtilityFunc "../utils/utilityFunc";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import DateTime "mo:datetime/DateTime";
import Bool "mo:base/Bool";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Int "mo:base/Int";

shared ({caller = owner}) actor class Support() {

    var ticketRecords = TrieMap.TrieMap<Text,SupportTypes.Ticket>(Text.equal, Text.hash);
    var unresolvedTicketRecords = TrieMap.TrieMap<Text,SupportTypes.Ticket>(Text.equal, Text.hash);
    var supportChatRecords = TrieMap.TrieMap<Principal,[SupportTypes.SupportMessage]>(Principal.equal,Principal.hash);
    var adminList:[Text] = ["6ct7f-kcnfk-uccb5-vc7ot-gjlbg-64al3-hnz2a-efs53-rj4jo-mwau4-6ae","sfwko-hd7us-gen5t-ssuci-vfjwf-afepb-a7p4y-guh5l-s5n2e-zuxvt-dae", "6b76s-v6k5g-6gryk-qvrbe-fwa3f-lvwjp-ou5b2-bccdr-djpga-ug63j-tqe", "jktes-xovbb-q64a2-pikqp-4og2m-rfezc-6fwpc-ctiwc-ldev7-34xrm-dae"];

    stable var stableTicketRecords : [(Text, SupportTypes.Ticket)] = [];
    stable var stableUnresolvedTicketRecords : [(Text, SupportTypes.Ticket)] = [];
    stable var stableSupportChatRecords : [(Principal, [SupportTypes.SupportMessage])] = [];

    system func preupgrade() {
        stableTicketRecords := Iter.toArray(ticketRecords.entries());
        stableUnresolvedTicketRecords := Iter.toArray(unresolvedTicketRecords.entries());
        stableSupportChatRecords := Iter.toArray(supportChatRecords.entries());
    };

    system func postupgrade() {
        let ticketRecordsVals = ticketRecords.entries();
        let unresolvedTicketRecordsVals = unresolvedTicketRecords.entries();
        let supportChatRecordsVals = supportChatRecords.entries();

        ticketRecords := TrieMap.fromEntries<Text, SupportTypes.Ticket>(ticketRecordsVals, Text.equal, Text.hash);
        unresolvedTicketRecords := TrieMap.fromEntries<Text, SupportTypes.Ticket>(unresolvedTicketRecordsVals, Text.equal, Text.hash);
        supportChatRecords := TrieMap.fromEntries<Principal, [SupportTypes.SupportMessage]>(supportChatRecordsVals, Principal.equal, Principal.hash);

        stableTicketRecords := [];
        stableUnresolvedTicketRecords := [];
    };

    //creates a new ticket
    public shared ({caller}) func createTicket(ticket : SupportTypes.TicketInput, address : SupportTypes.Address) : async Result.Result<Text, Text> {
        try {
            //check is user exists
            await UtilityFunc.checkAnonymous(caller);
            let uuid = await UtilityFunc.getUuid();
            let newTicketId = Principal.toText(caller) # "#" # uuid;
            let time = DateTime.DateTime(Time.now()).toText();
            let newTicket : SupportTypes.Ticket = {
                ticketId = newTicketId;
                messageToHost = ticket.messageToHost;
                messageToAdmin = ticket.messageToAdmin;
                reason = ticket.reason;
                resolved = false;
                address = address;
                createdAt = time;
                customerId = Principal.toText(caller);
            };
            ticketRecords.put(newTicketId, newTicket);
            unresolvedTicketRecords.put(newTicketId, newTicket);
            return #ok("Your ticket is raised");
        } catch e {
            return #err(Error.message(e));
        };
    };

    // resolves a ticket
    public shared ({caller}) func resolveTicket(ticketId : Text) : async Result.Result<Text, Text> {
        try {
            //check admin
            let isAdmin = await checkIsAdmin(caller);
            if (isAdmin == false) {
                return #err("You are not an admin");
            };
            switch (ticketRecords.get(ticketId)) {
                case (null) {
                    return #err("No ticket found with this ID");
                };
                case (?ticket) {
                    let newTicket : SupportTypes.Ticket = {
                        ticketId = ticketId;
                        messageToHost = ticket.messageToHost;
                        messageToAdmin = ticket.messageToAdmin;
                        reason = ticket.reason;
                        resolved = true;
                        address = ticket.address;
                        createdAt = ticket.createdAt;
                        customerId = ticket.customerId;
                    };
                    ignore ticketRecords.replace(ticketId, newTicket);
                    unresolvedTicketRecords.delete(ticketId);
                    return #ok("The ticket has been resolved");
                };
            };
        } catch e {
            return #err(Error.message(e));
        };
    };

    // returns number of unresolved tickets
    public shared ({caller}) func getNoOfUnresolvedTickets() : async Result.Result<Nat, Text> {
        try {
            let isAdmin = await checkIsAdmin(caller);
            if (isAdmin == false) {
                return #err("You are not an admin");
            };
            return #ok(unresolvedTicketRecords.size());
        } catch e {
            return #err(Error.message(e));
        };
    };

    //returns list of all the unresolved tickets
    public shared ({caller}) func getAllUnresolvedTickets(size : Nat, pageNo : Nat) : async Result.Result<[(Text, SupportTypes.Ticket)], Text> {
        try {
            let isAdmin = await checkIsAdmin(caller);
            if (isAdmin == false) {
                return #err("You are not an admin");
            };
            if (pageNo < 1) {
                return #err("Page number starts from 1");
            };
            let ticketIter = ticketRecords.entries();
            let ticketArr = Iter.toArray(ticketIter);
            var startIndex : Int = 0;
            if (pageNo > 1) {
                startIndex := (pageNo - 1) * 10;
            };
            var endIndex = startIndex +size;
            if (startIndex >= ticketArr.size()) {
                return #err("page number exceeds the number of entries");
            };
            if (endIndex > ticketArr.size()) {
                endIndex := ticketArr.size();
            };
            let filteredTicketListings = Iter.toArray(Array.slice(ticketArr, Int.abs(startIndex), Int.abs(endIndex)));
            return #ok(filteredTicketListings);
        } catch e {
            return #err(Error.message(e));
        };
    };

    //sends a message to user or admin
    public shared ({caller}) func sendMessage(message : Text, to : ?Principal) : async Result.Result<Text, Text> {
        try {
            await UtilityFunc.checkAnonymous(caller);
            let isAdmin = await checkIsAdmin(caller);
            let time = DateTime.DateTime(Time.now()).toText();

            if (isAdmin) {
                switch (to) {
                    case (null) {
                        return #err("Please provide a user to send message to !");
                    };
                    case (?some) {
                        let newSupportMessage : SupportTypes.SupportMessage = {
                            byAdmin = isAdmin;
                            from = caller;
                            message = message;
                            createdAt = time;
                            to = ?some;
                        };

                        switch (supportChatRecords.get(some)) {
                            case (null) {
                                var newChats : Buffer.Buffer<SupportTypes.SupportMessage> = Buffer.fromArray([]);
                                newChats.add(newSupportMessage);
                                ignore supportChatRecords.replace(some, Buffer.toArray(newChats));
                                return #ok("Your message is sent to user");
                            };
                            case (?chats) {
                                var newChats : Buffer.Buffer<SupportTypes.SupportMessage> = Buffer.fromArray(chats);
                                newChats.add(newSupportMessage);
                                ignore supportChatRecords.replace(some, Buffer.toArray(newChats));
                                return #ok("Your message is sent to user");
                            };
                        };

                    };
                };
            } else {
                let newSupportMessage : SupportTypes.SupportMessage = {
                    byAdmin = isAdmin;
                    from = caller;
                    message = message;
                    createdAt = time;
                    to = null;
                };
                switch (supportChatRecords.get(caller)) {
                    case (null) {
                        var newChats : Buffer.Buffer<SupportTypes.SupportMessage> = Buffer.fromArray([]);
                        newChats.add(newSupportMessage);
                        ignore supportChatRecords.replace(caller, Buffer.toArray(newChats));
                        return #ok("Your message is sent to admin");
                    };
                    case (?chats) {
                        var newChats : Buffer.Buffer<SupportTypes.SupportMessage> = Buffer.fromArray(chats);
                        newChats.add(newSupportMessage);
                        ignore supportChatRecords.replace(caller, Buffer.toArray(newChats));
                        return #ok("Your message is sent to admin");
                    };
                };
            };

        } catch e {
            return #err(Error.message(e));
        };
    };

    // returns th conversation between a user and the admin
    public shared ({caller}) func getAllUserMessages(user : Principal) : async Result.Result<[SupportTypes.SupportMessage], Text> {
        try {
            let isAdmin = await checkIsAdmin(caller);
            if (user != caller and isAdmin == false) {
                return #err("You cannot fetch someone else's chats");
            };

            switch (supportChatRecords.get(user)) {
                case (null) {
                    return #ok([]);
                };
                case (?chats) {
                    return #ok(chats);
                };
            };

        } catch e {
            return #err(Error.message(e));
        };
    };

    // returns teh number of users that contacted support chat
    public shared ({caller}) func getNumberOfChats() : async Result.Result<Nat, Text> {
        try {
            let isAdmin = await checkIsAdmin(caller);
            if (isAdmin == false) {
                return #err("You are not an admin");
            };
            return #ok(supportChatRecords.size());
        } catch e {
            return #err(Error.message(e));
        };
    };

    // returns all the chats of support admin
    public shared ({caller}) func getAllChats(size : Nat, pageNo : Nat) : async Result.Result<[(Principal, [SupportTypes.SupportMessage])], Text> {
        try {
            let isAdmin = await checkIsAdmin(caller);
            if (isAdmin == false) {
                return #err("You are not an admin");
            };
            if (pageNo < 1) {
                return #err("Page number starts from 1");
            };
            let chatIter = supportChatRecords.entries();
            let chatArr = Iter.toArray(chatIter);
            var startIndex : Int = 0;
            if (pageNo > 1) {
                startIndex := (pageNo - 1) * 10;
            };
            var endIndex = startIndex +size;
            if (startIndex >= chatArr.size()) {
                return #err("page number exceeds the number of entries");
            };
            if (endIndex > chatArr.size()) {
                endIndex := chatArr.size();
            };
            let filteredChatListings = Iter.toArray(Array.slice(chatArr, Int.abs(startIndex), Int.abs(endIndex)));
            return #ok(filteredChatListings);
        } catch e {
            return #err(Error.message(e));
        };
    };

    // returns list of all admins
    public shared ({caller}) func getAllAdmins() : async Result.Result<[Text], Text> {
        try {
            //check  if admin
            await UtilityFunc.checkAnonymous(caller);
            let isAdmin = await checkIsAdmin(caller);
            if (isAdmin) {
                return #ok(adminList);
            } else {
                return #err("You are not an admin");
            };
        } catch e {
            return #err(Error.message(e));
        };
    };

    // add new admin
    public shared ({caller}) func addAdmin(newAdmin : Text) : async Result.Result<Text, Text> {
        try {
            await UtilityFunc.checkAnonymous(caller);
            let isAdmin = await checkIsAdmin(caller);
            if (isAdmin == false) {
                return #err("You are not an admin");
            };
            var newAdminList : Buffer.Buffer<Text> = Buffer.fromArray(adminList);
            newAdminList.add(newAdmin);
            adminList := Buffer.toArray(newAdminList);
            return #ok("New admin " # newAdmin # " has been added !");
        } catch e {
            return #err(Error.message(e));
        };
    };

    // checks if the principal passed is an admin or not
    public query func checkIsAdmin(caller : Principal) : async Bool {
        switch (Array.find<Text>(adminList, func(x) : Bool {x == Principal.toText(caller)})) {
            case (null) {
                return false;
            };
            case (?r) {
                return true;
            };
        };
    };

    // returns principal of caller
    public shared ({caller}) func whoami() : async Text {
        return Principal.toText(caller);
    };
};
