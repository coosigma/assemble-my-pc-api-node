"use strict";

const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:9200" });

async function run() {
	// Let's start by indexing some data
	await client.index({
		index: "pc-components",
		// type: '_doc', // uncomment this line if you are using {es} ≤ 6
		body: {
			name: "CPU",
			price: 365,
			type: "i5 10400",
		},
	});

	await client.index({
		index: "pc-components",
		body: {
			name: "CPU",
			price: 343.85,
			type: "Ryzen 5 3600",
		},
	});

	await client.index({
		index: "pc-components",
		body: {
			name: "RAM",
			price: 295,
			type: "DDR4 3200 2*16GB",
		},
	});

	// We need to force an index refresh at this point, otherwise we will not
	// get any result in the consequent search
	await client.indices.refresh({ index: "pc-components" });

	// Let's search!
	const { body } = await client.search({
		index: "pc-components",
		body: {
			query: {
				match: { name: "CPU" },
			},
		},
	});

	console.log(body.hits.hits);
}

run().catch(console.log);
