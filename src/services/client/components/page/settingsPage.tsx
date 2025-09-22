import Core from "../../../../core.js";
import Session from "../../../../database/entities/Session.entity.js";
import Prompt from "../settings/Prompt.js";
import Username from "../settings/Username.js";
import Redirect from "../shared/util/Redirect.js";

export default async function SettingsPage(props: { rid: string }) {
	const { rid } = props;

	const session = Core.services.context.get(rid, "session") as Session;

	if (!session) {
		return <Redirect />;
	}

	return (
		<div class="container">
			<div class="row" style="padding-top: 3rem;">
				<div class="col-md-6">
					<h1 class="text-success">
						<span class="text-primary">.</span>settings
					</h1>
					<p class="text-primary">change settings here :p</p>

					<form hx-post="/api/settings" class="settings-form">
						<Username rid={rid} first={true} />
						<Prompt rid={rid} first={true} />
						<input type="submit" class="btn btn-primary" value="submit!" />
					</form>
				</div>
			</div>
		</div>
	);
}
