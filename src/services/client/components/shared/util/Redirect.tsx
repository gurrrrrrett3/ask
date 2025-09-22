export default function Redirect(props: { path?: string; component?: string; text?: string }) {
	const { path = "/", component = "page.indexpage", text = "Back to Home" } = props;

	return (
		<a
			href={path}
			hx-get={`/component/${component}?path=${path}`}
			hx-push-url={path}
			hx-target="#main"
			hx-trigger="load"
		>
			{text}
		</a>
	);
}
