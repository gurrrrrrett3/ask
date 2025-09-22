import Core from "../../../../../core.js";

export default function UserMeta(props: { rid: string }) {
	return (
		<>
			<title id="page-title" hx-swap-oob="true">
				.ask - .{Core.services.context.get(props.rid, "user")}
			</title>
			<meta id="og-title" name="og:title" content={".ask"} hx-swap-oob="true" />
			<meta
				id="og-description"
				name="og:description"
				content={"ask and answer anonymous questions"}
				hx-swap-oob="true"
			/>
			<meta
				id="og-image"
				name="og:image"
				content="https://ask.thighhighs.gay/_/banner.png"
				hx-swap-oob="true"
			/>
			<meta name="twitter:card" content="summary_large_image"></meta>
		</>
	);
}
