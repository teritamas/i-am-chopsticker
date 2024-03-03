export interface IsFollowingSubjectResponse {
    score: number; // 画像がお題に対してどれくらい正しいか
    reason: string; // 判断理由
  }

export interface ImageDescriptionResponse {
    labels: VisionAiLabel[];
    description: string;
}

export interface VisionAiLabel {
    name: string;
    score: number;
}