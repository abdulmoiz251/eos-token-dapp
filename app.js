
  /**
  * DECLARATION
  */
  // const endpoint = "http://127.0.0.1:8888";
  const endpoint = "http://jungle.atticlab.net:8888";
  
  // const chainId = 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f' //local
  const chainId = 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473' //jungle
  
  // const contract = "bob";
  const contract = "eostestingaa";

  let _eos, _account;
  let scatter;



  /**
  * INITIALIZATION
  */
   const rpc = new eosjs_jsonrpc.JsonRpc(endpoint);

  //network details to which scatter will connect
  const network = ScatterJS.Network.fromJson({
    blockchain: 'eos',
    chainId: chainId,
    host: endpoint,
    port: 8888,
    protocol: 'http'
  });

  ScatterJS.plugins(new ScatterEOS()); //initiating scatter

  try {
    //start to connect to scatter client on user's pc
    ScatterJS.scatter.connect(contract).then(connected => {

      // User does not have Scatter Desktop, Mobile or Classic installed.
      if (!connected) return alert("Issue Connecting");

      //get scatter in a global var, to use it for later actions
      scatter = ScatterJS.scatter;

      const requiredFields = {
          accounts: [network]
      };

      //get the user account's identity, show popup if its not connected yet
      scatter.getIdentity(requiredFields).then(async () => {
        _account = scatter.identity.accounts.find(
            x => x.blockchain === "eos" //get only eos bc accounts, because scatter is also used for other bcs as well other than eos 
        )
        console.log(_account);
        $('#lblAccount').text('Account: '+_account.name)

        // Get a proxy reference to eosjs which you can use to sign transactions with a user's Scatter.
        _eos = scatter.eos(network, eosjs_api.Api, {rpc});

        initialize()
      });

      window.ScatterJS = null; //after getiing details nullify scatter objecct, for security
    });
  }
  catch (error) {
    console.log(error);
  }



  /**
  * METHODS
  */
  async function initialize () {
    let blnc = await getTokenBalance(_account.name, 'TKN');

    $('#lblBalance').text('Token Balance: ' + blnc)
  }

  async function getTokenBalance (account, token_symbol) {
    let blnc = await rpc.get_currency_balance(contract, account, token_symbol);
    return blnc;
  }


  function createToken () {
    let supply = document.getElementById('txtToken').value;

    _eos.transact (
      {
        actions: [
          {
            account: contract,
            name: "create",
            authorization: [
                {
                  actor: _account.name,
                  permission: _account.authority
                }
            ],
            data: {
              issuer: _account.name,
              maximum_supply: supply,
            }
          }
        ]
      },
      {
        blocksBehind: 3,
        expireSeconds: 90
      }
    )
    .then(data => {
      alert('Token Created! Transaction Id. ' + data.transaction_id);
      console.log(data);
    })
    .catch(err => {
      console.log('Err '+ err);
    });
  }


  function issueToken () {
    let token = document.getElementById('txtIssueTokens').value;

    _eos.transact (
      {
        actions: [
          {
            account: contract,
            name: "issue",
            authorization: [
                {
                  actor: _account.name,
                  permission: _account.authority
                }
            ],
            data: {
              to: _account.name,
              quantity: token,
              memo: "issue memo",
            }
          }
        ]
      },
      {
        blocksBehind: 3,
        expireSeconds: 90
      }
    )
    .then(data => {
      alert('Token Issued! Transaction Id. ' + data.transaction_id);
      console.log(data);
    })
    .catch(err => {
      console.log('Err '+ err);
    });
  }


  function transferToken () {
    let token = document.getElementById('txtTransferTokens').value;

    _eos.transact (
      {
        actions: [
          {
            account: contract,
            name: "transfer",
            authorization: [
                {
                  actor: _account.name,
                  permission: _account.authority
                }
            ],
            data: {
              from: _account.name,
              to: "eostestingab",
              quantity: token,
              memo: "transfer memo",
            }
          }
        ]
      },
      {
        blocksBehind: 3,
        expireSeconds: 90
      }
    )
    .then(data => {
      alert('Token Tranfered! Transaction Id. ' + data.transaction_id);
      console.log(data);
    })
    .catch(err => {
      console.log('Err '+ err);
    });
  }
