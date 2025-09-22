import Core from "../../../../core.js";
import Session from "../../../../database/entities/Session.entity.js";

export const usernameCheckRegex = /^[a-z0-9_\.]{3,16}$/;

export default async function Username(props: { rid: string; username?: string; first?: boolean }) {
	const { rid, username: name, first } = props;
	const session = Core.services.context.get(rid, "session") as Session;

	const username = first ? session.user.username : name || "";
	let nameValid = usernameCheckRegex.test(username);
	let reason = "";

	if (!nameValid) {
		if (username.length < 3) {
			reason = "just a little too short, make it slightly longer for me";
		} else if (username.length > 16) {
			reason = "woah, thats too long. maybe shave off just a little?";
		}
	}

	const user =
		nameValid &&
		(await Core.database.repository.user.findOne({
			username,
		}));

	const isCurrent = !name || name.length == 0 || (user && user.id == session?.user.id);

	if (user && user.id != session?.user.id) {
		nameValid = false;
		reason = "whoops, someone got there before you :(";
	}

	return (
		<div id="username-container">
			<label class="form-label mt-4" for="username">
				Username
			</label>
			<input
				type="text"
				value={username}
				class={isCurrent ? "form-control" : `form-control is-${nameValid ? "valid" : "invalid"}`}
				id="username"
				name="username"
				placeholder="put a cool funny username here"
				hx-get="/component/settings.username"
				hx-trigger="keyup changed delay:500ms"
				hx-target="#username-container"
				autocomplete="false"
			/>
			{isCurrent ? (
				""
			) : (
				<div class={`${nameValid ? "valid" : "invalid"}-feedback`}>{nameValid ? "looks good!" : reason}</div>
			)}
		</div>
	);
}
