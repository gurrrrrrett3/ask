const borderColors = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"];

export default function Ask(props: { username: string; prompt: string; ask: string; date: string }) {
	const { username, prompt, ask, date } = props;
	return (
		<div
			class={`card border-${borderColors[Math.floor(Math.random() * borderColors.length)]} mb-3`}
			style="max-width: 20rem;"
		>
			<div class="card-header" safe>
				{prompt}
			</div>
			<div class="card-body">
				<p class="card-text" safe>
					{ask}
				</p>
			</div>
			<div class="card-footer text-muted" style="display:flex; justify-content: space-between;">
				<div>{date}</div>
				<a
					href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
						`q: ${ask}\na: \n\nhttps://ask.thighhighs.gay/${username}`
					)}`}
				>
					<img height="24px" width="24px" src="/_/twitter.svg" />
				</a>
			</div>
		</div>
	);
}
