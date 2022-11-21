const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

// Auxilary Functions
function now() {
    return Math.floor(new Date().getTime() / 1000);
}
const delay = ms => new Promise(res => setTimeout(res, ms));

describe("Tweet contract", function () {
    async function deployTweetFixture() {
        const [owner, addr1, addr2 ] = await ethers.getSigners();
        const Tweet = await ethers.getContractFactory("Tweet");
        const hardhatTweet = await Tweet.deploy();
        await hardhatTweet.deployed();
        return { Tweet, hardhatTweet, owner, addr1, addr2 };
    }

    describe("PostTweet", function () {
        it("Should create tweet", async function() {
            const { hardhatTweet, owner } = await loadFixture(deployTweetFixture);
            let time = now();
            await hardhatTweet.PostTweet("My First Tweet!", time);
            
            expect(await hardhatTweet.GetTweetMessage(0)).to.equal("My First Tweet!");
            expect(await hardhatTweet.GetTweetOwner(0)).to.equal(owner.address);
            expect(await hardhatTweet.GetTweetTime(0)).to.equal(time);
            expect(await hardhatTweet.GetTweetVisibility(0)).to.equal(true);
            expect(await hardhatTweet.GetTweetEdited(0)).to.equal(false);
            expect(await hardhatTweet.GetTweetLength() == 1);
        });

        it("Should emit NewTweet events", async function () {
            const { hardhatTweet, owner } = await loadFixture(deployTweetFixture);
            let time = now(); 
            await expect(hardhatTweet.PostTweet("My First Tweet!", time))
                .to.emit(hardhatTweet, "NewTweetEvent")
                .withArgs("My First Tweet!", owner.address, time, 0);
        });

        it("Should Fail on empty message", async function () {
            const { hardhatTweet } = await loadFixture(deployTweetFixture);
            await expect(
                hardhatTweet.PostTweet("", now())
            ).to.be.revertedWith("Tweet cannot be empty.");
            expect(await hardhatTweet.GetTweetLength() == 0);
        });

        it("Should Fail on too long message", async function () {
            const { hardhatTweet } = await loadFixture(deployTweetFixture);
            await expect(
                hardhatTweet.PostTweet("ezsxdfcgvhbezwsxdrcfvghbjnwaesrxdvgybhjnkwaesrdfvghbjnkesrdctvgybhjnkmexrdctfvgbhjnkmlewrxctvfgybhjnkmsexdrfvghbjnkmzesxdrcfgvhbjnkwexrctfvygbhu", now())
            ).to.be.revertedWith("Tweet is too long.");
            expect(await hardhatTweet.GetTweetLength() == 0);
        });

        it("Should create several tweets correctly", async function () {
            const { hardhatTweet, owner, addr1 } = await loadFixture(deployTweetFixture);
            
            let time1 = now();
            await hardhatTweet.PostTweet("My First Tweet!", time1);
            delay(2000);
            let time2 = now();
            await hardhatTweet.connect(addr1).PostTweet("My Second Tweet!", time2);

            expect(await hardhatTweet.GetTweetMessage(0)).to.equal("My First Tweet!");
            expect(await hardhatTweet.GetTweetOwner(0)).to.equal(owner.address);
            expect(await hardhatTweet.GetTweetTime(0)).to.equal(time1);
            expect(await hardhatTweet.GetTweetVisibility(0)).to.equal(true);
            expect(await hardhatTweet.GetTweetLength() == 1);

            expect(await hardhatTweet.GetTweetMessage(1)).to.equal("My Second Tweet!");
            expect(await hardhatTweet.GetTweetOwner(1)).to.equal(addr1.address);
            expect(await hardhatTweet.GetTweetTime(1)).to.equal(time2);
            expect(await hardhatTweet.GetTweetVisibility(1)).to.equal(true);
            expect(await hardhatTweet.GetTweetLength() == 2);
        });
    });

    describe("DeleteTweet", function () {
        it("Should Delete Tweet", async function () {
            const { hardhatTweet } = await loadFixture(deployTweetFixture);
            await hardhatTweet.PostTweet("My First Tweet!", now());
            await hardhatTweet.DeleteTweet(0);
            expect(await hardhatTweet.GetTweetVisibility(0)).to.equal(false);
            expect(await hardhatTweet.GetTweetLength() == 1);
        });

        it("Should emit DeleteTweet Event", async function () {
            const { hardhatTweet } = await loadFixture(deployTweetFixture);
            await hardhatTweet.PostTweet("My First Tweet!", now());
            await expect(hardhatTweet.DeleteTweet(0))
                .to.emit(hardhatTweet, "DeleteTweetEvent")
                .withArgs(0);
        });

        it("Should Fail on Delete Tweet of non-owner", async function () {
            const { hardhatTweet, addr1 } = await loadFixture(deployTweetFixture);
            await hardhatTweet.PostTweet("My First Tweet!", now());
            await expect(
                hardhatTweet.connect(addr1).DeleteTweet(0)
            ).to.be.revertedWith("Ownable: caller is not the owner");
            expect(await hardhatTweet.GetTweetLength() == true);
        });
    });

    describe("EditTweet", function () {
        it("Should Edit Tweet", async function () {
            const { hardhatTweet } = await loadFixture(deployTweetFixture);
            await hardhatTweet.PostTweet("My First Tweet!", now());
            await hardhatTweet.EditTweet(0, "I changed this!");
            expect(await hardhatTweet.GetTweetMessage(0)).to.equal("I changed this!");
            expect(await hardhatTweet.GetTweetEdited(0)).to.equal(true);
            expect(await hardhatTweet.GetTweetLength() == 1);
        });

        it("Should emit EditTweet Event", async function () {
            const { hardhatTweet } = await loadFixture(deployTweetFixture);
            await hardhatTweet.PostTweet("My First Tweet!", now());
            await expect(hardhatTweet.EditTweet(0, "I changed this!"))
                .to.emit(hardhatTweet, "EditTweetEvent")
                .withArgs("I changed this!", 0);
        });

        it("Should Fail on Edit Tweet of non-owner", async function () {
            const { hardhatTweet, addr1 } = await loadFixture(deployTweetFixture);
            await hardhatTweet.PostTweet("My First Tweet!", now());
            await expect(
                hardhatTweet.connect(addr1).EditTweet(0, "I changed this!")
            ).to.be.revertedWith("Ownable: caller is not the owner");
            expect(await hardhatTweet.GetTweetEdited(0) == false);
        });

        it("Should Fail on Edit Tweet empty message", async function () {
            const { hardhatTweet } = await loadFixture(deployTweetFixture);
            await hardhatTweet.PostTweet("My First Tweet!", now());
            await expect(
                hardhatTweet.EditTweet(0, "")
            ).to.be.revertedWith("Tweet cannot be empty.");
            expect(await hardhatTweet.GetTweetEdited(0) == false);
        });

        it("Should Fail on Edit Tweet message too long", async function () {
            const { hardhatTweet } = await loadFixture(deployTweetFixture);
            await hardhatTweet.PostTweet("My First Tweet!", now());
            await expect(
                hardhatTweet.EditTweet(0, "ezsxdfcgvhbezwsxdrcfvghbjnwaesrxdvgybhjnkwaesrdfvghbjnkesrdctvgybhjnkmexrdctfvgbhjnkmlewrxctvfgybhjnkmsexdrfvghbjnkmzesxdrcfgvhbjnkwexrctfvygbhu")
            ).to.be.revertedWith("Tweet is too long.");
            expect(await hardhatTweet.GetTweetEdited(0) == false);
        });
    });

    describe("All features together", function () {
        it("Big Test: 4 tweets, 1 Delete, 1 Edit, 6 Fails", async function () {
            const { hardhatTweet, owner, addr1, addr2 } = await loadFixture(deployTweetFixture);
            // Setup, calling functions (some purposefully failing)            
            let time1 = now();
            await expect(hardhatTweet.PostTweet("My First Tweet!", time1))
                .to.emit(hardhatTweet, "NewTweetEvent")
                .withArgs("My First Tweet!", owner.address, time1, 0);

            await expect(hardhatTweet.PostTweet("", now()))
                .to.be.revertedWith("Tweet cannot be empty.");

            await expect(
                hardhatTweet.EditTweet(0, "")
            ).to.be.revertedWith("Tweet cannot be empty.");

            let time2 = now();
            await expect(hardhatTweet.PostTweet("My Second Tweet!", time2))
                .to.emit(hardhatTweet, "NewTweetEvent")
                .withArgs("My Second Tweet!", owner.address, time2, 1);

            await expect(
                hardhatTweet.PostTweet("ezsxdfcgvhbezwsxdrcfvghbjnwaesrxdvgybhjnkwaesrdfvghbjnkesrdctvgybhjnkmexrdctfvgbhjnkmlewrxctvfgybhjnkmsexdrfvghbjnkmzesxdrcfgvhbjnkwexrctfvygbhu", now())
            ).to.be.revertedWith("Tweet is too long.");

            await expect(
                hardhatTweet.EditTweet(0, "ezsxdfcgvhbezwsxdrcfvghbjnwaesrxdvgybhjnkwaesrdfvghbjnkesrdctvgybhjnkmexrdctfvgbhjnkmlewrxctvfgybhjnkmsexdrfvghbjnkmzesxdrcfgvhbjnkwexrctfvygbhu")
            ).to.be.revertedWith("Tweet is too long.");

            let time3 = now();
            await expect(hardhatTweet.connect(addr1).PostTweet("My Third Tweet!", time3))
                .to.emit(hardhatTweet, "NewTweetEvent")
                .withArgs("My Third Tweet!", addr1.address, time3, 2);

            await expect(hardhatTweet.connect(addr1).DeleteTweet(1))
                .to.be.revertedWith("Ownable: caller is not the owner");

            await expect(hardhatTweet.connect(owner).DeleteTweet(1))
                .to.emit(hardhatTweet, "DeleteTweetEvent")
                .withArgs(1);

            let time4 = now();
            await expect(hardhatTweet.connect(addr2).PostTweet("My Fourth Tweet!", time4))
                .to.emit(hardhatTweet, "NewTweetEvent")
                .withArgs("My Fourth Tweet!", addr2.address, time4, 3);

            await expect(hardhatTweet.connect(addr2).EditTweet(1, "I changed this!"))
                .to.be.revertedWith("Ownable: caller is not the owner");

            await expect(hardhatTweet.connect(addr2).EditTweet(3, "My Fourth Edited Tweet!"))
                .to.emit(hardhatTweet, "EditTweetEvent")
                .withArgs("My Fourth Edited Tweet!", 3);

            // Check all data
            expect(await hardhatTweet.GetTweetMessage(0)).to.equal("My First Tweet!");
            expect(await hardhatTweet.GetTweetOwner(0)).to.equal(owner.address);
            expect(await hardhatTweet.GetTweetTime(0)).to.equal(time1);
            expect(await hardhatTweet.GetTweetVisibility(0)).to.equal(true);
            expect(await hardhatTweet.GetTweetEdited(0)).to.equal(false);

            expect(await hardhatTweet.GetTweetMessage(1)).to.equal("My Second Tweet!");
            expect(await hardhatTweet.GetTweetOwner(1)).to.equal(owner.address);
            expect(await hardhatTweet.GetTweetTime(1)).to.equal(time2);
            expect(await hardhatTweet.GetTweetVisibility(1)).to.equal(false);
            expect(await hardhatTweet.GetTweetEdited(1)).to.equal(false);

            expect(await hardhatTweet.GetTweetMessage(2)).to.equal("My Third Tweet!");
            expect(await hardhatTweet.GetTweetOwner(2)).to.equal(addr1.address);
            expect(await hardhatTweet.GetTweetTime(2)).to.equal(time3);
            expect(await hardhatTweet.GetTweetVisibility(2)).to.equal(true);
            expect(await hardhatTweet.GetTweetEdited(2)).to.equal(false);

            expect(await hardhatTweet.GetTweetMessage(3)).to.equal("My Fourth Edited Tweet!");
            expect(await hardhatTweet.GetTweetOwner(3)).to.equal(addr2.address);
            expect(await hardhatTweet.GetTweetTime(3)).to.equal(time4);
            expect(await hardhatTweet.GetTweetVisibility(3)).to.equal(true);
            expect(await hardhatTweet.GetTweetEdited(3)).to.equal(true);

            expect(await hardhatTweet.GetTweetLength() == 4);
        });
    });
});

