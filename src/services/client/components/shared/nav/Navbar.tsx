import Logo from "./Logo.js";
import NavItems from "./NavItems.js";
import User from "./User.js";

export default function Navbar(props: { rid: string }) {
	const { rid } = props;
	return (
		<nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
			<div class="container-fluid">
				<Logo />
				<button
					class="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarColor02"
					aria-controls="navbarColor02"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarColor02">
					<NavItems rid={rid} />
					<div class="d-flex">
						<User rid={rid} />
					</div>
				</div>
			</div>
		</nav>
	);
}
