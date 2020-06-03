const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../app.js");

chai.use(chaiHttp);

const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:9200" });

describe("testCPUs", () => {
	before(async () => {
		// indexing some data
		await client.index({
			index: "pc-components",
			body: {
				name: "testCPU",
				price: 365,
				type: "i5 10400",
			},
		});

		await client.index({
			index: "pc-components",
			body: {
				name: "testCPU",
				price: 343.85,
				type: "Ryzen 5 3600",
			},
		});

		await client.index({
			index: "pc-components",
			body: {
				name: "testRAM",
				price: 295,
				type: "DDR4 3200 2*16GB",
			},
		});
		// We need to force an index refresh at this point, otherwise we will not
		// get any result in the consequent search
		console.log("added testing docs");
	});
	after(async () => {
		await client.deleteByQuery({
			index: "pc-components",
			body: {
				query: {
					match: {
						name: "testCPU",
					},
				},
			},
		});
		await client.indices.refresh({ index: "pc-components" });
		console.log("deleted testing docs.");
	});

	/*
	 * Test the /GET route
	 */
	describe("/GET testCPUs", () => {
		it("it should GET all the CPUs", async () => {
			const res = await chai.request(server).get("/components/testCPU");
			res.should.have.status(200);
			res.body.count.should.to.equal(2);
			res.body.components.should.to.be.a("array");
		});
	});
});
