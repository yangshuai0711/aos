"use strict";

// Requires and node configuration
var node = require("./../variables.js");
var genesisblock = require("../../genesisBlock.json");

var block = {
    blockHeight : 0,
    id : 0,
    generatorPublicKey : "",
    totalAmount : 0,
    totalFee : 0
};

var testBlocksUnder21 = 0;

describe("POST /accounts/open", function () {

    it("When payload is over 2Mb. Should fail", function (done) {
        node.api.post("/accounts/open")
            .set("Accept", "application/json")
            .send({
                payload: new Buffer(8 * 1000 * 1000).toString()
            })
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                console.log(JSON.stringify(res.body));
                node.expect(res.body).to.have.property("success").to.be.false;
                node.expect(res.body).to.have.property("error").to.equal("Error: request entity too large");
                // node.expect(res.body.error).to.have.property("limit").to.equal(2097152);
                done();
            });
    });
});

describe("GET /peers/version", function () {

    it("Should be ok", function (done) {
        node.api.get("/peers/version")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                // console.log(JSON.stringify(res.body));
                node.expect(res.body).to.have.property("success").to.be.true;
                node.expect(res.body).to.have.property("build").to.be.a("string");
                node.expect(res.body).to.have.property("version").to.be.a("string");
                done();
            });
    });
});

describe("GET /peers", function () {

    it("Using empty parameters. Should fail", function (done) {
        var state = "", os = "", shared = "", version = "", limit = "", offset = 0, orderBy = "";
        node.api.get("/peers?state="+state+"&os="+os+"&shared="+true+"&version="+version+"&limit="+limit+"&offset="+offset+"orderBy="+orderBy)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                // console.log(JSON.stringify(res.body));
                node.expect(res.body).to.have.property("success").to.be.false;
                node.expect(res.body).to.have.property("error");
                done();
            });
    });

    it("Using state. Should be ok", function (done) {
        var state = 1;
        node.api.get("/peers?state="+state)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                // console.log(JSON.stringify(res.body));
                node.expect(res.body).to.have.property("success").to.be.true;
                node.expect(res.body).to.have.property("peers").that.is.an("array");
                if (res.body.peers.length > 0) {
                    for (var i = 0; i < res.body.peers.length; i++) {
                       node.expect(res.body.peers[i].state).to.equal(parseInt(state));
                    }
                }
                done();
            });
    });

    it("Using limit. Should be ok", function (done) {
        var limit = 3, offset = 0;
        node.api.get("/peers?&limit="+limit+"&offset="+offset)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                // console.log(JSON.stringify(res.body));
                node.expect(res.body).to.have.property("success").to.be.true;
                node.expect(res.body).to.have.property("peers").that.is.an("array");

                // To check it need to have peers
                node.expect(res.body.peers.length).to.be.at.most(limit);
                done();
            });
    });

    it("Using orderBy. Should be ok", function (done) {
        var orderBy = "state:desc";
        node.api.get("/peers?orderBy="+orderBy)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                // console.log(JSON.stringify(res.body));
                node.expect(res.body).to.have.property("success").to.be.true;
                node.expect(res.body).to.have.property("peers").that.is.an("array");

                if (res.body.peers.length > 0) {
                    for (var i = 0; i < res.body.peers.length; i++) {
                        if (res.body.peers[i+1] != null) {
                            node.expect(res.body.peers[i+1].state).to.at.most(res.body.peers[i].state);
                        }
                    }
                }

                done();
            });

    });

    it("Using limit > 100. Should fail", function (done) {
        var limit = 21;
        node.api.get("/peers?&limit="+limit)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                // console.log(JSON.stringify(res.body));
                node.expect(res.body).to.have.property("success").to.be.false;
                node.expect(res.body).to.have.property("error");
                done();
            });
    });

    it("Using invalid parameters. Should fail", function (done) {
        var state = "invalid", os = "invalid", shared = "invalid", version = "invalid", limit = "invalid", offset = "invalid", orderBy = "invalid";
        node.api.get("/peers?state="+state+"&os="+os+"&shared="+shared+"&version="+version+"&limit="+limit+"&offset="+offset+"orderBy="+orderBy)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                // console.log(JSON.stringify(res.body));
                node.expect(res.body).to.have.property("success").to.be.false;
                node.expect(res.body).to.have.property("error");
                done();
            });
    });
});

describe("GET /blocks/getHeight", function () {

    it("Should be ok", function (done) {
        node.api.get("/blocks/getHeight")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                // console.log(JSON.stringify(res.body));
                node.expect(res.body).to.have.property("success").to.be.true;
                if (res.body.success == true && res.body.height != null) {
                    node.expect(res.body).to.have.property("height").to.be.above(0);
                    if (res.body.success == true) {
                        block.blockHeight = res.body.height;
                        if (res.body.height > 100) {
                            testBlocksUnder21 = true;
                        }
                    }
                } else {
                    console.log("Request failed or height is null");
                }
                done();
            });
    });
});

