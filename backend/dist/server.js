// Entry point (start server)
import app from "./app.js";
const PORT = process.env['PORT'] || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map