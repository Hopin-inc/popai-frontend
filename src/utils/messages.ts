
export const getMessageByAuthError = (code: string): string => {
  switch (code) {
    case "auth/invalid-email":
      return "無効なメールアドレスです。\n" +
        "正しく入力されているか確認してください。";
    case "auth/user-disable":
      return "アカウントが無効化されています。\n" +
        "お手数ですが、運営までお問い合わせください。";
    case "auth/user-not-found":
      return "メールアドレスが登録されていません。\n" +
        "正しく入力されているか確認してください。";
    case "auth/wrong-password":
      return "メールアドレスとパスワードが一致しません。\n" +
        "もう一度入力してください。";
    case "auth/too-many-requests":
      return "短時間に複数回ログインに失敗したため、一時的にロックされています。\n" +
        "しばらくしてからもう一度試してください。";
    default:
      return "ログインできませんでした。\n" +
        "ネットワークの接続状態を確認し、もう一度ログインしてください。";
  }
};

export const ErrorMessages = {
  EMAIL_NOT_VERIFIED: "ご利用には、メールアドレスの確認が必要です。\n" +
    "メールに記載されたURLにアクセスして、メールアドレスの確認を完了させてください。\n\n" +
    "メールの再送をご希望されますか？",
};

export const DialogMessages = {
  VERIFICATION_EMAIL_SENT: "ご登録のメールアドレス宛にメールが送信されます。\n" +
    "メールに記載されたURLにアクセスして、メールアドレスの確認を完了させてください。\n\n" +
    "※ 5分程度待ってもメールが届かない場合は、迷惑メールフォルダに振り分けられていないか、" +
    "また登録したメールアドレスが誤っていないか、ご確認ください。",

};
