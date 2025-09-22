import Core from "../../../../core.js";
import Session from "../../../../database/entities/Session.entity.js";
import Link from "../shared/util/Link.js";
import AskPrompt from "../user/guest/AskPrompt.js";
import AskList from "../user/manage/AskList.js";

export default async function UserPage(props: { rid: string; user?: string }) {
	const { rid } = props;

	const username = Core.services.context.get(rid, "user") || props.user;
	const session = Core.services.context.get(rid, "session") as Session;
	const isManager = session && session.user.username == username;
	const user = await Core.database.repository.user.findOne({
		username,
	});

	if (!user) {
		return (
			<div class="container">
				<div class="row" style="padding-top: 3rem;">
					<div class="col-md-6">
						<h1 class="text-success">
							<span class="text-primary">.</span>
							<span safe>user not found</span>
						</h1>
						<p>please try another username</p>
						<Link href="/" get="page.index" class="btn btn-primar">
							go home
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const prompt = user?.prompt || "ask me anything!";

	return (
		<div class="container">
			<div class="row" style="padding-top: 3rem;">
				<div class="col-md-6">
					<h1 class="text-success">
						<span class="text-primary">.</span>
						<span safe>{username}</span>
					</h1>
				</div>

				<div>
					{isManager ? (
						AskList({
							username,
							prompt,
						})
					) : (
						<AskPrompt prompt={prompt} userId={user.id} />
					)}
				</div>
			</div>
		</div>
	);
}
