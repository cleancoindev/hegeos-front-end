import { Api, JsonRpc } from 'eosjs';

class EosService {

    static ualActiveUser;

    static async getTableRows(endpoint, contractName, table, req0, scope) {
        const rpc = new JsonRpc(endpoint);
        try {
            let req = {
                json: true,
                code: contractName,
                scope: scope || contractName,
                table,
                reverse: false,
                show_payer: false, 
            }
            if (typeof req0 === 'object' && req0 !== null) {
                Object.keys(req0).forEach((key) => {
                    req[key] = req0[key];
                });
            }
            const result = await rpc.get_table_rows(req);
            return result;
        } catch (err) {
            throw err;
        }
    }

    static async getNodeTableRows(contractName, table, req0, scope) {
        return EosService.getTableRows(process.env.REACT_APP_NODE_ENDPOINT, contractName, table, req0, scope);
    }

    static async getEosTableRows(contractName, table, req0, scope) {
        return EosService.getTableRows(process.env.REACT_APP_EOS_ENDPOINT, contractName, table, req0, scope);
    }

    static async getPoolTableRows(table, req0, scope) {
        return EosService.getNodeTableRows(process.env.REACT_APP_POOL_CONTRACT_NAME, table, req0, scope);
    }

    static async getOptionTableRows(table, req0, scope) {
        return EosService.getNodeTableRows(process.env.REACT_APP_OPTION_CONTRACT_NAME, table, req0, scope);
    }

    static async getLPTableRows(table, req0, scope) {
        return EosService.getNodeTableRows(process.env.REACT_APP_LP_CONTRACT_NAME, table, req0, scope);
    }

    static async getBalance(endpoint, contractName, currencySymbol) {
        const account = EosService.accountName();
        //console.log('accountName:', account);
        if (!account) {
            return ['0 ' + currencySymbol];
        }
        const rpc = new JsonRpc(endpoint);
        try {
            const result = await rpc.get_currency_balance(contractName, account, currencySymbol);
            return result;
        } catch (err) {
            throw err;
        }
    }

