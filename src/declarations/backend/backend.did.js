export const idlFactory = ({ IDL }) => {
  const Database = IDL.Service({
    'autoScaleHotelCanister' : IDL.Func([IDL.Text], [IDL.Text], []),
    'autoScaleUserCanister' : IDL.Func([IDL.Text], [IDL.Text], []),
    'createNewHotelCanister' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Vec(IDL.Principal))],
        [IDL.Opt(IDL.Text)],
        [],
      ),
    'createNewUserCanister' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Vec(IDL.Principal))],
        [IDL.Opt(IDL.Text)],
        [],
      ),
    'deleteCanister' : IDL.Func([IDL.Text], [], []),
    'getCanistersByPK' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
    'getPKs' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'upgradeCanisterByPK' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Nat8)],
        [IDL.Text],
        [],
      ),
  });
  return Database;
};
export const init = ({ IDL }) => { return []; };