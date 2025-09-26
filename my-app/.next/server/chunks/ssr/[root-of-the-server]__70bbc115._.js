module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/app/playground/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const App = ()=>{
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [itemsA, setItemsA] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [itemsB, setItemsB] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [nodesList, setNodes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const fetchTable = async ()=>{
        const res = await fetch("http://54.65.233.242/api/get_table");
        const data = await res.json();
        const updatedData = data.data.map((item)=>({
                ...item,
                columns: item.columns.split(",")
            }));
        setItemsA(updatedData);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // ページロード時に GET API を叩く
        fetchTable();
        console.log(nodesList);
    }, []);
    const onDragStart = (e, item, from)=>{
        e.dataTransfer.setData('item', JSON.stringify(item));
        e.dataTransfer.setData('from', from);
    };
    const onDrop = (e, target)=>{
        e.preventDefault();
        const itemData = e.dataTransfer.getData('item');
        const fromList = e.dataTransfer.getData('from');
        const droppedItem = JSON.parse(itemData);
        if (target === fromList) return; // 同じリストへのドロップは無視
        // 両リストを更新する（元から削除、先に追加）
        let newItemsA = itemsA;
        let newItemsB = itemsB;
        if (fromList === 'A') {
            newItemsA = itemsA.filter((i)=>i.serial !== droppedItem.serial);
            newItemsB = [
                ...itemsB,
                droppedItem
            ];
        } else {
            newItemsB = itemsB.filter((i)=>i.serial !== droppedItem.serial);
            newItemsA = [
                ...itemsA,
                droppedItem
            ];
        }
        // 一括で更新
        setItemsA(newItemsA);
        setItemsB(newItemsB);
    };
    const dragNode = (e, item, index)=>{
        let nodes = nodesList.filter((node)=>node[2] !== "notConnected");
        nodes = [
            ...nodes,
            [
                item,
                index,
                "notConnected",
                0
            ]
        ];
        setNodes(nodes);
    };
    const connectNode = (e, item, index)=>{
        e.preventDefault();
        let nodes = nodesList;
        const connectedNodes = nodes.map((node)=>{
            if (node[2] === "notConnected" && node[0] != item) {
                return [
                    node[0],
                    node[1],
                    item,
                    index
                ];
            } else {
                return node;
            }
        });
        setNodes(connectedNodes);
    };
    const resetButton = (itemName)=>{
        let nodes = nodesList.filter((node)=>node[0] !== itemName && node[2] !== itemName);
        setNodes(nodes);
    };
    const delNode = (node2del)=>{
        let nodes = nodesList.filter((node)=>node !== node2del);
        console.log(nodes);
        setNodes(nodes);
    };
    const onDragOver = (e)=>{
        e.preventDefault();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container",
        ref: containerRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "list",
                onDrop: (e)=>onDrop(e, 'A'),
                onDragOver: onDragOver,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        children: "リストA（ドラッグ元）"
                    }, void 0, false, {
                        fileName: "[project]/src/app/playground/page.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    itemsA.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "draggable",
                            draggable: true,
                            onDragStart: (e)=>onDragStart(e, item, 'A'),
                            children: item.name
                        }, item.serial, false, {
                            fileName: "[project]/src/app/playground/page.tsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/playground/page.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dropzone",
                onDrop: (e)=>onDrop(e, 'B'),
                onDragOver: onDragOver,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        children: "リストB（ドロップ先）"
                    }, void 0, false, {
                        fileName: "[project]/src/app/playground/page.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    itemsB.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "draggable",
                            draggable: true,
                            onDragStart: (e)=>onDragStart(e, item, 'B'),
                            children: [
                                item.name,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "reset",
                                    onClick: ()=>resetButton(item.name),
                                    children: "↺"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/playground/page.tsx",
                                    lineNumber: 150,
                                    columnNumber: 24
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "nodes",
                                    children: item.columns.map((column, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            id: `node-${item.name}-${index}`,
                                            className: "column-item draggable",
                                            draggable: true,
                                            onDragStart: (e)=>dragNode(e, item.name, index),
                                            onDrop: (e)=>connectNode(e, item.name, index),
                                            onDragOver: onDragOver,
                                            children: column
                                        }, index, false, {
                                            fileName: "[project]/src/app/playground/page.tsx",
                                            lineNumber: 155,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/playground/page.tsx",
                                    lineNumber: 153,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, item.serial, true, {
                            fileName: "[project]/src/app/playground/page.tsx",
                            lineNumber: 144,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/playground/page.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: "/edit_table",
                className: "text-blue-600 hover:underline",
                children: "edit table"
            }, void 0, false, {
                fileName: "[project]/src/app/playground/page.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "connection-layer",
                children: nodesList.map(([fromItem, fromIdx, toItem, toIdx], i)=>{
                    const fromEl = document.getElementById(`node-${fromItem}-${fromIdx}`);
                    const toEl = document.getElementById(`node-${toItem}-${toIdx}`);
                    if (!fromEl || !toEl) return null;
                    const fromRect = fromEl.getBoundingClientRect();
                    const toRect = toEl.getBoundingClientRect();
                    const containerRect = containerRef.current?.getBoundingClientRect();
                    if (!containerRect) return null;
                    const x1 = fromRect.left + fromRect.width / 2 - containerRect.left;
                    const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
                    const x2 = toRect.left + toRect.width / 2 - containerRect.left;
                    const y2 = toRect.top + toRect.height / 2 - containerRect.top;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: x1,
                        y1: y1,
                        x2: x2,
                        y2: y2,
                        stroke: "blue",
                        strokeWidth: "2",
                        strokeOpacity: "0.5",
                        onClick: ()=>delNode([
                                fromItem,
                                fromIdx,
                                toItem,
                                toIdx
                            ])
                    }, i, false, {
                        fileName: "[project]/src/app/playground/page.tsx",
                        lineNumber: 196,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0));
                })
            }, void 0, false, {
                fileName: "[project]/src/app/playground/page.tsx",
                lineNumber: 178,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/playground/page.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = App;
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__70bbc115._.js.map