// script.js
// 掛け軸データ配列（localStorageから読み込み）
let kakejikuList = JSON.parse(localStorage.getItem("kakejikuList")) || [];

function saveData() {
  localStorage.setItem("kakejikuList", JSON.stringify(kakejikuList));
}

function addKakejiku() {
  const name = document.getElementById("name").value.trim();
  const feature = document.getElementById("feature").value.trim();
  const imageFile = document.getElementById("image").files[0];
  if (!name || !feature || !imageFile) {
    alert("すべての項目を入力してください");
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    kakejikuList.push({ name, feature, image: e.target.result });
    saveData();
    alert("掛け軸を登録しました！");
    document.getElementById("name").value = "";
    document.getElementById("feature").value = "";
    document.getElementById("image").value = "";
    search();
  };
  reader.readAsDataURL(imageFile);
}

function search() {
  const keyword = document.getElementById("keyword").value.trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  // キーワード空なら全部表示、そうでなければ部分一致フィルター
  const results =
    keyword === ""
      ? kakejikuList
      : kakejikuList.filter(
          (item) =>
            item.name.includes(keyword) || item.feature.includes(keyword)
        );

  if (results.length === 0) {
    resultsDiv.innerHTML = "<p>該当する掛け軸は見つかりませんでした。</p>";
    return;
  }

  results.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item";

    if (item.isEditing) {
      div.innerHTML = `
        <label for="editName${index}">名前:</label><br>
        <input type="text" id="editName${index}" value="${item.name}" autocomplete="off"><br>
        <label for="editFeature${index}">特徴:</label><br>
        <input type="text" id="editFeature${index}" value="${item.feature}" autocomplete="off"><br>
        <div class="edit-buttons">
          <button onclick="saveEdit(${index})">保存</button>
          <button onclick="cancelEdit(${index})" class="cancel-btn">キャンセル</button>
        </div>
      `;
    } else {
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

function startEdit(index) {
  kakejikuList[index].isEditing = true;
  search();
}

function cancelEdit(index) {
  delete kakejikuList[index].isEditing;
  search();
}

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

function deleteKakejiku(index) {
  if (!confirm(`${kakejikuList[index].name} を削除しますか？`)) return;
  kakejikuList.splice(index, 1);
  saveData();
  search();
}

// ページ読み込み時に前回のデータを表示
search();