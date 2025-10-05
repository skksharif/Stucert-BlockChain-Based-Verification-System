export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'storeHash' : IDL.Func([IDL.Text], [IDL.Text], []),
    'verifyHash' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
