import {
    Book,
  } from "@/server/models/book/dto";
//  import { firestore } from "../../firebase";
//  import { checkBingoOrReachLines } from "@/server/utils/bingoCheck";
//  import { Filter } from "firebase-admin/firestore";
  
  /**
   * ビンゴカードの内容を取得する
   */
  export const getBook = async (bingoCardId: string) => {
    try {
      const querySnapshot = await firestore
        .collection("bingoCard")
        .doc(bingoCardId)
        .get();
      const bingoCard = querySnapshot.data() as Book;
      return bingoCard;
    } catch (e) {
      console.error("[getBingoCard]", e);
    }
  };
  
  /**
   * Uidでフィルタして全件取得
   */
  export const getAllBingoCardByUidNotPublic = async (uid: string) => {
    try {
      // createdUidがuidのものを取得する
      const querySnapshot = await firestore
        .collection("bingoCard")
        .where(
          Filter.and(
            Filter.where("createdUid", "==", uid),
            Filter.where("isPublic", "==", false) // isPublicがfalseのものは、別の処理で取得するため取得しない
          )
        )
        .orderBy("createdAt", "desc")
        .get();
      const bingoCard = querySnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate(),
        } as BingoCard;
      });
      return addBingoCreateUser(bingoCard);
    } catch (e) {
      console.error("[getAllBingoCardByUid] uid: ", uid, e);
      return [];
    }
  };
  
  /**
   * ユーザIDがないものを取得する
   */
  export const getAnonymousBingoCard = async () => {
    try {
      // createdUidのカラムが存在しないものを取得する
      const querySnapshot = await firestore
        .collection("bingoCard")
        // uidがないものを取得するか、isPublicがtrueのものを取得する
        .where(
          Filter.or(
            Filter.where("createdUid", "==", ""),
            Filter.where("isPublic", "==", true)
          )
        )
        .orderBy("createdAt", "desc")
        .get();
      const bingoCard = querySnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate(),
        } as BingoCard;
      });
      return addBingoCreateUser(bingoCard);
    } catch (e) {
      console.error("[getAllBingoCard]", e);
      return [];
    }
  };
  
  /**
   * ビンゴカードに作成したユーザの情報を追加してBingoCardDetail型を返す
   */
  async function addBingoCreateUser(
    bingoCards: Book[]
  ): Promise<BingoCardDetail[]> {
    // bingoCardsに含まれるUidを取得する
    const uids = bingoCards.map((bingoCard) => bingoCard.createdUid);
    if (uids.length === 0) {
      return [];
    }
    // uidsのユーザ情報を取得する
    const querySnapshot = await firestore
      .collection("users")
      .where("uid", "in", uids)
      .get();
  
    // bingoCardsのそれぞれのセルにユーザ情報を追加する
    const bingoCardDetails = bingoCards.map((bingoCard) => {
      const user = querySnapshot.docs
        .map((doc) => doc.data())
        .find((user) => user.uid === bingoCard.createdUid);
      const bingoCardDetail = {
        ...bingoCard,
        createdUserDetail: user,
      } as BingoCardDetail;
      return bingoCardDetail;
    });
    return bingoCardDetails;
  }
  
  /**
   * ビンゴカードを新規作成する
   */
  export const addBingoCard = async (bingoCard: Book) => {
    try {
      const docRef = await firestore
        .collection("bingoCard")
        .doc(bingoCard.id)
        .set(bingoCard);
      console.log("[addBingoCard] docRef: ", docRef);
      return bingoCard.id;
    } catch (e) {
      console.error("[addBingoCard]", e);
    }
  };
  
  /**
   * ビンゴカードを更新する
   */
  export const updateBingoCard = async (
    bingoCardId: string,
    bingoPutRequest: BingoPutRequest
  ) => {
    try {
      const docRef = await firestore
        .collection("bingoCard")
        .doc(bingoCardId)
        .update({ ...bingoPutRequest });
    } catch (e) {
      console.error("[updateBingoCard]", e);
    }
  };
  
  /**
   * ビンゴカードにビンゴが成立したかを確認する
   * 直前の情報と比較して、ビンゴが成立していたら、その情報を返す。
   */
  export const checkBingoComplete = async (bingoCardId: string) => {
    try {
      // bingoCardIdのドキュメントの中のbingoCellIdのドキュメントを更新する
      const docRef = await firestore
        .collection("bingoCard")
        .doc(bingoCardId)
        .get();
      const bingoCard = docRef.data() as Book;
  
      const { completeBingoLines } = checkBingoOrReachLines(bingoCard);
  
      const beforeBingoLine = bingoCard.countOfBingoLine ?? 0;
  
      const response = {
        appearBingoComplete: beforeBingoLine < completeBingoLines.length, // 増えていたらビンゴが成立した
        appearBingoCount: completeBingoLines.length - beforeBingoLine, // 増えた数
        appearBingoCardComplete: completeBingoLines.length >= 8, // 8以上になったらビンゴカードが完成した
      } as AppearBingoCompleteDto;
  
      // 更新
      const updateDocRef = await firestore
        .collection("bingoCard")
        .doc(bingoCardId)
        .update({
          countOfBingoLine: completeBingoLines.length,
          completed: completeBingoLines.length >= 8,
        });
  
      return response;
    } catch (e) {
      console.error("[updateBingoCell]", e);
    }
  };