import Core from "../../../../core.js";
import Session from "../../../../database/entities/Session.entity.js";

export const promptMinLen = 8;
export const promptMaxLen = 80;

export default function Prompt(props: { rid: string; prompt?: string; first?: boolean }) {
	const { rid, prompt: inputPrompt, first } = props;
	const session = Core.services.context.get(rid, "session") as Session;

	const prompt = first ? session.user.prompt : inputPrompt;

	const isValid = prompt && prompt.length >= promptMinLen && prompt.length <= promptMaxLen;
	let reason = "cmon, you can type more than that";
	let hidden = false;

	if (prompt && !isValid && prompt?.length > promptMaxLen) {
		reason = "woah, thats too much";
	}

	if (!prompt || prompt?.length == 0) {
		hidden = true;
		reason = "";
	}

	return (
		<div id="prompt-container">
			<label for="prompt" class="col-sm-2 col-form-label">
				Prompt
			</label>
			<input
				class={
					hidden
						? "form-control form-control-lg"
						: `form-control form-control-lg is-${isValid ? "valid" : "invalid"}`
				}
				id="prompt"
				name="prompt"
				value={prompt}
				placeholder="ask me anything!"
				hx-get="/component/settings.prompt"
				hx-trigger="keyup changed delay:500ms"
				hx-target="#prompt-container"
				autocomplete="false"
			></input>

			{hidden ? (
				""
			) : (
				<div class={`${isValid ? "valid" : "invalid"}-feedback`}>
					{isValid ? `looks good! ${prompt.length}/${promptMaxLen}` : reason}
				</div>
			)}
		</div>
	);
}