describe("GET /blocks/getFee", function () {

    it("Should be ok", function (done) {
        node.api.get("/blocks/getFee")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                // console.log(JSON.stringify(res.body));
                node.expect(res.body).to.have.property("success").to.be.true;
                if (res.body.success == true && res.body.fee != null) {
                    node.expect(res.body).to.have.property("fee");
                    node.expect(res.body.fee).to.equal(node.Fees.transactionFee);
                } else {
                    console.log("Request failed or fee is null");
                }
                done();
            });
    });
});

describe("GET /blocks/getFees", function () {

    it.skip("Should be ok", function (done) {
        node.api.get("/blocks/getFees")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
            // console.log(JSON.stringify(res.body));
            node.expect(res.body).to.have.property("success").to.be.true;
            if (res.body.success == true && res.body.fees != null) {
                node.expect(res.body).to.have.property("fees");
                node.expect(res.body.fees.send).to.equal(node.Fees.transactionFee);
                node.expect(res.body.fees.vote).to.equal(node.Fees.voteFee);
                node.expect(res.body.fees.dapp).to.equal(node.Fees.dappAddFee);
                node.expect(res.body.fees.secondsignature).to.equal(node.Fees.secondPasswordFee);
                node.expect(res.body.fees.delegate).to.equal(node.Fees.delegateRegistrationFee);
                node.expect(res.body.fees.multisignature).to.equal(node.Fees.multisignatureRegistrationFee);
            } else {
              console.log("Request failed or fees is null");
            }
            done();
          });
    });
});

describe("GET /blocks/getMagic", function () {

    it.skip("Get blockchain magic. Should be ok", function (done) {
        node.api.get("/blocks/getMagic")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                // console.log(JSON.stringify(res.body));
                node.expect(res.body).to.have.property("success").to.be.true;
                if (res.body.success == true && res.body.magic != null) {
                    node.expect(res.body).to.have.property("magic");
                    node.expect(res.body.magic).to.equal(node.config.magic);
                } else {
                    console.log("Request failed or magic is null");
                }
                done();
            });
    });
});

