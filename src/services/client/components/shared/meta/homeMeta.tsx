export default function HomeMeta(props: { rid: string }) {
	return (
		<>
			<title id="page-title" hx-swap-oob="true">
				.ask - ask and answer anonymous questions
			</title>
			<meta id="og-title" name="og:title" content={".ask"} />
			<meta id="og-description" name="og:description" content={"ask and answer anonymous questions"} />
			<meta id="og-image" name="og:image" content="https://ask.thighhighs.gay/_/banner.png" />
		</>
	);
}
