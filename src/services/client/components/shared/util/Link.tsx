import { Children } from "@kitajs/html";

export default function Link(props: {
	children: Children;
	href: string;
	params?: string;
	class?: string;
	id?: string;
	get?: string;
	target?: string;
	url?: string;
}) {
	return (
		<a
			id={props.id}
			class={props.class}
			href={props.href}
			hx-get={`/component/${props.get}?path=${encodeURIComponent(props.url || props.href)}${
				props.params ? `&${props.params}` : ""
			}`}
			hx-target={props.target || "#main"}
			hx-push-url={props.url || props.href}
		>
			{props.children}
		</a>
	);
}
