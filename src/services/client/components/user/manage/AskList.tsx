import Core from "../../../../../core.js";
import Time from "../../../../../util/time.js";
import Ask from "./Ask.js";

export default async function AskList(props: {
	username: string;
	prompt: string;
	limit?: number;
	offset?: number;
}) {
	const { username, prompt, limit, offset } = props;

	const asks = await Core.database.repository.ask.find(
		{
			user: {
				username,
			},
		},
		{
			limit: limit || 50,
			offset,
			orderBy: {
				timestamp: "DESC",
			},
		}
	);

	return asks
		.map((ask) =>
			Ask({
				username,
				prompt,
				ask: ask.text,
				date: Time.toSingleUnitRelativeTime(ask.timestamp.getTime(), Date.now(), true),
			})
		)
		.join("");
}
