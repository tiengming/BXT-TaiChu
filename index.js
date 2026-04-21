export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // In a real CF Worker environment, we would use KV or R2 to serve static assets.
    // For this implementation, we assume the environment serves the built project.
    // Here we provide a basic response for the root.

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(HTML_TEMPLATE, {
        headers: { "content-type": "text/html;charset=UTF-8" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>卜仙堂 | 品牌门户</title>
    <style>
        /* Minimal styles for the worker response */
        body { background: #161823; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: sans-serif; }
    </style>
</head>
<body>
    <div>
        <h1>卜仙堂 (BuXianTang)</h1>
        <p>鸿蒙开辟中... 请访问预览环境查看完整 3D 效果。</p>
    </div>
</body>
</html>`;
