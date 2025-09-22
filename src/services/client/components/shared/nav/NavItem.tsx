import { Children } from "@kitajs/html";
import Core from "../../../../../core.js";
import { match } from "path-to-regexp";
import Link from "../util/Link.js";

export default function NavItem(props: {
	rid?: string;
	href: string;
	get: string;
	current?: boolean;
	children: Children;
}) {
	const path = props.rid && (Core.services.context.get(props.rid, "path") as string);
	if (path && match(props.href)(path)) {
		props.current = true;
	}
	return (
		<li class="nav-item">
			<Link class={`nav-link ${props.current ? "active" : ""}`} href={props.href} get={props.get}>
				{props.children}
				{props.current && <span class="visually-hidden">(current)</span>}
			</Link>
		</li>
	);
}
