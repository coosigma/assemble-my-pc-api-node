"use strict";

const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:9200" });

exports.get_component_by_id = async (req, res, next) => {
	const id = req.params.componentID;
	try {
		const { body } = await client.search({
			index: "pc-components",
			body: {
				query: {
					terms: {
						_id: [id],
					},
				},
			},
		});

		if (body.hits.total.value === 0) {
			res.status(404).json({ message: "No valid entry found for provided ID" });
		} else {
			const response = {
				count: body.hits.total.value,
				component: body.hits.hits[0],
			};
			res.status(200).json(response);
		}
	} catch (err) {
		// console.log(err);
		res.status(500).json({ error: err });
	}
};

exports.get_components_by_name = async (req, res, next) => {
	const name = req.params.componentsName;
	try {
		const { body } = await client.search({
			index: "pc-components",
			body: {
				query: {
					match: { name: name },
				},
			},
		});
		const response = {
			count: body.hits.total.value,
			components: body.hits.hits,
		};
		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
};
