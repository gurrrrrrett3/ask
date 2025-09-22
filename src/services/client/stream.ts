import { renderToStream } from "@kitajs/html/suspense";
import Core from "../../core.js";
import { Response } from "express";

export default async function stream(res: Response, rid: string, component: JSX.Element) {
	const stream = renderToStream(component, rid)

	res.writeHead(200, {
		"Content-Type": "text/html",
		"Transfer-Encoding": "chunked",
	});

	if (stream && typeof stream.on === "function") {
		stream.on("data", (chunk: any) => {
			res.write(chunk);
		});

		stream.once("error", (err: any) => {
			res.write("Error: " + err.message)
			Core.services.context.clear(rid);
			res.end();
		})

		stream.once("end", () => {
			Core.services.context.clear(rid);
			res.end();
		});
	} else {
		res.end("Stream error");
	}
}
