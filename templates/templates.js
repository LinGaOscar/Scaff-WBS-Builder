// WBS 模板定義
// 每個 key 對應 #tpl-panel 中一張 .tpl-card（onclick="applyTemplate('key')"）
// 結構：純資料樹，不含 id（id 由 injectIds() 在套用時自動補齊）
var TEMPLATES = {
  feature: [
    { title: 'SIT 階段', children: [
      { title: '環境建置', children: [
        { title: '主機申請', children: [] },
        { title: '防火牆設定', children: [] },
        { title: '連線測試', children: [] },
        { title: '執行環境 / 驅動安裝', children: [] },
      ]},
      { title: '測試執行', children: [
        { title: '功能測試', children: [] },
        { title: '整合測試', children: [] },
      ]},
      { title: 'IT 測試報告', children: [] },
    ]},
    { title: 'PROD 階段', children: [
      { title: '環境建置', children: [
        { title: '主機申請', children: [] },
        { title: '防火牆設定', children: [] },
        { title: '連線測試', children: [] },
        { title: '執行環境 / 驅動安裝', children: [] },
      ]},
      { title: '上線準備', children: [
        { title: 'USER 測試報告', children: [] },
        { title: '資安檢核表', children: [] },
      ]},
      { title: '系統上線', children: [
        { title: '正式部署', children: [] },
        { title: '交易測試', children: [] },
      ]},
    ]},
  ],
  project: [
    { title: 'SIT 階段', children: [
      { title: '環境建置', children: [
        { title: '主機申請', children: [] },
        { title: '防火牆設定', children: [] },
        { title: '連線測試', children: [] },
        { title: '執行環境 / 驅動安裝', children: [] },
      ]},
      { title: '測試執行', children: [
        { title: '功能測試', children: [] },
        { title: '整合測試', children: [] },
      ]},
      { title: 'IT 測試報告', children: [] },
    ]},
    { title: 'PROD 階段', children: [
      { title: '環境建置', children: [
        { title: '主機申請', children: [] },
        { title: '防火牆設定', children: [] },
        { title: '連線測試', children: [] },
        { title: '執行環境 / 驅動安裝', children: [] },
      ]},
      { title: '測試驗證', children: [
        { title: '黑箱測試', children: [] },
        { title: '白箱測試', children: [] },
        { title: '第三方測試', children: [] },
      ]},
      { title: '上線準備', children: [
        { title: 'USER 測試報告', children: [] },
        { title: '資安檢核表', children: [] },
      ]},
      { title: '系統上線', children: [
        { title: '正式部署', children: [] },
        { title: '交易測試', children: [] },
      ]},
    ]},
  ],
};
