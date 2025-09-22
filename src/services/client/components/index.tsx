import IndexPage from "./page/indexPage.js";
import SettingsPage from "./page/settingsPage.js";
import UserPage from "./page/userPage.js";
import Head from "./shared/Head.js";
import Navbar from "./shared/nav/Navbar.js";
import Router from "./shared/util/Router.js";

export default async function Index(props: { path: string; rid: string }) {
	const { rid } = props;
	return (
		<>
			{"<!DOCTYPE html>"}
			<html>
				<Head rid={props.rid} />
				<body hx-ext="preload">
					<Navbar rid={rid} />
					<main id="main">
						<Router
							path={props.path}
							rid={props.rid}
							routes={{
								"/": IndexPage,
								"/_/settings": SettingsPage,
								"/:user": UserPage,
							}}
						/>
					</main>
				</body>
			</html>
		</>
	);
}
