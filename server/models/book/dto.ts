export interface Book {
    id: string;
    name: string; // ビンゴの内容
    description: string; // ビンゴの説明
    created_user: number; // 作成したユーザのID
    created_at: Date; // 作成日時
    updated_at: Date; // 更新日時
  
    // ユーザの回答に関する情報
    imageUrl: string | null; // 画像のURL
    comments: string | null; // 投稿した画像に対するコメント(オプション)
    imageAiCheckScore: number; // 画像のAI判定のスコア[0-1]
    imageAiCheckReason: string; // imageAiCheckScoreの理由
  }
  