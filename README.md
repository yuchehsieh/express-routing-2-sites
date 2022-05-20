## 使用 Express 路由一個以上的 React app

### 2022/05/20 紀錄

1. 由於 Express 緣故，現階段新增 React 子網站需經三道指令才能正常運行，分別為：

    I. `app.get("/A", ...)` 得到入口網站

    II. `app.get("/A/*", ...)` 得到底下的其他分頁（少這道會由 express 提前回送錯誤）

    III. `app.use("/A-resource", ...)` 得到該網站的靜態資源，名稱需與 I, II 區隔

2. 每個 React 子網站的 `homepage` 需獨立掌管該網站的靜態資源，要與 `app.use()` 路徑名稱相同，舉例來說：

    * Exppress 中設定某 React 網站資源為 `app.use("/A-resource", ...)`

    * 對應的 React 則須設定 `"homepage": "./A-resource"`（建議使用相對路徑）


3. 每個 React 子網站的 BrowserRouter 需加上 `basename`，舉例來說：

    * 修改後為`<BrowserRouter basename="/A">` ，有斜線，且斜線之後路徑名稱與第 1 項載明的路徑相同

4. (opttional) 注意 React 子網站的各個 Route 沒有額外包裹一層路徑 `"/*"` 或 `"*"` 的 router 設定（會導致渲染錯誤） 
