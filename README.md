# Kinmen Ubike Map Project

## 專案功能說明

-   MapBox 展示金門 Youbike 站點，點擊圖示可以顯示當前站點的剩餘車位（60 秒更新）
-   Table 呈現各站點的實時剩餘可租借 Youbike 數量（60 秒更新）；點擊「前往地點」，地圖會跳往該站點。
-   Chart 呈現站點歷史數據（由於限制前 1000 筆資料，因此大概只能達到 2 ～ 3 個站點的歷史數據）；可以使用日期下拉組件來選取想查詢的日期（日期範圍：2021-06-01 ～當日的前一天）

## 專案 Demo：

-   線上 demo [link](https://demo-kinmen-ubike-map-7xfj.vercel.app/)
-   展示圖：
    ![image](https://i.imgur.com/Ekuvdqq.png)

## 專案運行說明

-   此專案使用 Vue+Vite+Typescript 開發；本地開發環境為 `node v16.19.0`，因此建議運行環境的 node 版本盡量不低於於`v16.19.0`
-   clone 專案到本地
-   在專案根目錄下新增`.env`檔，並根據`.env.example`的命名規則新增環境變量：
    -   `VITE_TDX_GRANT_TYPE`預設為`client_credentials`
    -   `VITE_TDX_CLIENT_ID`須至[https://tdx.transportdata.tw](https://tdx.transportdata.tw)申請 ID
    -   `VITE_TDX_CLIENT_SECRET`為 CLIENT_ID 相應的密鑰
    -   `VITE_MAPBOX_TOEKN`為申請 Mapbox 的帳號後的 token
-   `npm install`
-   `npm run dev`
