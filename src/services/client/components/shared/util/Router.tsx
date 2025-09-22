import { match } from "path-to-regexp";
import Core from "../../../../../core.js";
export default function Router(props: {
	rid: string;
	path: string;
	default?: string | Promise<string>;
	routes: Record<string, (props: any) => string | Promise<string>>;
	params?: Record<string, any>; // Optional params from match
}) {
	const { rid, path, routes, params = {} } = props;
	Core.services.context.setMany(rid, params);

	for (const [route, value] of Object.entries(routes)) {
		const res = match(route)(path);
		if (res) {
			Core.services.context.setMany(rid, res.params);
			return value({ rid, path, ...props.params, ...res.params });
		}
	}

	return props.default || "";
}
