import Meta from "./meta/meta.js";

/**
 * extra stuff to include in component requests for htmx to swap out of band
 */
export default function OutOfBand(props: { rid: string; path: string }) {
	const { rid } = props;
	<Meta rid={rid} />;
}
