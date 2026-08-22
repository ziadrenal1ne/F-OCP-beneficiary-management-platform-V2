import { r as createServerFn } from "./ssr.mjs";
import { A as boolean, D as _enum, F as object, P as number, R as string, k as array } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-Df2gyd2O.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-DTT0YQAC.js
var idSchema = object({ id: number() });
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("fab582be412d4aab36493208e213f7363bac6537b3bdf3ac06473123fdfb5840"));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4303ff2527037c84f7e30b270e3f6e8a6118e8bf6a13e0e3f4d48144dd33a3ab"));
var searchSchema = object({
	q: string().optional(),
	region: string().optional(),
	province: string().optional(),
	city: string().optional(),
	country: string().optional(),
	sector: string().optional(),
	status: string().optional(),
	odd: number().optional(),
	minBeneficiaries: number().optional()
});
var listCooperatives = createServerFn({ method: "GET" }).validator(searchSchema).middleware([authMiddleware]).handler(createSsrRpc("3e84c85b8ce5dfb22ecb726d4fb3c8338860184452a7fcad14cc0925c7ad34e7"));
var getCooperative = createServerFn({ method: "GET" }).validator(idSchema).middleware([authMiddleware]).handler(createSsrRpc("97303f2107070921ba9203c192edc728625afe30108c6ed4d72cc3ac4c461363"));
var updateCoopSchema = object({
	id: number(),
	name: string().min(2),
	description: string(),
	address: string(),
	city: string().min(1),
	province: string().min(1),
	region: string().min(1),
	country: string().min(1),
	lat: number(),
	lng: number(),
	phone: string(),
	email: string(),
	website: string(),
	sector: string().min(1),
	legalStatus: string(),
	createdDate: string().nullable(),
	status: _enum([
		"active",
		"pending",
		"suspended"
	]),
	oddCodes: array(number())
});
var updateCooperative = createServerFn({ method: "POST" }).validator(updateCoopSchema).middleware([authMiddleware]).handler(createSsrRpc("ac92eebea4e238ae772f1543dd01f988a6c8362db118ad2ea1ad44f50c2932d2"));
var statsSchema = object({
	cooperativeId: number(),
	year: number(),
	month: number().min(1).max(12),
	women: number().min(0),
	men: number().min(0),
	youth: number().min(0),
	adults: number().min(0),
	children: number().min(0),
	disabled: number().min(0),
	indirect: number().min(0)
});
var upsertBeneficiaryStats = createServerFn({ method: "POST" }).validator(statsSchema).middleware([authMiddleware]).handler(createSsrRpc("bccca172449649a583c1417b511bc97a1ba87b1437bc82a5428fcaa0486cf194"));
var listReports = createServerFn({ method: "GET" }).validator(object({ status: string().optional() })).middleware([authMiddleware]).handler(createSsrRpc("7a270e08e1388422957b0cd9cc31f864a4993fd9526c0d9d42acd57bfad3ac22"));
var getReport = createServerFn({ method: "GET" }).validator(idSchema).middleware([authMiddleware]).handler(createSsrRpc("9d9410f2e00438ee77560bedf731cea8f03321f6e9612d24288ad3d83911f23a"));
var reportInput = object({
	id: number().optional(),
	cooperativeId: number(),
	year: number(),
	month: number().min(1).max(12),
	title: string().min(2),
	activitySummary: string(),
	achievements: string(),
	challenges: string(),
	futureActions: string(),
	women: number().min(0),
	men: number().min(0),
	youth: number().min(0),
	adults: number().min(0),
	children: number().min(0),
	disabled: number().min(0),
	indirect: number().min(0),
	submit: boolean()
});
var saveReport = createServerFn({ method: "POST" }).validator(reportInput).middleware([authMiddleware]).handler(createSsrRpc("e8bff06d452226181a4a6ec65d648ae7bb8e7dc83b0bf843daa24a1553b22335"));
var reviewSchema = object({
	id: number(),
	decision: _enum(["approved", "rejected"]),
	comment: string()
});
var reviewReport = createServerFn({ method: "POST" }).validator(reviewSchema).middleware([authMiddleware]).handler(createSsrRpc("e8cc0560637ce80eedebaf766f6d9d3b3a2693a04088cab9c3b9de24ff0d29eb"));
var listConventions = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("65dd7482d2fff4d1533861ecbfb63e4c340d9defb207012469e53d9be9003e84"));
var conventionSchema = object({
	id: number().optional(),
	cooperativeId: number(),
	title: string().min(2),
	partner: string().min(1),
	startDate: string(),
	endDate: string(),
	amount: number().min(0),
	description: string()
});
var saveConvention = createServerFn({ method: "POST" }).validator(conventionSchema).middleware([authMiddleware]).handler(createSsrRpc("673d86d3d5305ae947b4b3889f2459c91f9a5e48ace1e6fd971b496a76acb0d2"));
var listDocuments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("13ce1eb0a32ad8e6af010d846fb36e91528e9abf5e36fb9c985ac6c89bac9a71"));
var uploadSchema = object({
	cooperativeId: number(),
	name: string().min(1),
	category: string().min(1),
	mimeType: string().min(1),
	contentBase64: string().min(1),
	sizeBytes: number()
});
var uploadDocument = createServerFn({ method: "POST" }).validator(uploadSchema).middleware([authMiddleware]).handler(createSsrRpc("009f70db1cede45e1f619bbb269336cdba286ce0f32edff9ed41f8fd028483d4"));
var getDocumentContent = createServerFn({ method: "GET" }).validator(idSchema).middleware([authMiddleware]).handler(createSsrRpc("8a12cf463a577196e6f990a639c0a033853a836050889b1ea136a2af920de0d1"));
var docReviewSchema = object({
	id: number(),
	status: _enum(["approved", "rejected"])
});
var reviewDocument = createServerFn({ method: "POST" }).validator(docReviewSchema).middleware([authMiddleware]).handler(createSsrRpc("b5f6a9303fbdfce9799a8ad7902bdcecdc721da4270c973c5668f463b29c6c90"));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("c3972ee4d0736a00df2095b11cc29da4af69edc7462b684c3b8b7d301bd86b49"));
var markNotificationRead = createServerFn({ method: "POST" }).validator(idSchema).middleware([authMiddleware]).handler(createSsrRpc("3289f796dee82787777d193a34d9a1512494c2094edf41a620e79c8c1f9ee691"));
var markAllNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("cf31e0af240ad6dd920c4f67ac03fe75b32fc612f36a2cd11027e382f879159b"));
var listOdds = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("7c8aa6b34005042aacd531cdf11949b25cd1658faf4348e72f16abdf4b3ddfb7"));
var getAnalytics = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4cb0c004d1395b50a3d126168a8cdd18353f3971a6159e50c5b1c895a32f7625"));
var listActivity = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("7d32b995b7686adc44fba1b890e600e13202cea5bed07a301ac72ca15465fdfa"));
var csvSchema = object({ csv: string().min(1) });
var importCooperativesCsv = createServerFn({ method: "POST" }).validator(csvSchema).middleware([authMiddleware]).handler(createSsrRpc("a0d79630eed99066cb7cd9efd81604e5934f4ce936fdcb7404bb0c18378399bf"));
var exportCooperatives = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("790265c9290c4f5d1f17ae9c0527f647c4e3b31393b85826121cfc60b4876f70"));
var sendAdminMessage = createServerFn({ method: "POST" }).validator(object({
	cooperativeId: number(),
	title: string().min(2),
	body: string().min(1)
})).middleware([authMiddleware]).handler(createSsrRpc("3edf3a6040b7b881f749800d574b9f017044ad82f7305ffb678959e8ecbda14a"));
var listFilterOptions = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("64b35bce6176730891623e6dd03f83f2df559a3c69cc0cbd798ddcf9d8290ddc"));
//#endregion
export { sendAdminMessage as C, upsertBeneficiaryStats as E, saveReport as S, uploadDocument as T, markAllNotificationsRead as _, getDocumentContent as a, reviewReport as b, importCooperativesCsv as c, listCooperatives as d, listDocuments as f, listReports as g, listOdds as h, getDashboard as i, listActivity as l, listNotifications as m, getAnalytics as n, getMe as o, listFilterOptions as p, getCooperative as r, getReport as s, exportCooperatives as t, listConventions as u, markNotificationRead as v, updateCooperative as w, saveConvention as x, reviewDocument as y };
