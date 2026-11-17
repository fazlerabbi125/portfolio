import "@testing-library/jest-dom";
import {
	TextDecoder as NodeTextDecoder,
	TextEncoder as NodeTextEncoder,
} from "node:util";

Object.assign(globalThis, {
	TextDecoder: NodeTextDecoder,
	TextEncoder: NodeTextEncoder,
});

if (!globalThis.Request) {
	class TestRequest {}
	globalThis.Request = TestRequest as unknown as typeof Request;
}
