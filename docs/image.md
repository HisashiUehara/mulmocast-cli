# 画像生成ルール

1. image プロパティが設置されていれば、image.type で決まる plugin に画像の生成・取得は任せる
2. image プロパティが設置されておらず、imagePromptが設定されていれば、そのプロンプトで画像を生成する。
3. moviePromptのみが設定されている場合、画像は生成せず、そのプロンプトだけで動画を生成する
4. image プロパティもimagePromptもmoviePromptも設定されていない場合、textからイメージプロンプトを生成し、それを使って画像を生成する
5. 1か2の条件で画像が生成・取得された場合で、moviePromptが存在する場合、その画像とmoviePromptで映像を生成する

## Beat画像生成ルール一覧表

| 条件 | image property | text | imagePrompt | moviePrompt | 画像処理 | 動画処理 | 参照セクション |
|------|-------|------|-------------|-------------|----------|----------|----------------|
| **1** | ✓ |  |  |  | image.typeプラグイン | なし | [1. image.typeの処理](#1-imagetypeの処理) |
| **1+5** | ✓ |  |  | ✓ | image.typeプラグイン | 生成画像+moviePrompt | [5. moviePrompt and (image or imagePrompt)](#5-movieprompt-and-image-or-imageprompt) |
| **2** |  | ✓ | ✓ |  | imagePromptで画像生成 | なし | [2. imagePrompt](#2-imageprompt) |
| **2+5** |  | ✓ | ✓ | ✓ | imagePromptで画像生成 | 生成画像+moviePrompt | [5. moviePrompt and (image or imagePrompt)](#5-movieprompt-and-image-or-imageprompt) |
| **3** |  | ✓ |  | ✓ | なし | moviePromptのみ | [3. moviePrompt](#3-movieprompt) |
| **4** |  | ✓ |  |  | text を imagePrompt として画像生成 | なし | [4. no imagePrompt and moviePrompt](#4-no-imageprompt-and-movieprompt) |

### 表の見方
- **✓**: 設定されている
- **条件番号**: 上記ルールの番号に対応
- **参照セクション**: 対応するbeatデータ例があるセクションへのリンク

### 優先順位
1. `image`プロパティが最優先
2. `image`がない場合は`imagePrompt`
3. `moviePrompt`のみの場合は動画のみ生成
4. 何もない場合は`text`から自動生成
5. 画像生成後に`moviePrompt`があれば動画も生成

## 1. image.typeの処理

```json
{
  "image": {
    "type": "image"
  }
}
```
### リモートの画像
```json
{
  "type": "image",
  "source": {
    "kind": "url",
    "url": "https://raw.githubusercontent.com/receptron/mulmocast-cli/refs/heads/main/assets/images/mulmocast_credit.png"
  }
}
```

### localの画像
```json
{
  "type": "image",
  "source": {
    "kind": "path",
    "path": "../../assets/images/mulmocast_credit.png"
  }
}
```

### リモートの動画
```json
{
  "type": "movie",
  "source": {
    "kind": "url",
    "url": "https://github.com/receptron/mulmocast-media/raw/refs/heads/main/test/pingpong.mov"
  }
}
```

### markdonwのslide
```json
{
  "type": "textSlide",
  "slide": {
    "title": "Human Evolution",
    "bullets": [
      "Early Primates",
      "Hominids and Hominins",
      "Australopithecus",
      "Genus Homo Emerges",
      "Homo erectus and Migration",
      "Neanderthals and Other Archaic Humans",
      "Homo sapiens"
    ]
  }
}
```

### markdown
```json
{
  "type": "markdown",
  "markdown": [
    "# Markdown Table Example",
    "### Table",
    "| Item              | In Stock | Price |",
    "| :---------------- | :------: | ----: |",
    "| Python Hat        |   True   | 23.99 |",
    "| SQL Hat           |   True   | 23.99 |",
    "| Codecademy Tee    |  False   | 19.99 |",
    "| Codecademy Hoodie |  False   | 42.99 |",
    "### Paragraph",
    "This is a paragraph."
  ]
}
```

### chart.js
```json
{
  "type": "chart",
  "title": "Sales and Profits (from Jan to June)",
  "chartData": {
    "type": "bar",
    "data": {
      "labels": ["January", "February", "March", "April", "May", "June"],
      "datasets": [
        {
          "label": "Revenue ($1000s)",
          "data": [120, 135, 180, 155, 170, 190],
          "backgroundColor": "rgba(54, 162, 235, 0.5)",
          "borderColor": "rgba(54, 162, 235, 1)",
          "borderWidth": 1
        },
        {
          "label": "Profit ($1000s)",
          "data": [45, 52, 68, 53, 61, 73],
          "backgroundColor": "rgba(75, 192, 192, 0.5)",
          "borderColor": "rgba(75, 192, 192, 1)",
          "borderWidth": 1
        }
      ]
    },
    "options": {
      "responsive": true,
      "animation": false
    }
  }
}
```

### mermaid
```json
{
  "type": "mermaid",
  "title": "Business Process Flow",
  "code": {
    "kind": "text",
    "text": "graph LR\n    A[Market Research] --> B[Product Planning]\n    B --> C[Development]\n    C --> D[Testing]\n    D --> E[Manufacturing]\n    E --> F[Marketing]\n    F --> G[Sales]\n    G --> H[Customer Support]\n    H --> A"
  }
}
```

### html_tailwind
```json
{
  "type": "html_tailwind",
  "html": [
    "<main class=\"flex-grow\">",
    "  <!-- Hero Section -->",
    "  <section class=\"bg-blue-600 text-white py-20\">",
    "    <div class=\"container mx-auto px-6 text-center\">",
    "      <h1 class=\"text-4xl md:text-5xl font-bold mb-4\">Welcome to Mulmocast</h1>",
    "      <p class=\"text-lg md:text-xl mb-8\">A modern web experience powered by Tailwind CSS</p>",
    "      <a href=\"#features\" class=\"bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition\">",
    "        Learn More",
    "      </a>",
    "    </div>",
    "  </section>",
    "",
    "  <!-- Features Section -->",
    "  <section id=\"features\" class=\"py-16 bg-gray-100\">",
    "    <div class=\"container mx-auto px-6\">",
    "      <div class=\"grid grid-cols-1 md:grid-cols-3 gap-8 text-center\">",
    "        <div>",
    "          <div class=\"text-blue-600 text-4xl mb-2\">⚡</div>",
    "          <h3 class=\"text-xl font-semibold mb-2\">Fast</h3>",
    "          <p class=\"text-gray-600\">Built with performance in mind using modern tools.</p>",
    "        </div>",
    "        <div>",
    "          <div class=\"text-blue-600 text-4xl mb-2\">🎨</div>",
    "          <h3 class=\"text-xl font-semibold mb-2\">Beautiful</h3>",
    "          <p class=\"text-gray-600\">Styled with Tailwind CSS for clean, responsive design.</p>",
    "        </div>",
    "        <div>",
    "          <div class=\"text-blue-600 text-4xl mb-2\">🚀</div>",
    "          <h3 class=\"text-xl font-semibold mb-2\">Launch Ready</h3>",
    "          <p class=\"text-gray-600\">Easy to deploy and extend for your next big idea.</p>",
    "        </div>",
    "      </div>",
    "    </div>",
    "  </section>",
    "</main>",
    "",
    "<!-- Footer -->",
    "<footer class=\"bg-white text-gray-500 text-center py-6 border-t\">",
    "  2025 Mulmocast.",
    "</footer>"
  ]
}
```

### beat 
#### 前のbeatのimageを使う
```json
{
  "type": "beat"
}
```

#### 指定したbeatのimageを使う（id で指定）
```json
{
  "type": "beat",
  "id": "second"
}
```

id は beat で指定する
```json
{
  "text": "This is the second beat.",
  "id": "second",
  "image": {
    "type": "textSlide",
    "slide": {
      "title": "This is the second beat."
    }
  }
}
```

## 各条件での beat データ例 
### 2. imagePrompt

```json
{
  "text": "This message does not affect image generation.",
  "imagePrompt": "Generate an image with this message."
}
```

### 3. moviePrompt

```json
{
  "text": "This message does not affect image generation.",
  "moviePrompt": "Generate a movie with this message."
}
```

### 4. no imagePrompt and moviePrompt.
```json
{
  "text": "Generate an image with this message."
}
```

### 5. moviePrompt and (image or imagePrompt)

```json
{
  "text": "This message does not affect image generation.",
  "imagePrompt": "Generate an image with this message.",
  "moviePrompt": "Use the generated image and this message to generate a movie."
}
```

```json
{
  "text": "This message does not affect image generation.",
  "image": {
    "type": "image"
  },
  "moviePrompt": "Use the generated image and this message to generate a movie."
}
```

---

## studio.script.imageParams.images

OpenAIで画像処理をするときに画像の一貫性のために参照となる画像を渡せる。
その画像情報を元に、複数の画像を生成するときに一貫性を保つことができる。
たとえば昔話の作成時に、登場人物の作画の一貫性をだす。

```json
  "imageParams": {
    "style": "Photo realistic, cinematic style.",
    "images": {
      "optimus": {
        "type": "image",
        "source": {
          "kind": "url",
          "url": "https://raw.githubusercontent.com/receptron/mulmocast-media/refs/heads/main/characters/optimus.png"
        }
      }
    }
  }
```