describe("GET /blocks", function () {

    it("Using height. Should be ok", function (done) {
        var height = block.blockHeight, limit = 100, offset = 0;
        node.api.get("/blocks?height="+height+"&limit="+limit+"&offset="+offset)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                // console.log(JSON.stringify(res.body));
                node.expect(res.body).to.have.property("success").to.be.true;
                if (res.body.success == true && res.body.blocks != null) {
                    node.expect(res.body).to.have.property("blocks").that.is.an("array");
                    node.expect(res.body).to.have.property("count").to.equal(1);
                    node.expect(res.body.blocks.length).to.equal(1);
                    node.expect(res.body.blocks[0]).to.have.property("previousBlock");
                    node.expect(res.body.blocks[0]).to.have.property("totalAmount");
                    node.expect(res.body.blocks[0]).to.have.property("totalFee");
                    node.expect(res.body.blocks[0]).to.have.property("generatorId");
                    node.expect(res.body.blocks[0]).to.have.property("confirmations");
                    node.expect(res.body.blocks[0]).to.have.property("blockSignature");
                    node.expect(res.body.blocks[0]).to.have.property("numberOfTransactions");
                    node.expect(res.body.blocks[0].height).to.equal(block.blockHeight);
                    block.id = res.body.blocks[0].id;
                    block.generatorPublicKey = res.body.blocks[0].generatorPublicKey;
                    block.totalAmount = res.body.blocks[0].totalAmount;
                    block.totalFee = res.body.blocks[0].totalFee;
                } else {
                    console.log("Request failed or blocks array is null");
                }
                done();
            });
    });

    it("Using height < 100. Should be ok", function (done) {
        if (testBlocksUnder21) {
            var height = 10;
            node.api.get("/blocks?height="+height)
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end(function (err, res) {
                    // console.log(JSON.stringify(res.body));
                    node.expect(res.body).to.have.property("success").to.be.true;
                    if (res.body.success == true && res.body.blocks != null) {
                        node.expect(res.body).to.have.property("count");
                        node.expect(res.body).to.have.property("blocks").that.is.an("array");
                        node.expect(res.body.blocks.length).to.equal(1);
                        node.expect(res.body.blocks[0]).to.have.property("previousBlock");
                        node.expect(res.body.blocks[0]).to.have.property("totalAmount");
                        node.expect(res.body.blocks[0]).to.have.property("totalFee");
                        node.expect(res.body.blocks[0]).to.have.property("generatorId");
                        node.expect(res.body.blocks[0]).to.have.property("confirmations");
                        node.expect(res.body.blocks[0]).to.have.property("blockSignature");
                        node.expect(res.body.blocks[0]).to.have.property("numberOfTransactions");
                        node.expect(res.body.blocks[0].height).to.equal(10);
                        block.id = res.body.blocks[0].id;
                        block.generatorPublicKey = res.body.blocks[0].generatorPublicKey;
                        block.totalAmount = res.body.blocks[0].totalAmount;
                        block.totalFee = res.body.blocks[0].totalFee;
                    } else {
                        console.log("Request failed or blocks array is null");
                    }
                    done();
                });
        } else {
            done();
        }
    });

    it("Using generatorPublicKey. Should be ok", function (done) {
        var generatorPublicKey = block.generatorPublicKey, limit = 100, offset = 0, orderBy = "";
        node.api.get("/blocks?generatorPublicKey="+generatorPublicKey+"&limit="+limit+"&offset="+offset)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                // console.log(JSON.stringify(res.body));
                node.expect(res.body).to.have.property("success").to.be.true;
                node.expect(res.body).to.have.property("blocks").that.is.an("array");
                for (var i = 0; i < res.body.blocks.length; i++) {
                    node.expect(res.body.blocks[i].generatorPublicKey).to.equal(block.generatorPublicKey);
                }
                done();
            });
    });

    it("Using totalFee. Should be ok", function (done) {
        var totalFee = block.totalFee, limit = 100, offset = 0;
        node.api.get("/blocks?totalFee="+totalFee+"&limit="+limit+"&offset="+offset)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                // console.log(JSON.stringify(res.body));
                node.expect(res.body).to.have.property("success").to.be.true;
                node.expect(res.body).to.have.property("blocks").that.is.an("array");
                for (var i = 0; i < res.body.blocks.length; i++) {
                    node.expect(res.body.blocks[i].totalFee).to.equal(block.totalFee);
                }
                done();
            });
    });

    it("Using totalAmount. Should be ok", function (done) {
        var totalAmount = block.totalAmount, limit = 100, offset = 0;
        node.api.get("/blocks?totalAmount="+totalAmount+"&limit="+limit+"&offset="+offset)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                // console.log(JSON.stringify(res.body));
                node.expect(res.body).to.have.property("success").to.be.true;
                node.expect(res.body).to.have.property("blocks").that.is.an("array");
                for (var i = 0; i < res.body.blocks.length; i++) {
                    node.expect(res.body.blocks[i].totalAmount).to.equal(block.totalAmount);
                }
                done();
            });
    });

    it("Using previousBlock. Should be ok", function (done) {
        if (block.id != null) {
            var previousBlock = block.id;
            node.onNewBlock(function (err) {
                node.expect(err).to.be.not.ok;
                node.api.get("/blocks?previousBlock="+previousBlock)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function (err, res) {
                        // console.log(JSON.stringify(res.body));
                        node.expect(res.body).to.have.property("success").to.be.true;
                        node.expect(res.body).to.have.property("blocks").that.is.an("array");
                        node.expect(res.body.blocks).to.have.length(1);
                        node.expect(res.body.blocks[0].previousBlock).to.equal(previousBlock);
                        done();
                    });
            });
        }
    });

    it("Using orderBy. Should be ok", function (done) {
        var orderBy = "height:desc";
        node.api.get("/blocks?orderBy="+orderBy)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                // console.log(JSON.stringify(res.body));
                node.expect(res.body).to.have.property("success").to.be.true;
                node.expect(res.body).to.have.property("blocks").that.is.an("array");
                for (var i = 0; i < res.body.blocks.length; i++) {
                    if (res.body.blocks[i+1] != null) {
                        node.expect(res.body.blocks[i].height).to.be.above(res.body.blocks[i+1].height);
                    }
                }
                done();
            });
    });
});

describe("GET /blocks/get?id=", function () {

    it("Using genesisblock id. Should be ok", function (done) {
        var genesisblockId = genesisblock.id;

        node.api.get("/blocks/get?id=" + genesisblockId)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                // console.log(JSON.stringify(res.body));
                node.expect(res.body).to.have.property("success").to.be.true;
                node.expect(res.body).to.have.property("block").to.be.a("object");
                node.expect(res.body.block).to.have.property("id").to.be.a("string");
                done();
            });
    });

    it("Using unknown id. Should be fail", function (done) {
        var unknownId = "9928719876370886655";

        node.api.get("/blocks/get?id=" + unknownId)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                // console.log(JSON.stringify(res.body));
                node.expect(res.body).to.have.property("success").to.be.false;
                node.expect(res.body).to.have.property("error").to.be.a("string");
                done();
            });
    });

    it("Using no id. Should be fail", function (done) {
        node.api.get("/blocks/get?id=" + null)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                // console.log(JSON.stringify(res.body));
                node.expect(res.body).to.have.property("success").to.be.false;
                node.expect(res.body).to.have.property("error").to.be.a("string");
                done();
            });
    });
});
