export const askMaxLen = 100;

export default function AskPrompt(props: { prompt: string; username: string; ask?: string }) {
	const { prompt, username, ask } = props;
	return (
		<form
			class={`card border-primary mb-3`}
			style="display: flex;"
			id="guest-ask-container"
			hx-post="/api/ask"
			hx-swap="outerHTML"
		>
			<div class="card-header" safe>
				{prompt}
			</div>
			<div class="card-body" style="display: flex;">
				<input
					class="card-text form-control form-control-lg"
					value={ask || ""}
					type="text"
					id="ask"
					name="ask"
					hx-get={`/component/user.guest.askprompt?prompt=${prompt}&username=${username}`}
					hx-trigger="keyup changed delay:500ms"
					hx-target="#guest-ask-container"
					hx-swap="outerHTML"
					autocomplete="false"
					maxlength={askMaxLen}
				/>
				<input name="username" value={username} hidden />
				<input class="btn btn-primary" type="submit" value="Submit" />
			</div>
			<div class="card-footer text-success">{(ask || "").length}/100</div>
		</form>
	);
}
