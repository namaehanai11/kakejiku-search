// 掛け軸データ配列（localStorageから読み込み）
let kakejikuList = JSON.parse(localStorage.getItem("kakejikuList")) || [];

function saveData() {
  localStorage.setItem("kakejikuList", JSON.stringify(kakejikuList));
}

function search() {
  const keyword = document.getElementById("keyword").value.trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  // キーワード空なら全部表示、そうでなければ部分一致フィルター
  const results = keyword === "" ? kakejikuList : kakejikuList.filter(item =>
    item.name.includes(keyword) || item.feature.includes(keyword)
  );

  if (results.length === 0) {
    resultsDiv.innerHTML = "<p>該当する掛け軸は見つかりませんでした。</p>";
    return;
  }

  results.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item";

    // 編集モードかどうか判定（ここは例として、編集中のindexを保持する変数を使う）
    if (item.isEditing) {
      // 編集フォーム表示
      div.innerHTML = `
        <input type="text" id="editName${index}" value="${item.name}">
        <br>
        <input type="text" id="editFeature${index}" value="${item.feature}">
        <br>
        <button onclick="saveEdit(${index})">保存</button>
        <button onclick="cancelEdit(${index})">キャンセル</button>
      `;
    } else {
      // 通常表示＋編集・削除ボタン
      div.innerHTML = `
        <strong>${item.name}</strong><br>
        ${item.feature}<br>
        <img src="${item.image}" alt="${item.name}" style="max-width:300px;"><br>
        <button onclick="startEdit(${index})">編集</button>
        <button onclick="deleteKakejiku(${index})">削除</button>
      `;
    }

    resultsDiv.appendChild(div);
  });
}

// 編集開始
function startEdit(index) {
  kakejikuList[index].isEditing = true;
  search();
}

// 編集キャンセル
function cancelEdit(index) {
  delete kakejikuList[index].isEditing;
  search();
}

// 編集保存
function saveEdit(index) {
  const newName = document.getElementById(`editName${index}`).value.trim();
  const newFeature = document.getElementById(`editFeature${index}`).value.trim();
  if (!newName || !newFeature) {
    alert("名前と特徴は必須です");
    return;
  }
  kakejikuList[index].name = newName;
  kakejikuList[index].feature = newFeature;
  delete kakejikuList[index].isEditing;
  saveData();
  search();
}

// 削除（引数をindexに変更）
function deleteKakejiku(index) {
  if (!confirm(`${kakejikuList[index].name} を削除しますか？`)) return;
  kakejikuList.splice(index, 1);
  saveData();
  search();
}

// ページ読み込み時に前回のデータを表示
search();