/*
const { expect } = require("chai");

describe("Tweet contract", function () {
    it("Should create tweet", async function() {
        const [owner] = await ethers.getSigners();
        const Tweet = await ethers.getContractFactory("Tweet");
        const hardhatTweet = await Tweet.deploy();

        let time = now();
        let myTweet = hardhatTweet.PostTweet("My First Tweet!", time);

        myTweet.then( async () => {
            expect(await hardhatTweet.GetTweetMessage(0)).to.equal("My First Tweet!");
            expect(await hardhatTweet.GetTweetOwner(0)).to.equal(owner.address);
            expect(await hardhatTweet.GetTweetTime(0)).to.equal(time);
            expect(await hardhatTweet.GetTweetVisibility(0)).to.equal(true);
            expect(hardhatTweet.tweets.length == 1);
        }).catch((err) => console.log(err))
    });

    // Delete Test1
    let myTweet = hardhatTweet.PostTweet("My First Tweet!", now());
    myTweet.then( async () => {
        await expect(hardhatTweet.DeleteTweet(0))
            .to.emit(hardhatTweet, "DeleteTweetEvent")
            .withArgs(0);
    }).catch((err) => console.log(err))

    // Delete Test2
    let myTweet = hardhatTweet.PostTweet("My First Tweet!", now());
    myTweet.then( async () => {
        hardhatTweet.DeleteTweet(0);
    }).then( async () => {
        expect(await hardhatTweet.GetTweetVisibility(0)).to.equal(false);
        expect(hardhatTweet.tweets.length == 1);
    }).catch((err) => console.log(err))
});
*/