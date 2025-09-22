import Core from "../../../../../core.js";
import Session from "../../../../../database/entities/Session.entity.js";
import Link from "../util/Link.js";
import LoginButton from "./LoginButton.js";

export default function User(props: { rid: string }) {
	const { rid } = props;
	if (Core.services.context.get(rid, "loggedIn")) {
		const session = Core.services.context.get(rid, "session") as Session;

		return (
			<>
				<Link
					class={`btn btn-primary`}
					href={`/${session.user.username}`}
					get={`page.userpage`}
					params={`user=${session.user.username}`}
				>
					.{session.user.username}
				</Link>
				<Link class={`btn btn-info`} href="/_/settings" get="page.settingspage">
					.settings
				</Link>
				<a class={`btn btn-danger`} href="/auth/logout">
					.logout
				</a>
			</>
		);
	} else {
		return <LoginButton />;
	}
}
