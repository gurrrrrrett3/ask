import Core from "../../../../../core.js";
import Router from "../util/Router.js";
import HomeMeta from "./homeMeta.js";
import UserMeta from "./userMeta.js";

export default function Meta(props: { rid: string }) {
	return (
		<Router
			rid={props.rid}
			path={Core.services.context.get(props.rid, "path")}
			routes={{
				"/": HomeMeta,
				"/:user": UserMeta,
			}}
		/>
	);
}
