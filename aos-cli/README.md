[![Build Status](https://travis-ci.org/aoschain/aos-cli.png?branch=master)](https://travis-ci.org/aoschain/aos-cli)
[![Author](https://img.shields.io/badge/author-@aoschain-blue.svg?style=flat)](http://github.com/aoschain)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg?style=flat)](http://aoschain.mit-license.org)
[![NpmDownload Status](http://img.shields.io/npm/dm/aos-cli.svg)](https://www.npmjs.org/package/aos-cli)
[![NPM Version](https://img.shields.io/npm/v/aos-cli.svg?style=flat)](https://www.npmjs.org/package/aos-cli)
- - -

# aos Client

A command line interface for bootstrapping and managing [aos](https://github.com/aoschain) blockchain apps.

## Installation

由于依赖的inquirer模块在低版本node下存在bug
最新的dapps系列子命令要求node版本号为v8.4.0以上

```
npm install -g aos-cli
```

如在某些Linux发行版运行 aos-cli 报类似错“/usr/bin/env: ‘node’: No such file or directory”，即node版本过低或缺少node，可先执行：

```
npm install -g n
n stable
```

## Usage

```
./bin/aos-cli --help

  Usage: aos-cli [options] [command]


  Commands:

    getheight                              get block height
    getblockstatus                         get block status
    openaccount [secret]                   open your account and get the infomation by secret
    openaccountbypublickey [publickey]     open your account and get the infomation by publickey
    getbalance [address]                   get balance by address
    getaccount [address]                   get account by address
    getvoteddelegates [options] [address]  get delegates voted by address
    getdelegatescount                      get delegates count
    getdelegates [options]                 get delegates
    getvoters [publicKey]                  get voters of a delegate by public key
    getdelegatebypublickey [publicKey]     get delegate by public key
    getdelegatebyusername [username]       get delegate by username
    getblocks [options]                    get blocks
    getblockbyid [id]                      get block by id
    getblockbyheight [height]              get block by height
    getpeers [options]                     get peers
    getunconfirmedtransactions [options]   get unconfirmed transactions
    gettransactions [options]              get transactions
    gettransaction [id]                    get transactions
    sendmoney [options]                    send money to some address
    registerdelegate [options]             register delegate
    upvote [options]                       vote for delegates
    downvote [options]                     cancel vote for delegates
    setsecondsecret [options]              set second secret
    registerdapp [options]                 register a dapp
    contract [options]                     contract operations
    crypto [options]                       crypto operations
    dapps [options]                        manage your dapps
    creategenesis [options]                create genesis block
    peerstat                               analyze block height of all peers
    delegatestat                           analyze delegates status
    ipstat                                 analyze peer ip info

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -H, --host <host>  Specify the hostname or ip of the node, default: 127.0.0.1
    -P, --port <port>  Specify the port of the node, default: 4096
    -M, --main         Specify the mainnet, default: false
```

## Documents

[aos-docs](https://github.com/aoschain/aos-docs)