    static async getCurrencyBalance(currency) {
        return new Promise((resolve, reject) => {
            //console.log('endpoint:', process.env.REACT_APP_NODE_ENDPOINT);
            const contractName = currency === 'EOS' ? 'eosio.token' : process.env.REACT_APP_LP_CONTRACT_NAME;
            //console.log('contract:', contractName);
            //console.log('currency:', currency);
            EosService.getBalance(
                process.env.REACT_APP_NODE_ENDPOINT, 
                contractName,
                currency
            )
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    static async getUSDCBalance() {
        return new Promise((resolve, reject) => {
            EosService.getBalance(
                process.env.REACT_APP_NODE_ENDPOINT, 
                process.env.REACT_APP_LP_CONTRACT_NAME,
                'USDC'
            )
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    static async getDAIBalance() {
        return new Promise((resolve, reject) => {
            EosService.getBalance(
                process.env.REACT_APP_NODE_ENDPOINT, 
                process.env.REACT_APP_LP_CONTRACT_NAME,
                'DAI'
            )
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    static async getEOSBalance() {
        return new Promise((resolve, reject) => {
            EosService.getBalance(
                process.env.REACT_APP_NODE_ENDPOINT, 
                'eosio.token',
                'EOS'
            )
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    static async invokeAction(action, contractName, dataValue, transferData, transferContract) {
        const rpc = new JsonRpc(process.env.REACT_APP_NODE_ENDPOINT);
        let actions = [];
        const actor = EosService.ualActiveUser ? EosService.ualActiveUser.accountName : localStorage.getItem('name_account');
        const permission = EosService.ualActiveUser ? EosService.ualActiveUser.requestPermission : localStorage.getItem('account_permission');
        if (transferData) {
            //console.log('transderData:', transferData);
            actions.push({
                account: (transferContract || 'eosio.token'),
                name: 'transfer',
                authorization: [{actor, permission}],
                data: transferData
            });
        }
        actions.push({
            account: contractName,
            name: action,
            authorization: [{actor, permission}],
            data: dataValue
        });
        console.log('actions:', actions);
        if (EosService.ualActiveUser) {
            try {
                const result = await EosService.ualActiveUser.signTransaction(
                    {
                        actions
                    },
                    {
                        blocksBehind: 3,
                        expireSeconds: 30
                    }
                );
                return result;
            } catch (err) {
                throw err;
            }
        }
        const privateKey = localStorage.getItem('private_key');
        const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig'); // development only
        //console.log('privateKey:', privateKey);
        const signatureProvider = new JsSignatureProvider([privateKey]);
        const api = new Api({
            rpc,
            signatureProvider,
            textDecoder: new TextDecoder(),
            textEncoder: new TextEncoder()
        });
        //console.log('dataValue:', dataValue);
        try {
            const result = await api.transact(
                {
                    actions
                },
                {
                    blocksBehind: 3,
                    expireSeconds: 30
                }
            );
            return result;
        } catch (err) {
            throw err;
        }
    }

    static async invokePoolAction(action, dataValue, transferData, transferContract) {
        return EosService.invokeAction(action, process.env.REACT_APP_POOL_CONTRACT_NAME, dataValue, transferData, transferContract);
    }

    static async invokeOptionAction(action, dataValue, transferData, transferContract) {
        return EosService.invokeAction(action, process.env.REACT_APP_OPTION_CONTRACT_NAME, dataValue, transferData, transferContract);
    }

    static login(acc, key, permission) {
        return new Promise((resolve, reject) => {
            localStorage.setItem('name_account', acc);
            localStorage.setItem('private_key', key);
            localStorage.setItem('account_permission', permission);
            resolve();
        });
    }

    static logout() {
        return new Promise((resolve, reject) => {
            localStorage.removeItem('name_account');
            localStorage.removeItem('private_key');
            localStorage.removeItem('account_permission');
            resolve();
        });
    }

    static isLoggedIn(props) {
        EosService.ualActiveUser = props && props.ual && props.ual.activeUser;
        return EosService.ualActiveUser || (
            localStorage.getItem('name_account') && 
            localStorage.getItem('private_key') && 
            localStorage.getItem('account_permission')
        );
    }

    static accountName() {
        if (EosService.ualActiveUser) {
            //console.log('EosService.ualActiveUser:', EosService.ualActiveUser);
            return EosService.ualActiveUser.accountName;
        }
        return localStorage.getItem('name_account');
    }

    static accountPermission() {
        if (EosService.ualActiveUser) {
            return EosService.ualActiveUser.requestPermission;
        }
        return localStorage.getItem('account_permission');
    }

    static usdPrice() {
        return new Promise((resolve, reject) => {
            const usdc_id = 12; //1255;
            const dai_id = 12; //1239;
            const lower_bound = Math.min(usdc_id, dai_id);
            const upper_bound = Math.max(usdc_id, dai_id);
            const limit = upper_bound + 1 - lower_bound;            
            EosService.getEosTableRows(
                'swap.defi',
                'pairs',
                {
                    lower_bound,
                    upper_bound,
                    limit,
                }
            )
            .then(result => {
                let price = {};
                result.rows.forEach(row => {
                    //console.log('row:', row);
                    if (row.id === dai_id) {
                        price.dai = parseFloat(row.price0_last); //parseFloat(row.price1_last);
                    }
                    if (row.id === usdc_id) {
                        price.usdc = parseFloat(row.price0_last); //parseFloat(row.price1_last);
                    }
                });
                resolve(price);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    static optionConfig() {
        return new Promise((resolve, reject) => {
            EosService.getOptionTableRows(
                process.env.REACT_APP_OPTION_CONFIG_TABLE,
                {
                    limit: 1
                }
            )
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });  
        });
    }

    static optionList(limit) {
        return new Promise((resolve, reject) => {
            EosService.getOptionTableRows(
                'options',
                {
                    reverse: true,
                    limit: (limit || 100)
                }
            )
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    static poolStat() {
        return new Promise((resolve, reject) => {
            EosService.getPoolTableRows(
                'tokenstat1',
                {
                    limit: 1
                }
            )
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });             
        });
    }

    static hegeosStat() {
        return new Promise((resolve, reject) => {
            EosService.getLPTableRows(
                'stat',
                {
                    limit: 1
                },
                process.env.REACT_APP_HEGEOS_SYMBOL
            )
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });             
        });
    }

    static optionCreate(amount, strike, period, optiontype, feein, transferAmount) {
        return new Promise((resolve, reject) => {
            const account = EosService.accountName();
            EosService.invokeOptionAction(
                'create',
                {
                    account,
                    amount,
                    strike,
                    period,
                    optiontype,
                    feein
                },
                {
                    from: account,
                    to: process.env.REACT_APP_OPTION_CONTRACT_NAME,
                    quantity: transferAmount,
                    memo: ''
                },
                process.env.REACT_APP_LP_CONTRACT_NAME
            )
            .then(result => {
                console.log('result:', result);
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    static optionCreateCurr(amount, strike, period, optiontype, currency, fee) {
        //let a = amount.split(' ');
        //const transferAmount = parseFloat(a[0]) * marketPrice; // ???
        //console.log('amount:', amount, 'marketPrice:', marketPrice, 'transferAmount:', transferAmount);
        console.log('fee:', fee);
        const fee_ex = fee * 1.01;
        console.log('fee + 1%:', fee_ex);
        return EosService.optionCreate(amount, strike, period, optiontype, 
            '6,'+currency, fee_ex.toFixed(6)+' '+currency);
    }

    static optionCreateUSDC(amount, strike, period, optiontype, fee) {
        //let a = amount.split(' ');
        //const transferAmount = parseFloat(a[0]) * marketPrice; // ???
        return EosService.optionCreate(amount, strike, period, optiontype, 
            '6,USDC', fee.toFixed(6)+' USDC');
    }

    static optionCreateDAI(amount, strike, period, optiontype, fee) {
        //let a = amount.split(' ');
        //const transferAmount = parseFloat(a[0]) * marketPrice; // ???
        return EosService.optionCreate(amount, strike, period, optiontype, 
            '6,DAI', fee.toFixed(6)+' DAI');
    }

    static optionExercise(optionid, profitsym) {
        return new Promise((resolve, reject) => {
            EosService.invokeOptionAction(
                'exercise',
                {
                    optionid,
                    profitsym
                }
            )
            .then(result => {
                //console.log('result:', result);
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    static optionExerciseCurr(optionid, currency) {
        const precision = currency === 'EOS' ? '4' : '6';
        return EosService.optionExercise(optionid, precision+','+currency);
    }

    static optionExerciseUSDC(optionid) {
        return EosService.optionExercise(optionid, '6,USDC');
    }

    static optionExerciseDAI(optionid) {
        return EosService.optionExercise(optionid, '6,DAI');
    }

    static optionExerciseEOS(optionid) {
        return EosService.optionExercise(optionid, '4,EOS');
    }

    static poolDeposit(amount, minmint) {
        return new Promise((resolve, reject) => {
            const account = EosService.accountName();
            EosService.invokePoolAction(
                'addliquidity', 
                {
                    account,
                    amount, 
                    minmint
                },
                {
                    from: account,
                    to: process.env.REACT_APP_POOL_CONTRACT_NAME,
                    quantity: amount,
                    memo: ''
                }                
            ) // !!!
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    static poolWithdraw(amount, maxburn) {
        return new Promise((resolve, reject) => {
            const account = EosService.accountName();
            EosService.invokePoolAction(
                'withdraw',
                {
                    account,
                    amount,
                    maxburn
                },
                {
                    from: account,
                    to: process.env.REACT_APP_POOL_CONTRACT_NAME,
                    quantity: maxburn,
                    memo: ''
                },
                process.env.REACT_APP_LP_CONTRACT_NAME
            )
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
        });
    }
}

export default EosService;