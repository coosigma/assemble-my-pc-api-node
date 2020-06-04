const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../app.js");

chai.use(chaiHttp);

const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:9200" });
const doc1 = {
	name: "testCPU",
	price: 365,
	type: "i5 10400",
};
const doc2 = {
	name: "testCPU",
	price: 343.85,
	type: "Ryzen 5 3600",
};
const doc3 = {
	name: "testRAM",
	price: 295,
	type: "DDR4 3200 2*16GB",
};

describe("testCPUs", () => {
	before(async () => {
		// indexing some data
		try {
			await client.index({
				index: "pc-components",
				id: "1",
				body: doc1,
			});
			await client.index({
				index: "pc-components",
				id: "2",
				body: doc2,
			});
			await client.index({
				index: "pc-components",
				id: "3",
				body: doc3,
			});
			// We need to force an index refresh at this point, otherwise we will not
			// get any result in the consequent search
			await client.indices.refresh({ index: "pc-components" });
		} catch (err) {
			console.log(err.meta);
		}
		console.log("added testing docs");
	});
	after(async () => {
		try {
			await client.delete({
				index: "pc-components",
				id: "1",
			});
			await client.delete({
				index: "pc-components",
				id: "2",
			});
			await client.delete({
				index: "pc-components",
				id: "3",
			});
		} catch (err) {
			console.log(err);
		}
		await client.indices.refresh({ index: "pc-components" });
		console.log("deleted testing docs.");
	});

	/*
	 * Test the /GET route of a component by ID
	 */
	describe("/GET testCPUs", () => {
		it("it should GET a CPU with ID 1", async () => {
			const res = await chai.request(server).get("/components/id/1");
			res.should.have.status(200);
			res.body.count.should.to.equal(1);
			res.body.component._source.should.to.eql(doc1);
		});
	});

	/*
	 * Test the /GET route of all components with the same name
	 */
	describe("/GET testCPUs", () => {
		it("it should GET all the CPUs", async () => {
			const res = await chai.request(server).get("/components/testCPU");
			res.should.have.status(200);
			res.body.count.should.to.equal(2);
			res.body.components[0]._source.should.to.eql(doc1);
			res.body.components[1]._source.should.to.eql(doc2);
		});
	});
});
